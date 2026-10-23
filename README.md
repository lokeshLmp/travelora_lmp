# TRAVELORA — Smart Travel Booking System

> **"Plan less. Travel more."**  
> An academic, modern, centralized travel discovery and booking platform built with **React**, **Tailwind CSS**, **Node.js**, **Express**, **MongoDB** and a **Java Spring Boot booking service**.

---

## 📌 Problem Statement
Travel information, flight options, hotel bookings, and tour packages are often scattered across disparate platforms. **TRAVELORA** provides a unified, centralized travel booking experience that simplifies destination search, curated package reservations, transparent cost breakdowns, and itinerary management.

---

## 🚀 Key Features

### 🌟 1. Premium Frontend UI/UX
- **Modern Luxury Aesthetic**: Styled with Deep Navy (`#0B1F33`), Sky Blue (`#2F80ED`), and Warm Orange (`#FF8A3D`).
- **Dynamic Hero & Search Tabs**: Switch between Packages, Hotels, and Flights with location, dates, and budget selectors.
- **Personalized Recommendations**: "Trips you might love" matched to user travel styles and budget preferences.
- **Travel Inspiration Section**: Editorial guides and travel tips.
- **Verified Reviews**: Authentic traveler testimonials.

### 🧭 2. Exploration & Filtering
- **Destinations (`/destinations`)**: Filter by category (*Beach, Mountains, Nature, Heritage, Adventure, City*), price slider, and rating.
- **Destination Details (`/destinations/:id`)**: Best time to visit, estimated budget, top attractions, things to do, and matching holiday packages.
- **Packages (`/packages`)**: Multi-day all-inclusive holiday packages with full day-by-day itineraries and inclusions/exclusions.
- **Hotels (`/hotels`)**: Search by city, check-in date, rating, and amenity filters (*Pool, Spa, Beachfront, Mountain View*).

### 💳 3. Realistic 7-Step Booking Flow
1. **Package & Room Selection** (Standard, Premium, Luxury Villa)
2. **Travel Dates & Guest Count**
3. **Lead Booker & Passenger Details**
4. **Review & Travel Insurance Add-on**
5. **Simulated Payment Gateway** (UPI / Card / NetBanking)
6. **Processing Animation**
7. **Confirmed Booking Voucher** with unique Booking ID (e.g. `TRV-2026-94812`), printable summary receipt, and celebration confetti.

### 📊 4. Dynamic Transparent Price Breakdown
- Dynamically itemizes:
  - Base Package Price × Travellers
  - Accommodation Upgrade Tier
  - Comprehensive Insurance
  - Goods & Services Tax (12% GST)
  - Convenience Service Fee
  - Promo Discount (e.g., `TRAVEL500`, `TRAVEL1000`)
  - Net Payable Total

### 🛡️ 5. User Account & Admin Dashboard
- **My Trips (`/my-trips`)**: Manage Upcoming, Completed, and Cancelled trips with instant voucher downloading.
- **Wishlist (`/wishlist`)**: Real-time heart-saved items across packages, destinations, and hotels.
- **Profile (`/profile`)**: Manage contact info and personalized travel preferences.
- **Admin Dashboard (`/admin`)**: Visual KPI metrics (Revenue, Bookings, Users, Packages), monthly volume bar chart, popular destination shares, and full Package Inventory CRUD.

### 🎓 6. Built-in Academic Demo Mode
- **Zero-Setup Resilience**: Works out of the box even if MongoDB is not running locally. The frontend and backend automatically fallback to rich demo datasets and local storage.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React Icons, React Router v6, Canvas Confetti |
| **Backend (Node)** | Node.js, Express.js, REST APIs, JSON Web Tokens (JWT), Bcrypt.js |
| **Booking service (Java)** | Java 25 LTS, Spring Boot 4.1.1, Spring Web MVC, Spring Data MongoDB, Jakarta Bean Validation, Maven |
| **Database** | MongoDB & Mongoose (Node) / Spring Data MongoDB (Java), with Demo Mode fallback for the Node data |

> Travelora is a **full-stack travel booking project with a Java Spring Boot booking service**. It is *not* a fully Java-based project: the website is React, the main API is Node.js/Express, and the booking workflow is handled by Java.

---

## 📁 Project Structure

