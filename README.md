# Afyanalytics External Platform Integration Test

This project is a complete submission-ready implementation of the developer test described in `LREB Developer Test Question.pdf`. It builds a small external service that integrates with the Afyanalytics staging API using the required two-step handshake flow.

## What This Delivers

The service:

- initiates the handshake using `POST /initiate-handshake`
- stores the returned `handshake_token` and `expires_at`
- completes the handshake using `POST /complete-handshake`
- blocks reuse of expired handshake tokens
- logs request and response activity for screenshot and audit purposes
- exposes a simple browser UI for testing and capturing submission evidence
- handles invalid credentials, expired tokens, and network/API failures

## Assignment Inputs

The assignment PDF provides the following staging credentials:

- Platform Name: `Test Platform v2`
- Platform Key: `afya_2d00d74512953c933172ab924f5073fa`
- Platform Secret: provided in `.env.example`
- API Base URL: `https://staging.collabmed.net/api/external`

## Project Structure

```text
afya-integration-test/
  .env.example
  package.json
  server.js
  README.md
  STACK-NOTES.md
  logs/
  public/
    index.html
    styles.css
```

## Setup Instructions

1. Open a terminal in [afya-integration-test](C:/Users/Admin/Desktop/flamingo-website/afya-integration-test).
2. Copy `.env.example` to `.env`.
3. Review the values and update `CALLBACK_URL` if your local port or deployed URL is different.
4. Start the server:

```bash
node server.js
```

5. Open `http://localhost:5050`.

## How The Handshake Flow Is Implemented

### Step 1: Initiate Handshake

The service sends:

```json
{
  "platform_name": "Test Platform v2",
  "platform_key": "afya_2d00d74512953c933172ab924f5073fa",
  "platform_secret": "<secret>",
  "callback_url": "http://localhost:5050/callback"
}
```

to:

```text
POST https://staging.collabmed.net/api/external/initiate-handshake
```

On success, the response is stored in memory and logged to `logs/handshake-log.jsonl`. The service keeps:

- `handshake_token`
- `expires_at`
- `expires_in_seconds`

### Step 2: Complete Handshake

The service sends:

```json
{
  "handshake_token": "<token from step 1>",
  "platform_key": "afya_2d00d74512953c933172ab924f5073fa"
}
```

to:

```text
POST https://staging.collabmed.net/api/external/complete-handshake
```

On success, the service stores:

- `access_token`
- `refresh_token`
- `expires_at`
- `token_type`
- `platform_name`

## How Expiry Is Handled

The assignment states that the handshake token expires in 15 minutes. This implementation handles that in three ways:

1. The service stores `handshakeExpiresAt` after initiation.
2. Before completing the handshake with a stored token, it checks whether the token is already expired.
3. If the token is expired, the service rejects the completion request and requires a fresh handshake.

The `Run Full Flow` button uses a safer approach for demos and submission evidence: it initiates and completes the handshake immediately in one flow so the 15-minute window is not missed.

## Test Routes

- `GET /` - browser UI for running the flow
- `GET /api/status` - current token and flow state
- `POST /api/initiate` - initiate handshake only
- `POST /api/complete` - complete handshake using the stored token
- `POST /api/authenticate` - run initiate and complete as one sequence
- `GET /callback` - callback endpoint configured for the test

## Logging And Screenshot Evidence

The assignment asks for a screenshot of the request parameters and response. This project supports that in two ways:

1. The browser UI shows the current status and last API response.
2. Every request and response is written to:

```text
logs/handshake-log.jsonl
```

That file can be used to verify:

- the exact payload sent
- whether the secret was redacted in local logs
- the returned handshake token
- the expiry time
- success or failure of the authentication flow

## Error Handling

The service catches and reports:

- invalid credentials
- expired handshake token
- missing environment variables
- network failures
- invalid or non-JSON API responses
- unknown routes

## Submission Checklist

- Source code: included in this folder
- README with setup and implementation details: included
- Expiry handling explanation: included
- Request/response screenshot: capture from the browser UI after running the flow
- Email destination from the PDF: `data@afya.ai`

## Verified Test Run

This implementation was successfully tested against the staging API on `2026-04-23`.

- Successful run details: [RUN-RESULTS.md](C:/Users/Admin/Desktop/flamingo-website/afya-integration-test/RUN-RESULTS.md)
- Raw request and response log: generated locally during testing and intentionally excluded from Git

## Notes About The Afya Website And Technology Choices

See [STACK-NOTES.md](C:/Users/Admin/Desktop/flamingo-website/afya-integration-test/STACK-NOTES.md) for a clear explanation of which language is used where and why, based on public information from `https://afya.ai`.
