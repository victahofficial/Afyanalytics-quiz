# Verified Staging Run Results

This file records a successful end-to-end test of the Afyanalytics staging handshake flow.

## Test Date

- Local date: `2026-04-23`
- Local timezone: `Africa/Nairobi`

## Step 1 Request

```json
{
  "platform_name": "Test Platform v2",
  "platform_key": "afya_2d00d74512953c933172ab924f5073fa",
  "platform_secret": "[REDACTED IN THIS FILE]",
  "callback_url": "http://localhost:5050/callback"
}
```

## Step 1 Response

```json
{
  "success": true,
  "message": "Handshake initiated successfully",
  "data": {
    "handshake_token": "[REDACTED]",
    "expires_at": "2026-04-23T21:59:23+03:00",
    "expires_in_seconds": 900,
    "next_step": "Complete handshake using /api/external/complete-handshake"
  }
}
```

## Step 2 Request

```json
{
  "handshake_token": "[REDACTED]",
  "platform_key": "afya_2d00d74512953c933172ab924f5073fa"
}
```

## Step 2 Response

```json
{
  "success": true,
  "message": "Handshake completed successfully",
  "data": {
    "access_token": "[REDACTED]",
    "refresh_token": "[REDACTED]",
    "token_type": "Bearer",
    "expires_at": "2026-04-24T03:44:24+03:00",
    "expires_in_seconds": 21600,
    "platform_name": "Test Platform v2"
  }
}
```

## Evidence Sources

- UI endpoint: `http://localhost:5050`
- Status endpoint: `http://localhost:5050/api/status`
- Flow endpoint: `POST http://localhost:5050/api/authenticate`
- Raw log file: generated locally during testing and intentionally excluded from Git

## Screenshot Guidance

To produce the screenshot requested in the PDF:

1. Start the server with `node server.js`
2. Open `http://localhost:5050`
3. Click `Run Full Flow`
4. Capture the browser page showing:
   - the current status
   - the last response
   - the request/response data reflected in the log file