```
travelora/
├── client/                      # React + Vite frontend (port 5173 in development)
│   ├── src/{components,pages,layouts,hooks,services,utils,data}
│   ├── .env.example
│   └── package.json
├── server/                      # Node.js / Express API (port 5000)
│   ├── routes/javaBookings.js   # NEW: forwards /api/java/* to the Java service
│   ├── routes/, controllers/, models/, middleware/, services/, data/, seed/
│   ├── .env.example
│   └── server.js                # entry point
├── booking-service/             # Java Spring Boot booking service (port 8081)
│   ├── src/main/java/com/travelora/booking/
│   │   ├── BookingServiceApplication.java
│   │   ├── controller/   BookingController, HealthController
│   │   ├── service/      BookingService
│   │   ├── repository/   BookingRepository
│   │   ├── model/        Booking, Contact, Pricing, Traveller
│   │   ├── dto/          BookingRequest, ApiError
│   │   ├── exception/    GlobalExceptionHandler, BookingNotFoundException, InvalidBookingException
│   │   └── config/       MongoUriGuard, CorsConfig
│   ├── src/main/resources/application.properties
│   ├── src/test/java/...            # unit + HTTP-level tests
│   ├── Dockerfile, pom.xml, mvnw, mvnw.cmd, .mvn/
│   ├── test-booking.http            # sample requests for the VS Code REST Client extension
│   └── .env.example
├── scripts/test-booking-api.ps1 # PowerShell smoke test of the booking API
├── AUDIT_REPORT.md              # what was found, fixed and tested
├── package.json                 # root scripts (dev, build, render-build)
└── README.md
```

## 🔀 How a booking flows through the system

```
React Booking page ──POST /api/java/bookings──▶ Node.js server ──forwards──▶ Java Spring Boot ──▶ MongoDB
 (client)              same origin, no CORS        (server/routes/javaBookings.js)  (booking-service)
      ◀───────────── saved booking (real bookingId) ◀──────────────────────────────┘
```

* The React app only talks to the Node server (`/api/...`). In development Vite proxies `/api` to Node (port 5000); in production Node serves the built React app itself.
* Node forwards `/api/java/*` to the URL in `JAVA_BOOKING_SERVICE_URL`.
* The Java service validates the booking, generates the booking ID, saves it to MongoDB and returns it.
* If the Java service or database fails, the booking page shows an error and does **not** show a success screen.

---

# 💻 Run on Windows (VS Code + PowerShell)

All commands are for **Windows PowerShell**. Replace `C:\Projects` with any folder you like.

## 1. Install the required tools (once)

| Tool | Version | Check command |
| :--- | :--- | :--- |
| Node.js (LTS) + npm | Node 18.11 or newer (20 or 22 LTS recommended) | `node -v` ; `npm -v` |
| Java JDK | **25 LTS** (Temurin/OpenJDK) | `java -version` ; `javac -version` |
| Git | any recent | `git --version` |
| MongoDB | free MongoDB Atlas cluster **or** local MongoDB | see step 5 |

Maven does **not** need to be installed: the project includes the Maven wrapper (`mvnw.cmd`). It needs `JAVA_HOME` to point to a JDK 25 LTS and an internet connection the first time (to download Maven and the Spring libraries).

```powershell
java -version      # must show version 25
javac -version     # must also work (a JDK, not only a JRE)
echo $env:JAVA_HOME
```
If `JAVA_HOME` is empty, set it for the current terminal (adjust the path to your JDK folder):
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-25.0.x"
```

## 2. Extract the ZIP and open the project

```powershell
Expand-Archive -Path "$HOME\Downloads\travelora-fixed.zip" -DestinationPath "C:\Projects" -Force
cd C:\Projects\travelora
code .
```
Open the folder that directly contains `client`, `server` and `booking-service` (the folder named `travelora`). In VS Code use **Terminal → New Terminal** and split it (three terminals are needed).

## 3. Install dependencies

Run these in the project root (`C:\Projects\travelora`):
```powershell
npm install
npm --prefix client install
npm --prefix server install
```

## 4. Create your environment files (secrets stay on your computer)

```powershell
Copy-Item server\.env.example server\.env
Copy-Item booking-service\.env.example booking-service\.env
notepad server\.env
notepad booking-service\.env
```
* Replace placeholders such as `<DB_USERNAME>` with real values. **Remove the `<` and `>` characters too.**
* `MONGODB_URI` must be the **same connection string, including the database name**, in both files.
* `.env` files are in `.gitignore`. Never commit them, paste them in chats or take screenshots of them.

## 5. MongoDB: pick one

* **Atlas (recommended, free):** create a cluster → *Database Access*: create a user (password without special characters is easiest, otherwise URL-encode it) → *Network Access*: allow your IP → *Connect → Drivers*: copy the connection string, put your user/password in it and add the database name, for example `.../travelora?retryWrites=true&w=majority`.
* **Local MongoDB:** install MongoDB Community Server, or if you have Docker: `docker run -d --name travelora-mongo -p 27017:27017 mongo:7`. The default URI `mongodb://localhost:27017/travelora` then works.

