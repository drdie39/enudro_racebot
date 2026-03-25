# iTelemetry Class-Ahead Alert Bot

## CURRENT STATUS
**Live iTelemetry integration: PARTIALLY WORKING (mock default + pluggable live adapter scaffold).**

- ✅ Full end-to-end app logic works in demo mode with mock race data.
- ✅ Legal-safe architecture isolates iTelemetry adapter.
- ⚠️ Live adapter endpoint path must be confirmed from user-observed browser network calls or official docs.

## What this app does
- Monitors a session.
- Finds your car by driver name and/or car number.
- Tracks same-class cars ahead of you.
- Alerts on:
  - meatball flags (explicit preferred, inferred fallback),
  - long pit stops (> configurable threshold over class average; default 15%).
- Sends alerts to UI, terminal logs, and Discord (webhook or bot).
- Prevents duplicate alerts until condition clears and reappears.

## Stack
- Backend: Node.js + TypeScript + Express + SSE
- Frontend: Next.js
- Discord: webhook and bot modes

## Quick start
```bash
cp .env.example .env
docker compose up --build
```
Open http://localhost:3000.

## Configuration
Use dashboard settings or `config.sample.json` as reference.
Required:
- Session URL/ID
- Your driver name or car number

Optional:
- Discord role ID
- Discord webhook OR bot token/channel
- Polling interval
- Long pit-stop threshold percent

## Integration approach summary
See `docs/technical-design.md` for full details.

## Tests
```bash
cd backend
npm test
```

## Final project tree
```text
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── core
│   │   ├── data
│   │   └── integrations
│   └── tests
├── frontend
│   └── src
│       ├── app
│       ├── lib
│       └── ui
├── docs
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── config.sample.json
```

## Remaining manual steps for live iTelemetry
1. Confirm official/public read-only endpoint legality.
2. Capture browser network calls while logged in normally.
3. Populate `ITELEMETRY_HTTP_BASE_URL` and adjust `HttpITelemetryAdapter` response mapping.
4. If no stable endpoint exists, implement authenticated Playwright adapter selectors.
5. Add integration test with recorded sample payload.
