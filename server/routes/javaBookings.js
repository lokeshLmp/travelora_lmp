// Proxy from the Node.js API to the Java Spring Boot booking service.
//
//   Browser  ->  Node  /api/java/...   ->  Java  /api/java/...
//
// The React app always calls the Node server (same origin, no CORS problems) and the
// Java service URL stays private. Configure it with JAVA_BOOKING_SERVICE_URL.
const express = require('express');

const router = express.Router();

// Render free instances sleep; the Java service can need ~1 minute to wake up.
const TIMEOUT_MS = Number(process.env.JAVA_BOOKING_TIMEOUT_MS) || 90000;

const javaBaseUrl = () =>
  (process.env.JAVA_BOOKING_SERVICE_URL || 'http://localhost:8081').replace(/\/+$/, '');

async function forward(res, javaPath, options = {}) {
  try {
    const upstream = await fetch(`${javaBaseUrl()}${javaPath}`, {
      ...options,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body = await upstream.text();
    res.status(upstream.status);
    res.type(upstream.headers.get('content-type') || 'application/json');
    return res.send(body);
  } catch (err) {
    const timedOut = err && (err.name === 'TimeoutError' || err.name === 'AbortError');
    // Log only the error type: never the URL, which could be configured with credentials.
    console.error('[Travelora] Java booking service call failed:', err && ((err.cause && err.cause.code) || err.code || err.name));
    return res.status(timedOut ? 504 : 502).json({
      success: false,
      message: timedOut
        ? 'The booking service took too long to respond. It may be starting up - please try again in a minute.'
        : 'The booking service is currently unreachable. Please try again later.',
    });
  }
}

// Create a booking
router.post('/bookings', (req, res) =>
  forward(res, '/api/java/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body || {}),
  })
);

// All bookings of one user (declared before '/bookings/:bookingId')
router.get('/bookings/user/:userId', (req, res) =>
  forward(res, `/api/java/bookings/user/${encodeURIComponent(req.params.userId)}`)
);

// One booking by booking ID
router.get('/bookings/:bookingId', (req, res) =>
  forward(res, `/api/java/bookings/${encodeURIComponent(req.params.bookingId)}`)
);

// Health checks of the Java service (useful for demos and deployment checks)
router.get('/health', (req, res) => forward(res, '/api/java/health'));
router.get('/health/db', (req, res) => forward(res, '/api/java/health/db'));

module.exports = router;