## 6. Start the three services (three separate terminals)

**Terminal 1 – Java booking service (port 8081)**
```powershell
cd C:\Projects\travelora\booking-service
.\mvnw.cmd spring-boot:run
```
Wait for `Started BookingServiceApplication`. Check: <http://localhost:8081/api/java/health> and <http://localhost:8081/api/java/health/db> (`"database":"UP"` means MongoDB works).

**Terminal 2 – Node.js backend (port 5000)**
```powershell
cd C:\Projects\travelora\server
npm run dev
```

**Terminal 3 – React frontend (port 5173)**
```powershell
cd C:\Projects\travelora\client
npm run dev
```
Open <http://localhost:5173>, choose a package, complete the booking steps and press **Pay & Confirm**. The confirmation shows the booking ID generated by the Java service, and the booking appears in **My Trips**.

## 7. Run tests and builds

```powershell
# Java: compile + unit tests + HTTP-level API tests (run in booking-service)
cd C:\Projects\travelora\booking-service
.\mvnw.cmd clean test
.\mvnw.cmd clean package          # builds target\booking-service-0.0.1-SNAPSHOT.jar

# Node: syntax check
cd C:\Projects\travelora\server
node --check server.js
node --check routes\javaBookings.js

# React: production build
cd C:\Projects\travelora\client
npm run build
```

## 8. Test the booking API from PowerShell

With the Java service running (Terminal 1):
```powershell
cd C:\Projects\travelora
powershell -ExecutionPolicy Bypass -File .\scripts\test-booking-api.ps1
# Same checks through the Node server (Terminal 2 must run too):
powershell -ExecutionPolicy Bypass -File .\scripts\test-booking-api.ps1 -BaseUrl http://localhost:5000
```
The script checks health, creates a booking, sends invalid bookings (expects HTTP 400), reads the booking back by ID and by user, and asks for an unknown booking (expects HTTP 404). It exits with code 0 only if everything passed.

A single manual request:
```powershell
$date = (Get-Date).AddDays(14).ToString("yyyy-MM-dd")
$body = @"
{ "userId":"demo-user","packageId":"goa-escape","packageName":"Goa Escape","destination":"Goa",
  "duration":"4 Days / 3 Nights","travelDate":"$date","travellersCount":2,
  "travellersList":[{"name":"Lokesh","age":"18","gender":"Male"},{"name":"Test User","age":"20","gender":"Female"}],
  "roomTierName":"Standard Deluxe Room",
  "contact":{"name":"Lokesh","email":"test@example.com","phone":"9999999999","specialRequests":""},
  "pricing":{"basePrice":14999,"travellerCount":2,"baseSubtotal":29998,"roomCost":0,"insuranceCost":0,"subtotal":29998,"taxes":0,"serviceFee":0,"discount":0,"total":29998},
  "paymentMethod":"upi" }
"@
Invoke-RestMethod -Method Post -Uri http://localhost:8081/api/java/bookings -ContentType "application/json" -Body $body
```

## 9. Verify MongoDB persistence

1. Create a booking (step 8) and note its `bookingId`.
2. In **MongoDB Atlas → Browse Collections** (or MongoDB Compass) open database `travelora` → collection `bookings` and find the document with that `bookingId`.
3. Stop the Java service (Ctrl+C), start it again and call `Invoke-RestMethod http://localhost:8081/api/java/bookings/<bookingId>`. The booking is still returned, so it was stored in MongoDB and not in memory.

---

# ☁️ Git & GitHub: review, then push safely

The repository is <https://github.com/lokeshLmp/travelora>. Nothing below force-pushes, deletes branches or changes `main`.

