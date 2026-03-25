# iTelemetry Meatball/Long-Pit Alerting Design Note

## Chosen integration method
1. **Official API first:** no publicly documented official iTelemetry API was found during this implementation.
2. **Observed web behavior:** public session pages are readable without login and appear app-driven; this app scaffolds an HTTP adapter for browser-observed read-only endpoints, but leaves base URL configurable pending user-verified legal endpoint mapping.
3. **Fallback:** a Playwright adapter interface is included for user-driven authenticated scraping if needed.

Current default mode is **mock adapter** for safe/local testing.

## Required identifiers
- `sessionIdOrUrl`: full iTelemetry session URL (`/session/{id}`) or ID.
- `identity.driverName` and/or `identity.carNumber`.
- Optional `identity.preferredCarId` and `ambiguousMap` to resolve swaps/team ambiguity.

## Core computations
- **Same class:** `car.className === myCar.className`.
- **Ahead of me:** same-class cars with strictly lower numeric race position.
- If session type is practice/qualifying, ahead-of logic is degraded and UI shows warning.

## Meatball detection
- Prefer explicit race-control/event messages tagged as meatball.
- If explicit unavailable, infer from per-car flag/penalty state (`flags.meatball === true`) and mark confidence `inferred`.

## Long pitstop detection
- Compute class average pit duration from available same-class entries.
- Alert when an ahead-of-us same-class competitor pit duration exceeds class average by configured threshold (default 15%).
- Mark as `inferred`.

## Assumptions & limitations
- Live iTelemetry integration is isolated behind adapters; mock mode is production of app flow.
- HTTP adapter endpoint path is placeholder and must be validated with legal, user-owned session/network inspection.
- Playwright adapter requires user-managed login/session and selectors.
