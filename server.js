const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const ROOT_DIR = __dirname;
const PUBLIC_DIR = fs.existsSync(path.join(ROOT_DIR, "public"))
  ? path.join(ROOT_DIR, "public")
  : path.join(ROOT_DIR, "afya-integration-test", "public");
const LOG_DIR = path.join(ROOT_DIR, "logs");
const LOG_FILE = path.join(LOG_DIR, "handshake-log.jsonl");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(ROOT_DIR, ".env"));
loadEnvFile(path.join(ROOT_DIR, ".env.example"));

const config = {
  port: Number(process.env.PORT || 5050),
  platformName: process.env.AFYA_PLATFORM_NAME || "",
  platformKey: process.env.AFYA_PLATFORM_KEY || "",
  platformSecret: process.env.AFYA_PLATFORM_SECRET || "",
  apiBaseUrl:
    process.env.AFYA_API_BASE_URL || "https://staging.collabmed.net/api/external",
  callbackUrl: process.env.CALLBACK_URL || "http://localhost:5050/callback"
};

const state = {
  handshakeToken: null,
  handshakeExpiresAt: null,
  accessToken: null,
  refreshToken: null,
  authExpiresAt: null,
  lastError: null,
  lastSuccess: null,
  logs: []
};

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function appendLog(entry) {
  ensureLogDir();
  const enriched = {
    timestamp: new Date().toISOString(),
    ...entry
  };
  state.logs.unshift(enriched);
  state.logs = state.logs.slice(0, 25);
  fs.appendFileSync(LOG_FILE, JSON.stringify(enriched) + "\n");
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function sendHtml(res, html) {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Length": Buffer.byteLength(html)
  });
  res.end(html);
}

function sendStaticFile(res, filePath) {
  if (!fs.existsSync(filePath)) {
    sendJson(res, 404, { success: false, message: "File not found" });
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType =
    ext === ".css"
      ? "text/css; charset=utf-8"
      : ext === ".js"
        ? "text/javascript; charset=utf-8"
        : "text/html; charset=utf-8";

  const content = fs.readFileSync(filePath);
  res.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": content.length
  });
  res.end(content);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1024 * 1024) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function parseJson(body) {
  if (!body) {
    return {};
  }
  return JSON.parse(body);
}

function isExpired(isoTime) {
  if (!isoTime) {
    return true;
  }
  return Date.now() >= new Date(isoTime).getTime();
}

function redactToken(token) {
  if (!token) {
    return null;
  }
  if (token.length <= 12) {
    return token;
  }
  return `${token.slice(0, 6)}...${token.slice(-4)}`;
}

function buildHeaders() {
  return {
    "Content-Type": "application/json",
    Accept: "application/json"
  };
}

async function requestAfya(endpoint, payload) {
  const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload)
  });

  const rawText = await response.text();
  let json;

  try {
    json = rawText ? JSON.parse(rawText) : {};
  } catch (error) {
    json = {
      success: false,
      message: "Afya API returned a non-JSON response",
      rawText
    };
  }

  return {
    ok: response.ok,
    status: response.status,
    data: json
  };
}

function getStatusPayload() {
  return {
    config: {
      platformName: config.platformName,
      platformKey: config.platformKey,
      apiBaseUrl: config.apiBaseUrl,
      callbackUrl: config.callbackUrl
    },
    state: {
      handshakeToken: state.handshakeToken,
      handshakeTokenPreview: redactToken(state.handshakeToken),
      handshakeExpiresAt: state.handshakeExpiresAt,
      handshakeExpired: isExpired(state.handshakeExpiresAt),
      accessTokenPreview: redactToken(state.accessToken),
      refreshTokenPreview: redactToken(state.refreshToken),
      authExpiresAt: state.authExpiresAt,
      authExpired: isExpired(state.authExpiresAt),
      lastError: state.lastError,
      lastSuccess: state.lastSuccess
    },
    recentLogs: state.logs
  };
}

async function initiateHandshake() {
  const payload = {
    platform_name: config.platformName,
    platform_key: config.platformKey,
    platform_secret: config.platformSecret,
    callback_url: config.callbackUrl
  };

  appendLog({
    action: "initiate-handshake:request",
    payload: {
      ...payload,
      platform_secret: "[REDACTED]"
    }
  });

  const result = await requestAfya("/initiate-handshake", payload);

  appendLog({
    action: "initiate-handshake:response",
    status: result.status,
    payload: result.data
  });

  if (!result.ok || !result.data.success) {
    state.lastError = {
      step: "initiate-handshake",
      status: result.status,
      message: result.data.message || "Handshake initiation failed"
    };
    throw new Error(state.lastError.message);
  }

  state.handshakeToken = result.data?.data?.handshake_token || null;
  state.handshakeExpiresAt = result.data?.data?.expires_at || null;
  state.lastError = null;

  return result.data;
}