```powershell
# 1. Go to your EXISTING local clone (not the extracted ZIP) and check where you are
cd C:\path\to\your\travelora-clone
git status
git branch --show-current
git fetch origin

# 2. Work on a NEW branch so main (and the currently deployed code) stays untouched
git switch -c fix/java-booking-integration

# 3. Copy the corrected files over your clone. /E copies subfolders; it does NOT delete anything.
#    .git, node_modules, build output and .env files are skipped.
robocopy "C:\Projects\travelora" "C:\path\to\your\travelora-clone" /E /XD .git node_modules target dist /XF .env

# 4. IMPORTANT: remove the old mis-placed Java file (the folder name with a dot was a bug)
git rm -r --ignore-unmatch "booking-service/src/main/java/com/travelora/booking.service"

# 5. Review everything before committing
git status
git diff --stat
git diff                    # read it; press q to quit
git status --short | Select-String "\.env$"      # must print nothing

# 6. Commit and push the new branch (a normal push - no --force)
git add -A
git commit -m "Fix Java booking service, integrate it via Node, add validation, tests and docs"
git push -u origin fix/java-booking-integration
```
Then open the GitHub link printed by `git push`, create a **Pull Request**, review the file list, and merge it yourself when satisfied. Render redeploys `main` only after you merge.

If you ever pasted a real MongoDB password into a file, a commit, a screenshot or a log: check with `git log --all --oneline -- "*.env"` and, if it was exposed, **rotate the Atlas database user's password** (changing the password is safer than trying to rewrite history).

---

# 🚀 Deploy on Render

Never type secrets into files or commands. Set them in the Render dashboard: **service → Environment → Add Environment Variable**. Check in the dashboard which of your existing services is the Docker (Java) one and which is the Node one before changing anything. The old frontend code called `https://travelora-e683.onrender.com/api/java/bookings`, so `travelora-e683` is probably your Java service, but confirm it in the dashboard.

### Service 1 – Java booking service (Web Service, Docker)
| Setting | Value |
| :--- | :--- |
| Runtime | Docker |
| Root Directory | `booking-service` |
| Dockerfile Path | `./Dockerfile` |
| Health Check Path | `/api/java/health` |
| Env var `MONGODB_URI` | your **complete real** connection string, e.g. `mongodb+srv://myUser:myEncodedPassword@cluster0.xxxxx.mongodb.net/travelora?retryWrites=true&w=majority` – no `<` `>` characters, no quotes |
| Env var `CORS_ALLOWED_ORIGINS` (optional) | your website URL |

Render sets `PORT` itself; the app reads it. In MongoDB Atlas → *Network Access* allow Render to connect (for a college demo, `0.0.0.0/0` is the simple option; use a strong database password). If `MONGODB_URI` still contains a placeholder, the service now stops at startup with the message *"MONGODB_URI still contains a placeholder"* instead of returning HTTP 500 later.

### Service 2 – Node.js backend + React site (Web Service, Node)
| Setting | Value |
| :--- | :--- |
| Root Directory | (leave empty = repository root) |
| Build Command | `npm run render-build` |
| Start Command | `npm start` |
| Env var `MONGODB_URI` | same connection string as above |
| Env var `JWT_SECRET` | a long random value you generate |
| Env var `JAVA_BOOKING_SERVICE_URL` | URL of Service 1, e.g. `https://<your-booking-service>.onrender.com` (no trailing `/`) |
| Env var `NODE_ENV` | `production` |

Free Render services sleep when idle: the first booking after a pause can take up to a minute (the website waits up to 90 seconds before showing an error).

### Verify the live deployment
Replace the hosts with your real URLs:
```powershell
Invoke-RestMethod https://<your-booking-service>.onrender.com/api/java/health
Invoke-RestMethod https://<your-booking-service>.onrender.com/api/java/health/db     # database = UP
Invoke-RestMethod https://<your-node-service>.onrender.com/api/java/health           # Node -> Java link works
powershell -ExecutionPolicy Bypass -File .\scripts\test-booking-api.ps1 -BaseUrl https://<your-node-service>.onrender.com
```
**Final checklist for the live booking flow**
- [ ] `/api/java/health` returns `UP` on the Java service
- [ ] `/api/java/health/db` returns `"database":"UP"`
- [ ] The Node service's `/api/java/health` also returns `UP` (proves `JAVA_BOOKING_SERVICE_URL` is right)
- [ ] A booking made on the website shows a booking ID like `TRV-2026-12345`
- [ ] The same booking exists in Atlas → `travelora.bookings`
- [ ] `GET /api/java/bookings/<bookingId>` returns it
- [ ] Turning the Java service off makes the website show a red "Booking failed" message (no success screen)
- [ ] No password/URI appears in Render logs or responses

---

# ☕ Java Mini-Project Demonstration

