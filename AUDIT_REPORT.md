# Travelora – Audit, Repair and Test Report

Date of audit: 23 Oct 2026. Based only on the files in the uploaded ZIP. The execution environment used for the audit had **no internet access, no Maven and no Spring/npm packages**, so a real Maven build, `npm install`, Vite build and live MongoDB test could **not** be run there. Section 3 states exactly what was and was not tested.

## 1. Issues found, evidence, fix, severity

| # | Severity | Issue and evidence | Fix |
|---|----------|--------------------|-----|
| 1 | High | **Booking page hard-coded a production URL.** `client/src/pages/Booking.jsx` called `https://travelora-e683.onrender.com/api/java/bookings`. It cannot be used locally or on another host, and bypasses the Node server. | Page now calls `api.createJavaBooking()` → relative `/api/java/bookings`. |
| 2 | High | **Node backend had no route to the Java service.** `server/server.js` mounted no `/api/java`; the Java service was not part of the Node/React architecture. | New `server/routes/javaBookings.js` proxies `/api/java/*` to `JAVA_BOOKING_SERVICE_URL` (timeouts, 502/504 JSON errors, no URL leak). Vite dev proxy sends all `/api` to Node. |
| 3 | High | **Fragile MongoDB configuration.** `application.properties` had `spring.mongodb.uri=${MONGODB_URI}` with no default and no validation. Missing variable → startup crash; a template value such as `mongodb+srv://<username>:<password>@...` is accepted at startup and only fails on the first database call, which surfaces as HTTP 500. This matches the reported Render symptom (placeholder username in the credential). The code itself cannot supply the real credential; the Render variable must be corrected by you. | Default URI for local use only; `MongoUriGuard` stops startup with a clear message if the URI contains `<`, `>` or `${`; database failures now return 503 with a generic body; `.env.example` files with placeholders only. Property name `spring.mongodb.uri` kept (Spring Boot 4.x name). |
| 4 | High | **No validation / error handling.** `BookingService` threw `IllegalArgumentException`, but there was no `@ControllerAdvice` or `@Valid`, so bad input produced HTTP 500; `BookingRepository` errors and malformed JSON also had no JSON handling. | `@Valid` DTO + `GlobalExceptionHandler`: 400 (validation, malformed JSON, past date), 404, 503, 500, all with safe messages. |
| 5 | High (security) | **Mass assignment.** `BookingController` bound the request body directly to the `Booking` entity, so a client could send `id`, `bookingId`, `status`, `createdAt`; a request containing an existing `id` would overwrite that booking on `save()`. | New `BookingRequest` DTO without server-controlled fields; server sets `bookingId`, `status`, `createdAt`. |
| 6 | Medium | **Source file in wrong folder.** `BookingService.java` (package `com.travelora.booking.service`) was stored in a folder literally named `booking.service`. javac accepts explicitly listed files, but VS Code/IDEs report a package/path mismatch and the layout is wrong. | Moved to `service/`. (You must also delete the old folder in your Git clone – see README.) |
| 7 | Medium | **Booking ID not guaranteed unique.** `new Random()` with 90 000 possibilities and no existence check; the Node model has a unique index on `bookingId` in the same collection. | `SecureRandom`, `existsByBookingId` check, retry on `DuplicateKeyException`. Same `TRV-<year>-<5 digits>` format. |
| 8 | Medium | **Dockerfile problems.** `COPY .mvn ./` copied the wrapper folder contents into `/app` (wrong target); `-DskipTests` still compiles tests; ran as root; no JVM memory setting. | Cleaned Dockerfile: `-Dmaven.test.skip=true`, non-root user, `MaxRAMPercentage`, correct `COPY`. |
| 9 | Medium | **Default test would fail without `MONGODB_URI`.** `contextLoads` uses `application.properties`; the placeholder had no default (see #3). | Default value added. |
| 10 | Medium | **Frontend booking UX.** No double-submit guard; `alert()` on failure; the server response was mostly ignored; confirmed bookings were never saved to the local list that My Trips displays. | Submit lock, inline error message, uses the server-returned booking, saved for My Trips, button disabled while processing. No fake success path. |
| 11 | Medium | **`createdAt` handling.** React sent an ISO string with `Z` into a `LocalDateTime` field (deserialisation risk), and `LocalDateTime` has no zone while Node stores a UTC `Date`. | Client value ignored (DTO); model uses `Instant`. |
| 12 | Medium | **`npm run dev` was broken.** `server/package.json` used `nodemon`, which is not a dependency and not in the lockfile (also breaks root `npm run dev`). | `node --watch server.js` (Node ≥ 18.11). Lockfiles untouched. |
| 13 | Low | `booking-service/.gitignore` did not ignore `.env`. | `.env`, `.env.*` ignored (examples allowed). Root `.gitignore` extended. |
| 14 | Low | Single root `.env.example`, but the Node server reads `.env` from the working folder and Spring Boot does not read `.env` at all. | Per-service `.env.example`; Node loads `server/.env` from any folder; Spring imports optional `./.env`. |
| 15 | Low | `server.js` did not serve the built React app and the Mongo failure log said "not running locally" even for authentication errors. | Serves `client/dist` when built; clearer, credential-safe log message; JSON 404 for unknown `/api` routes. |
| 16 | Info | **Unused/dead server files** (not changed): `server/app.js` (never imported), `config/db.js` (needs `mongodb-memory-server`, not a dependency), `middleware/errorMiddleware.js`, `controllers/destController.js`, and routers `flights`, `wishlist`, `ai` that are not mounted by `server.js`. The React app does not call them. | Left as they are to avoid unrequested changes. |
| 17 | Info | **Node demo fallbacks** in `server/controllers/bookingController.js` return success / a sample "Goa" booking even when the database save fails or the booking is missing. This is the "Academic Demo Mode" design. The booking page no longer uses `/api/bookings`. | Left unchanged; documented. |
| 18 | Info (limitation) | **No authentication on booking endpoints**; `GET /api/java/bookings/user/{userId}` lists any user's bookings and prices come from the client. Acceptable for a college demo, not for production. | Documented only (out of scope). |

## 2. Fields consistency
Booking JSON field names are identical in React (`Booking.jsx`), the Node `Booking` model/controller and the Java `Booking`/`BookingRequest` classes (`packageId, packageName, destination, duration, travelDate, travellersCount, travellersList[name,age,gender], roomTierName, contact{name,email,phone,specialRequests}, pricing{...}, paymentMethod, userId`). The *response shape* differs by design (Node: `{success, bookingId, booking}`; Java: the booking object itself); the React code reads `bookingId` at the top level, which both provide.

Java routes verified in code and kept: `POST /api/java/bookings`, `GET /api/java/bookings/{bookingId}`, `GET /api/java/bookings/user/{userId}`. Added: `GET /api/java/health`, `GET /api/java/health/db`.

## 3. Test results

### 3.1 Passed (actually executed)
| Check | How it was run | Result |
|-------|----------------|--------|
| Node syntax of all 42 server files | `node --check` | 0 errors |
| All `require('./...')` paths in server resolve to existing files | script | 0 missing |
| Syntax of all 45 client JS/JSX/config files, including the edited `Booking.jsx` and `api.js` | esbuild parser | 0 errors |
| Node proxy route (`routes/javaBookings.js`) against a real local HTTP server acting as the Java service, with a stand-in for `express` | Node script | 6/6 passed: POST forwarded with body, 201 passed through, 404 passed through, userId URL-encoded, route order, upstream down → 502 without leaking the URL |
| Java main sources compile (javac, Java 21) | **against hand-written stubs of the Spring/Jakarta/Mongo APIs, not the real libraries** | 0 errors |
| Java business/handler logic executed with an in-memory fake repository | stub harness | 27/27 passed: ID format, CONFIRMED status, defaults, past/invalid date and zero total rejected, ID collision retry, duplicate-key retry, lookup by ID/user, 400/404/503/500 mapping, no credentials in error bodies |
| `MongoUriGuard` placeholder detection | stub harness | 5/5 passed |
| JSON validity of the three `package.json` files | python | valid |
| Scan of the project for real credentials | grep | none (only the fake `secret-pass` string inside a unit test that proves secrets are not leaked) |

### 3.2 Failed
None of the checks above failed. (An attempt to run `npm ci` failed because the sandbox has no network; this is an environment limit, not a project failure.)

### 3.3 Could NOT be run – please run these yourself
| Not run | Why | Command |
|---------|-----|---------|
| **Maven build and JUnit tests** (`BookingServiceTest`, `BookingControllerTest`, `MongoUriGuardTest`, `contextLoads`) – the tests are written but have **never been executed**; only a syntax-level check found no syntax errors | no Maven, no internet, no Spring jars | `cd booking-service` → `.\mvnw.cmd clean test` → `.\mvnw.cmd clean package` |
| Starting the Spring Boot application | same | `.\mvnw.cmd spring-boot:run` |
| Real compile against Spring Boot 4.1.1 APIs (class/package names were written from knowledge of Spring Boot 4, not verified) | same | the Maven build above |
| Docker image build | no Docker | `docker build -t travelora-booking booking-service` |
| `npm install`, `npm run build` (Vite) for client and server | no internet | see README step 3 and 7 |
| End-to-end browser test of the booking page | no browser/network stack | README step 6 |
| `scripts/test-booking-api.ps1` | no PowerShell in the sandbox | README step 8 |
| **Live MongoDB write/read** | no database credentials and no network | README steps 8-9 |
| Live Render deployment | not attempted; no changes were made to any remote service or repository | README "Deploy on Render" |

### 3.4 Manual steps still required from you
1. Install JDK 25 LTS and run `.\mvnw.cmd clean test`; send me the output if anything fails.
2. Put a **real** `MONGODB_URI` in `booking-service\.env` and `server\.env` (no `<` `>`), then run steps 6-9 of the README.
3. In Render, correct `MONGODB_URI` on the Java service (the placeholder username is the likely cause of the original HTTP 500), add `JAVA_BOOKING_SERVICE_URL` to the Node service, and redeploy after you merge.
4. In your Git clone, delete the old folder `booking-service/src/main/java/com/travelora/booking.service` (README step 4 of the Git section).
5. If a real database password was ever committed, pasted in a log or screenshot, rotate it in MongoDB Atlas.