async function completeHandshake(handshakeToken) {
  const tokenToUse = handshakeToken || state.handshakeToken;

  if (!tokenToUse) {
    throw new Error("No handshake token available. Initiate the handshake first.");
  }

  if (handshakeToken == null && isExpired(state.handshakeExpiresAt)) {
    throw new Error("Stored handshake token is expired. Initiate a new handshake.");
  }

  const payload = {
    handshake_token: tokenToUse,
    platform_key: config.platformKey
  };

  appendLog({
    action: "complete-handshake:request",
    payload: {
      ...payload,
      handshake_token: redactToken(tokenToUse)
    }
  });

  const result = await requestAfya("/complete-handshake", payload);

  appendLog({
    action: "complete-handshake:response",
    status: result.status,
    payload: result.data
  });

  if (!result.ok || !result.data.success) {
    state.lastError = {
      step: "complete-handshake",
      status: result.status,
      message: result.data.message || "Handshake completion failed"
    };
    throw new Error(state.lastError.message);
  }

  state.accessToken = result.data?.data?.access_token || null;
  state.refreshToken = result.data?.data?.refresh_token || null;
  state.authExpiresAt = result.data?.data?.expires_at || null;
  state.lastError = null;
  state.lastSuccess = {
    step: "complete-handshake",
    completedAt: new Date().toISOString(),
    platformName: result.data?.data?.platform_name || config.platformName
  };

  return result.data;
}

async function runFullAuthentication() {
  const initiated = await initiateHandshake();
  const completed = await completeHandshake();
  return { initiated, completed };
}

function validateConfig() {
  const missing = [];

  if (!config.platformName) {
    missing.push("AFYA_PLATFORM_NAME");
  }
  if (!config.platformKey) {
    missing.push("AFYA_PLATFORM_KEY");
  }
  if (!config.platformSecret) {
    missing.push("AFYA_PLATFORM_SECRET");
  }
  if (!config.apiBaseUrl) {
    missing.push("AFYA_API_BASE_URL");
  }
  if (!config.callbackUrl) {
    missing.push("CALLBACK_URL");
  }

  return missing;
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (req.method === "GET" && requestUrl.pathname === "/") {
      sendStaticFile(res, path.join(PUBLIC_DIR, "index.html"));
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/styles.css") {
      sendStaticFile(res, path.join(PUBLIC_DIR, "styles.css"));
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/callback") {
      sendHtml(
        res,
        `<!doctype html><html><body><h1>Callback received</h1><p>This endpoint is configured as the callback URL for the Afyanalytics handshake test.</p></body></html>`
      );
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/status") {
      sendJson(res, 200, {
        success: true,
        ...getStatusPayload()
      });
      return;
    }

    if (req.method === "POST" && requestUrl.pathname === "/api/initiate") {
      const missing = validateConfig();
      if (missing.length) {
        sendJson(res, 400, {
          success: false,
          message: "Missing required environment variables",
          missing
        });
        return;
      }

      const data = await initiateHandshake();
      sendJson(res, 200, {
        success: true,
        message: "Handshake initiated successfully",
        data,
        status: getStatusPayload().state
      });
      return;
    }

    if (req.method === "POST" && requestUrl.pathname === "/api/complete") {
      const body = parseJson(await readRequestBody(req));
      const data = await completeHandshake(body.handshake_token);
      sendJson(res, 200, {
        success: true,
        message: "Handshake completed successfully",
        data,
        status: getStatusPayload().state
      });
      return;
    }

    if (req.method === "POST" && requestUrl.pathname === "/api/authenticate") {
      const missing = validateConfig();
      if (missing.length) {
        sendJson(res, 400, {
          success: false,
          message: "Missing required environment variables",
          missing
        });
        return;
      }

      const data = await runFullAuthentication();
      sendJson(res, 200, {
        success: true,
        message: "Full authentication flow completed successfully",
        data,
        status: getStatusPayload().state
      });
      return;
    }

    sendJson(res, 404, {
      success: false,
      message: `Route not found: ${req.method} ${requestUrl.pathname}`
    });
  } catch (error) {
    appendLog({
      action: "request:error",
      route: `${req.method} ${requestUrl.pathname}`,
      error: error.message
    });

    sendJson(res, 500, {
      success: false,
      message: error.message,
      state: getStatusPayload().state
    });
  }
});

server.listen(config.port, () => {
  ensureLogDir();
  console.log(
    `Afya integration test server is running on http://localhost:${config.port}`
  );
});