## 1. Why Java and Spring Boot?
Booking is the part of Travelora where correctness matters most: input must be validated, IDs must be unique, and data must be stored reliably. Java's strong typing, Spring Boot's layered architecture (Controller → Service → Repository), Bean Validation and Spring Data MongoDB make this workflow structured, testable and easy to explain. It also lets the project show Java/Spring Boot skills next to the existing React/Node.js stack, with a clear service boundary (REST over HTTP) between them.

## 2. Java classes and their responsibilities

| Class (package `com.travelora.booking...`) | Responsibility |
| :--- | :--- |
| `BookingServiceApplication` | Entry point; starts Spring Boot (`@SpringBootApplication`). |
| `controller.BookingController` | REST endpoints under `/api/java/bookings`; receives JSON, calls the service, returns HTTP responses. |
| `controller.HealthController` | `/api/java/health` (service up) and `/api/java/health/db` (MongoDB reachable). |
| `service.BookingService` | Business logic: date and price rules, default values, unique booking ID generation (`TRV-<year>-<5 digits>` with collision retry), status `CONFIRMED`, timestamp, saving and lookups. |
| `repository.BookingRepository` | Spring Data MongoDB interface: `findByBookingId`, `existsByBookingId`, `findByUserIdOrderByCreatedAtDesc` (queries are generated from the method names). |
| `model.Booking` | The MongoDB document (`bookings` collection). |
| `model.Contact`, `model.Pricing`, `model.Traveller` | Embedded parts of a booking (contact with validation, price breakdown, traveller list). |
| `dto.BookingRequest` | The JSON a client may send, with validation rules. Server-controlled fields (`id`, `bookingId`, `status`, `createdAt`) are excluded so clients cannot forge them. |
| `dto.ApiError` | Uniform JSON error body (no stack traces or secrets). |
| `exception.GlobalExceptionHandler` | Converts errors to HTTP codes: 400 validation, 404 not found, 503 database problem, 500 unexpected. |
| `exception.InvalidBookingException`, `BookingNotFoundException` | Business-rule errors. |
| `config.MongoUriGuard` | Stops startup with a clear message if `MONGODB_URI` contains placeholders like `<username>`. |
| `config.CorsConfig` | Configurable CORS for direct browser calls. |

## 3. Spring Boot architecture

```
HTTP request
   │
   ▼
Controller  (BookingController)   – HTTP only: parse JSON, @Valid, status codes
   │
   ▼
Service     (BookingService)      – business rules, ID generation, defaults
   │
   ▼
Repository  (BookingRepository)   – Spring Data MongoDB, no SQL/boilerplate
   │
   ▼
Model       (Booking document)    ──▶ MongoDB collection "bookings"
```
`GlobalExceptionHandler` sits beside this chain and turns exceptions into JSON responses.

## 4. REST endpoints

| Method | Path | Success | Errors |
| :--- | :--- | :--- | :--- |
| POST | `/api/java/bookings` | `201` saved booking | `400` invalid data / malformed JSON, `503` database unavailable |
| GET | `/api/java/bookings/{bookingId}` | `200` booking | `404` unknown ID |
| GET | `/api/java/bookings/user/{userId}` | `200` list (newest first, `[]` if none) | — |
| GET | `/api/java/health` | `200` `{"status":"UP"}` | — |
| GET | `/api/java/health/db` | `200` `{"database":"UP"}` | `503` `{"database":"DOWN"}` |

The same paths are available through the Node server (`http://localhost:5000/api/java/...`).

**Sample request** – `POST /api/java/bookings` (required: `destination`, `travelDate` as YYYY-MM-DD and not in the past, `travellersCount` 1-50, `contact.name/email/phone`, `pricing.total` > 0; everything else is optional and gets a default)
```json
{
  "userId": "guest-user",
  "packageId": "goa-escape",
  "packageName": "Goa Escape",
  "destination": "Goa",
  "duration": "4 Days / 3 Nights",
  "travelDate": "2026-12-20",
  "travellersCount": 2,
  "travellersList": [ { "name": "Lokesh", "age": "18", "gender": "Male" } ],
  "roomTierName": "Standard Deluxe Room",
  "contact": { "name": "Lokesh", "email": "test@example.com", "phone": "9999999999", "specialRequests": "" },
  "pricing": { "basePrice": 14999, "travellerCount": 2, "baseSubtotal": 29998, "roomCost": 0, "insuranceCost": 0,
               "subtotal": 29998, "taxes": 0, "serviceFee": 0, "discount": 0, "total": 29998 },
  "paymentMethod": "upi"
}
```
**Illustrative response `201`** (shape produced by the code; the ID, `id` and `createdAt` differ on every call)
```json
{
  "id": "6720f1c2a1b2c3d4e5f60718",
  "bookingId": "TRV-2026-48213",
  "userId": "guest-user",
  "destination": "Goa",
  "travelDate": "2026-12-20",
  "travellersCount": 2,
  "status": "CONFIRMED",
  "createdAt": "2026-10-23T09:15:30.123Z",
  "contact": { "name": "Lokesh", "email": "test@example.com", "phone": "9999999999" },
  "pricing": { "total": 29998.0 }
}
```
**Illustrative validation error `400`**
```json
{
  "success": false, "status": 400, "error": "Validation failed",
  "message": "The booking request is invalid. Please correct the listed fields.",
  "details": [ "contact.email: contact email must be a valid email address", "destination: destination is required" ],
  "timestamp": "2026-10-23T09:16:02.511Z"
}
```
**`404`:** `{"success":false,"status":404,"error":"Not found","message":"Booking not found: TRV-2026-00000", ...}`

