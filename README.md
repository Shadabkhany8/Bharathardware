# Bharat Sponge — B2B Wholesale Hardware Ordering System

[![Expo](https://img.shields.io/badge/Expo-SDK%2052%2F57-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB?style=flat&logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17%20%7C%2021-ED8B00?style=flat&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Flyway](https://img.shields.io/badge/Flyway-10.10-CC0200?style=flat&logo=flyway&logoColor=white)](https://flywaydb.org)

**Bharat Sponge** is a production-ready, full-stack B2B wholesale ordering application engineered specifically for the wholesale hardware & abrasive tools industry. Wholesale retailers, dealers, and contractors can authenticate, explore categorized hardware catalogs, satisfy Minimum Order Quantities (MOQ), assemble wholesale purchases, select offline payment settlement methods, track sequential order lifecycles, and reorder past shipments seamlessly.

---

## 🏗️ Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────┐
│           React Native + Expo (Mobile Client)          │
│   • Expo Router (src/app/)                             │
│   • TypeScript & Context API (AuthContext, CartContext)│
│   • Offline-first Storage (AsyncStorage)               │
│   • Bharat Sponge Design System (Theme, Colors, Haptics│
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON (JWT Bearer)
┌───────────────────────────▼────────────────────────────┐
│          Spring Boot 3.3.4 (REST API Backend)          │
│   • Java 17/21 Compatibility                           │
│   • Stateless Spring Security & JJWT 0.12.6            │
│   • JPA / Hibernate Data Layer with Auditing           │
│   • Transactional Server-Authoritative Price & Stock   │
│   • Flyway Versioned Database Migrations (V1, V2)      │
└───────────────────────────┬────────────────────────────┘
                            │ JDBC
┌───────────────────────────▼────────────────────────────┐
│          PostgreSQL / H2 Relational Database           │
│   • Tables: customers, categories, products, orders,   │
│             order_items                                │
│   • Sequential Orders: BS-YYYY-XXXXXX                  │
│   • Immutable Historical Snapshots                     │
└────────────────────────────────────────────────────────┘
```

### 1. Frontend Mobile Application (`src/`)
- **Framework**: React Native with [Expo Router](https://docs.expo.dev/router/introduction/) (file-based navigation in `src/app/`).
- **Language**: TypeScript with strict mode enabled.
- **State Management**:
  - `AuthContext`: Authentication session lifecycle, JWT storage, profile updates.
  - `CartContext`: Wholesale cart persisted in `AsyncStorage`, MOQ-validated additions, live order summary computations.
- **Brand System**: Premium hardware industrial aesthetic (Deep Amber `#EA580C`, Industrial Slate `#0F172A`, Silver steel accents).

### 2. Backend REST API (`backend/`)
- **Framework**: Spring Boot 3.3.4 (Spring Data JPA, Spring Security, Spring Validation).
- **Language**: Java 17 / Java 21.
- **Security**: Stateless JWT authentication (`Bearer <token>`), role-based access control (`ROLE_CUSTOMER`, `ROLE_ADMIN`), BCrypt password hashing.
- **Database**: PostgreSQL support with seamless H2 in-memory fallback for immediate zero-config testing.
- **Database Migrations**: Flyway migration scripts:
  - `V1__init_schema.sql`: Tables, foreign keys, indexes, and sequential order tracking.
  - `V2__seed_hardware_data.sql`: Wholesale hardware categories (Abrasive Sponges, Cutting Wheels, Polishing Discs, Diamond Tools, Hand Sanding) and 11 production-grade hardware products with MOQ thresholds.

---

## 💼 Core B2B Wholesale Rules & Implementation

### 1. Minimum Order Quantity (MOQ) Enforcement
- Wholesale products have distinct MOQs (e.g., 20 boxes, 50 packs).
- The mobile UI locks quantity steppers to the MOQ floor.
- Server-side `@Transactional` order submission strictly validates `quantity >= product.getMinimumOrderQuantity()`, rejecting undersized orders.

### 2. Strictly Offline Payment Settlement
- **No online payment gateway SDKs** (Razorpay, Stripe, PayPal, or UPI gateway checkouts are deliberately omitted).
- Wholesale clients choose an informational settlement method:
  - `CASH`: Cash on Delivery / Counter Collection.
  - `QR`: Dynamic UPI / Bharat QR code scanned at warehouse pickup or delivery.
  - `BARCODE`: Invoice barcode scanned at billing counters.
- Orders are created with `paymentStatus = PENDING` and settled out-of-band by logistics / warehouse accounts.

### 3. Server-Authoritative Order Calculations & Snapshots
- The client cart sends **only** `productId` and `quantity`.
- The server acquires the latest database unit price, validates in-stock status, deducts stock, and computes total amounts.
- Historical line items in `order_items` record immutable snapshots (`productNameSnapshot`, `skuSnapshot`, `unitPrice`, `subtotal`) so subsequent catalog edits or price updates never alter past invoices.
- Orders receive sequential human-readable numbers formatted as `BS-YYYY-XXXXXX` (e.g., `BS-2026-000001`).

### 4. Intelligent Reorder Workflow
- Wholesale buyers frequently repeat prior orders.
- Clicking **"Reorder"** triggers a server pre-flight verification (`/api/orders/reorder/{id}`):
  - Checks if past products are still active and in stock.
  - Detects price changes and alerts the customer.
  - Populates the active cart with valid items for client review before submission.

---

## 📂 Repository Structure

```
BharatSponge/
├── backend/                             # Java 17/21 + Spring Boot 3 Backend
│   ├── src/main/java/com/bharatsponge/
│   │   ├── config/                      # SecurityConfig, CorsConfig
│   │   ├── controller/                  # Auth, Customer, Product, Category, Order, Admin
│   │   ├── dto/                         # Request & Response DTOs
│   │   ├── entity/                      # JPA Entities (Customer, Product, Order, etc.)
│   │   ├── exception/                   # GlobalExceptionHandler & custom exceptions
│   │   ├── repository/                  # Spring Data JPA Repositories
│   │   ├── security/                    # JwtTokenProvider, JwtFilter, UserPrincipal
│   │   └── service/                     # OrderService, ProductService, AuthService, etc.
│   ├── src/main/resources/
│   │   ├── application.properties       # App configuration (H2 / PostgreSQL toggle)
│   │   └── db/migration/                # Flyway V1 schema & V2 seed migrations
│   ├── src/test/java/com/bharatsponge/  # 18 JUnit & SpringBootTest integration tests
│   ├── pom.xml                          # Maven build dependencies
│   └── mvnw.cmd                         # Apache Maven wrapper script
├── src/                                 # React Native Expo Mobile App
│   ├── app/                             # Expo Router file-based screens
│   │   ├── (auth)/                      # login.tsx, register.tsx
│   │   ├── (tabs)/                      # index.tsx (Dashboard), products.tsx, orders.tsx, profile.tsx
│   │   ├── product/[id].tsx             # Product detail with MOQ steppers & specs
│   │   ├── cart.tsx                     # Wholesale cart & MOQ validation
│   │   ├── checkout.tsx                 # Offline settlement & delivery details
│   │   ├── order/[id].tsx               # Order detail & tracking timeline
│   │   └── order-success.tsx            # Order confirmation screen
│   ├── components/                      # Reusable UI widgets (Header, ProductCard, etc.)
│   ├── constants/                       # Theme colors, spacing, API configuration
│   ├── context/                         # AuthContext & CartContext
│   ├── services/                        # Axios HTTP API services
│   ├── types/                           # TypeScript interfaces & DTO contracts
│   └── utils/                           # Formatters, storage, helpers
├── package.json                         # Node dependencies & Expo config
└── README.md                            # Comprehensive project guide
```

---

## 🔑 Pre-Configured Demo Credentials

The database is pre-seeded with ready-to-test wholesale accounts:

| Role | Email | Password | Notes |
|---|---|---|---|
| **Wholesale Customer** | `customer@bharatsponge.com` | `Password@123` | Pre-loaded business profile & delivery address |
| **Store Administrator** | `admin@bharatsponge.com` | `Admin@123` | Access to order management & status updates |

> 💡 **Mobile Quick Fill**: The mobile login screen includes one-tap quick fill buttons to instantly test either account without typing.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20+ (`node -v`)
- **Java Development Kit (JDK)**: JDK 17 or JDK 21 (`java -version`)
- **Expo Go App** (optional, on your iOS or Android phone) or Android Studio Emulator

---

### Step 1: Start the Spring Boot Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Run the application using the Maven wrapper:
   ```bash
   # On Windows:
   cmd /c mvnw.cmd spring-boot:run

   # On Linux/macOS:
   ./mvnw spring-boot:run
   ```
   *The backend will automatically start on `http://localhost:8080`, run Flyway migrations, and seed initial hardware categories and products.*

3. (Optional) Run the 18 automated backend test cases:
   ```bash
   cmd /c mvnw.cmd test
   ```

---

### Step 2: Configure & Start the Mobile App

1. In the root directory, ensure dependencies are installed:
   ```bash
   npm install
   ```

2. **Network Connection Configuration**:
   - **Web / iOS Simulator**: The app connects to `http://localhost:8080/api` automatically.
   - **Android Emulator**: The app connects to `http://10.0.2.2:8080/api` automatically.
   - **Physical Device via Expo Go**: Ensure your phone is on the same Wi-Fi network as your computer, and pass your machine's LAN IP via `.env`:
     ```env
     EXPO_PUBLIC_API_URL=http://192.168.1.XX:8080/api
     ```
     *(Alternatively, use the convenient "Change Server URL" prompt on the Mobile Login screen).*

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Press:
   - `w` to open in your web browser.
   - `a` to open in a connected Android device or emulator.
   - Scan the QR code using the **Expo Go** mobile app on Android or Camera app on iOS.

---

## 🗄️ Database Configuration (PostgreSQL vs H2)

By default, the backend runs with an embedded **H2 in-memory database** for instant, zero-setup evaluation.

To switch to **PostgreSQL**:
1. Open [`backend/src/main/resources/application.properties`](file:///c:/Users/abc/Desktop/BharatSponge/backend/src/main/resources/application.properties).
2. Uncomment the PostgreSQL properties and comment out the H2 properties:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/bharatsponge
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   spring.datasource.driver-class-name=org.postgresql.Driver
   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
   ```
3. Create the database in PostgreSQL:
   ```sql
   CREATE DATABASE bharatsponge;
   ```
4. Restart the backend — Flyway will apply migrations `V1` and `V2` automatically.

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new wholesale customer account.
- `POST /api/auth/login` — Authenticate and receive a JWT Bearer token.

### Products & Catalog (`/api/products`, `/api/categories`)
- `GET /api/categories` — Fetch all hardware categories.
- `GET /api/products` — Paginated catalog with search, category filtering, and sorting (`page`, `size`, `query`, `categoryId`, `sortBy`).
- `GET /api/products/{id}` — Get single product specifications, stock status, and MOQ.
- `GET /api/products/search?query=...` — Quick hardware product search.

### Orders (`/api/orders`)
- `POST /api/orders` — Place order (Server validates stock & MOQs, captures historical snapshots).
- `GET /api/orders` — Customer's paginated order history (Supports filtering by `status`).
- `GET /api/orders/{id}` — Order details, tracking status timeline, and itemized snapshot breakdown.
- `POST /api/orders/reorder/{id}` — Pre-flight check & active cart preparation for repeat orders.

### Admin Operations (`/api/admin`)
- `GET /api/admin/orders` — View all store orders across all wholesale customers.
- `PATCH /api/admin/orders/{id}/status` — Update order status (`PENDING` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `DISPATCHED` ➔ `DELIVERED` / `CANCELLED`).
- `PATCH /api/admin/orders/{id}/payment` — Mark offline payment as `PAID`.
- `POST /api/admin/products` — Create new hardware catalog items.

---

## 🧪 Quality Assurance & Verification

Both the frontend and backend have been rigorously tested and verified:

```bash
# 1. TypeScript Static Typecheck (0 errors)
npx tsc --noEmit

# 2. Expo Linting (0 errors, 0 warnings)
npx expo lint

# 3. Spring Boot Backend Test Suite (18 tests, 0 failures, 0 errors)
cmd /c mvnw.cmd test
```

---

## 📄 License
Bharat Sponge is licensed under the MIT License.