## 5. MongoDB integration
* Dependency: `spring-boot-starter-data-mongodb`. The connection comes from the `MONGODB_URI` environment variable (`spring.mongodb.uri` in `application.properties`); nothing secret is stored in the code.
* `Booking` is annotated `@Document(collection = "bookings")`, the **same collection** the Node.js `Booking` model uses, with the same field names, so both services read each other's bookings.
* `BookingRepository extends MongoRepository<Booking, String>` provides `save`, and the derived queries listed above.
* `/api/java/health/db` pings the database so you can prove the connection works.
* Database errors return HTTP 503 with a generic message; details stay in the server log and never contain the connection string.

## 6. How to demonstrate the Java module to an evaluator
1. **Show the code structure** in VS Code: `booking-service/src/main/java/com/travelora/booking/` (controller, service, repository, model, dto, exception, config). Explain the request flow (section 3).
2. **Build and test:** `cd booking-service` → `.\mvnw.cmd clean test` → show the green test summary, then `.\mvnw.cmd spring-boot:run`.
3. **Show it is alive:** open <http://localhost:8081/api/java/health> and `/api/java/health/db` in the browser.
4. **Create a booking via the API:** run `scripts\test-booking-api.ps1` and point at the PASS lines (201, 400 validation errors, 404 unknown ID).
5. **Show MongoDB:** open Atlas/Compass → `travelora.bookings` → the new document with the same `bookingId`.
6. **Show the full workflow in the UI:** run the React app, book a package, show the booking ID on the confirmation screen and the entry in **My Trips**; mention that this ID came from Java.
7. **Show failure handling:** stop the Java service and try to book: the page shows a red *Booking failed* message instead of a fake success.

## 7. Which parts are Java, React and Node.js

| Area | Java (Spring Boot) | Node.js / Express | React |
| :--- | :---: | :---: | :---: |
| Booking validation, ID generation, MongoDB save, retrieval by ID / user | ✅ | | |
| Forwarding booking calls to Java (`routes/javaBookings.js`) | | ✅ | |
| Authentication, destinations, packages, hotels, reviews, admin API | | ✅ | |
| Multi-step booking page, price breakdown, My Trips, wishlist, UI | | | ✅ |
| Serving the built website in production | | ✅ | |

---

## 👨‍💻 Author

### **Lokesh Patil**
*BE Information Technology | Full-Stack Developer*

🚀 **Travelora** is a full-stack Smart Travel Booking System developed by **Lokesh Patil** as a web development project.

**Tech Stack:**  
`React.js` • `Vite` • `Tailwind CSS` • `Node.js` • `Express.js` • `MongoDB` • `Mongoose` • `REST API`

🎓 **Department of Information Technology**  
**K. C. College of Engineering and Management Studies & Research**

> *Built with the goal of creating a modern, scalable and user-friendly travel booking experience.*
---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@travelora.com` | `admin123` |
| **Traveler** | `user@travelora.com` | `travelora123` |

*(Or enter any name/email during signup or checkout)*

---

## 👨‍🏫 Evaluation & Presentation Tips
- Show the **Homepage Hero Search tabs** and live search filters.
- Walk through the **7-Step Booking Flow** on any package (e.g. *Goa Escape* or *Kashmir Paradise*).
- Demonstrate the **Dynamic Price Breakdown** with Promo Code `TRAVEL500`.
- Show the **Print/Download Voucher** on confirmation.
- Open `/admin` to show **KPI Metrics**, **Monthly Trends Chart**, and **Package Management**.
