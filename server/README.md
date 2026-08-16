# ApexNode Backend

The ApexNode backend is a microservice-oriented Node.js/Express system: a single **API Gateway** in front of four independent services (**User**, **Product**, **Order**, **Payment**) plus a dedicated **Worker** for asynchronous processing via BullMQ/Redis.

---

## 🚀 Quick Access

| | |
|---|---|
| 📘 **Project overview** | [../README.md](../README.md) |
| ⚙️ **Local dev** | See [Local Development](#️-local-development) below |
| ❤️ **Health checks** | Every service exposes `GET /health` |
| ⚠️ **Deployment note** | Free-tier hosting — see [Deployment](#-deployment) |

If you only care about the backend: each service under `server/services/*` and `server/apiGateway` is a standalone Express app with its own `package.json`, `.env`, and `npm run dev` script — there is no shared root config.

---

## 🏗️ Backend Architecture

```mermaid
flowchart TD
    Client["React Client"] --> Gateway["API Gateway<br/>(Express + express-session + Redis store)"]

    Gateway -->|"/api/v1/user"| UserSvc["User Service"]
    Gateway -->|"/api/v1/inventory"| ProductSvc["Product Service"]
    Gateway -->|"/api/v1/checkout"| OrderSvc["Order Service"]
    Gateway -->|"/api/v1/payment"| PaymentSvc["Payment Service"]

    UserSvc --> PG[(PostgreSQL)]
    OrderSvc --> PG
    OrderSvc --> RZP["Razorpay API"]

    ProductSvc --> Mongo[(MongoDB)]

    PaymentSvc --> Redis[(Redis)]
    Redis -->|BullMQ jobs| Worker["Worker Service"]
    Worker --> PG
    Worker --> Mongo
    Worker --> RZP
```

---

## 🌐 API Gateway

The gateway (`server/apiGateway`) is the client's only entry point. It:

- Establishes and validates the user's session using `express-session`, backed by a Redis-backed store (`connect-redis`), and reads `req.session.userId`.
- Reverse-proxies matching routes to the correct downstream service using `http-proxy-middleware`, rewriting the path with `req.originalUrl`.
- Injects an `x-user-id` header on proxied requests when a session exists, so downstream services can identify the caller without re-verifying credentials.
- For the User Service specifically, intercepts the response body (`responseInterceptor`) to persist `userId` into the session on login/register, strip it back out of the response payload, and destroy the session on logout.
- Applies **CORS** restricted to `http://localhost:5173` and `process.env.CLIENT_URL`, with `credentials: true`.
- Applies **per-route-group rate limiting** (see table below).
- Returns a `503` with a "waking up" message if a downstream service is unreachable, rather than a raw connection error.
- Exposes `GET /health` for uptime/cold-start checks.

### Route table

| Gateway Route | Target Service | Rate Limiter |
|---|---|---|
| `GET /api/v1/user/status` | User Service | `statusLimiter` (300 / 15 min) |
| `/api/v1/user/*` | User Service | `userLimiter` (200 / 15 min) |
| `/api/v1/inventory/*` | Product Service | `generalLimiter` (500 / 15 min) |
| `/api/v1/payment/*` | Payment Service | `paymentLimiter` (50 / 15 min) |
| `/api/v1/checkout/*` | Order Service | `orderLimiter` (200 / 15 min) |

---

## 🔐 Authentication

- Authentication is handled entirely by the **API Gateway + User Service** pair — individual services trust the gateway rather than verifying credentials themselves.
- The gateway maintains a server-side session (Redis-backed via `connect-redis`) identified by an `httpOnly`, `secure`, `sameSite: none` cookie named `session-id`.
- On successful login/register, the User Service's response includes `userId`; the gateway's response interceptor captures this and stores it as `req.session.userId`, then strips it from what's actually sent to the client.
- On every subsequent proxied request, the gateway attaches the session's `userId` as an `x-user-id` header — this is how User/Product/Order/Payment services identify the authenticated caller.
- Logout is detected via an `action: "LOGOUT"` field in the User Service response, which triggers the gateway to destroy the session and clear the cookie.

---

## 🧩 Microservices

### User Service
- **Responsibility:** registration, login, logout, session-status check, and user profile management.
- **Routes:** `POST /register`, `POST /login`, `POST /logout`, `GET /status`, `GET|PATCH|POST /profile` (all under `/api/v1/user`).
- **Data:** PostgreSQL via Sequelize — `User` and `Profile` models/tables.
- **Notes:** passwords are hashed with `bcrypt`; profile creation/lookup/update is keyed off the `x-user-id` header set by the gateway.

### Product Service
- **Responsibility:** product catalog CRUD and cart-product lookups.
- **Routes (under `/api/v1/inventory`):** `POST /product`, `GET|PATCH|DELETE /product/:id`, `GET /products`, `POST /products` (bulk create), `POST /products/cart` (fetch multiple products by ID for cart display).
- **Data:** MongoDB via Mongoose — a single `Product` model with fields such as title, price, stock, images, and availability status.

### Order Service
- **Responsibility:** shopping cart management and order creation (including initiating the Razorpay order).
- **Routes (under `/api/v1/checkout`):** `GET|POST|PATCH|DELETE /cart/:productId`, `GET|DELETE /cart`, `POST|GET /orders`.
- **Data:** PostgreSQL via Sequelize — `Cart`, `Order`, and `OrderItem` models. `Order` tracks `paymentStatus`, `orderStatus`, and `refundStatus` enums.
- **Business logic:** enforces a 10-item cart limit; on order creation, calculates the total, creates a Razorpay order, and persists the order + items in a single Sequelize transaction.
- **Dependency:** calls the Razorpay API directly to create orders.

### Payment Service
- **Responsibility:** verifying client-side payment confirmations, handling Razorpay webhooks, and enqueueing background jobs.
- **Routes (under `/api/v1/payment`):** `POST /verify`, `POST /razorpay-webhook`, plus an `/admin/*`-style set of routes for inspecting/retrying failed BullMQ jobs (`/failed`, `/retry-failed`, `/refund-failed`, `/refund/retry-failed`, `/reconcile/failed`, `/reconcile/retry-failed`, `/initiate-payment/failed`, `/initiate-payment/retry-failed`, `DELETE /queue-jobs/delete`).
- **Data:** no direct database access — this service's job is verification and delegation to the queue; job/order state is written by the Worker.
- **Dependency:** Redis (via `ioredis`) for BullMQ queue producers.

### Worker
- **Responsibility:** all asynchronous, post-payment processing — this is where order status, stock, and refunds actually get updated.
- **Not an HTTP API** for business logic — it only exposes `GET /health` (explicitly noted in code as a Render health check) and runs BullMQ `Worker` consumers in the background.
- **Data:** PostgreSQL (order/order-item updates via Sequelize), MongoDB (product stock updates, purchase-tracking via Mongoose).
- **Dependency:** Razorpay API (fetching payments, issuing refunds, reconciling order status).

---

## 🔄 Service Communication

- **Client ↔ Gateway ↔ Services:** synchronous HTTP/REST, proxied by the gateway.
- **Payment Service → Worker:** asynchronous, via BullMQ jobs on Redis — the Payment Service never calls the Worker (or vice versa) over HTTP.
- Downstream services do **not** call each other directly; each is only reachable through the gateway or, in the Worker's case, through job queues.

```mermaid
flowchart LR
    Gateway -->|HTTP proxy| UserSvc
    Gateway -->|HTTP proxy| ProductSvc
    Gateway -->|HTTP proxy| OrderSvc
    Gateway -->|HTTP proxy| PaymentSvc
    PaymentSvc -->|BullMQ job| Redis[(Redis)]
    Redis -->|consume| Worker
```

---

## 🗄️ Database

| Service | Technology | ORM/ODM | Key models |
|---|---|---|---|
| User Service | PostgreSQL | Sequelize | `User`, `Profile` |
| Order Service | PostgreSQL | Sequelize | `Cart`, `Order`, `OrderItem` |
| Worker | PostgreSQL + MongoDB | Sequelize + Mongoose | `Order`, `OrderItem` (Postgres); `Product`, `PurchasedProducts` (Mongo) |
| Product Service | MongoDB | Mongoose | `Product` |

`Order` and `OrderItem` are shared table definitions between the Order Service (which creates them) and the Worker (which updates payment/order/refund status on the same tables) — each service keeps its own copy of the Sequelize model/migrations rather than sharing a package.

---

## 🔴 Redis

Redis is used for two distinct purposes by two different clients:

- **API Gateway** — `redis` client + `connect-redis`, as the session store backing `express-session`.
- **Payment Service & Worker** — `ioredis` client, as the connection/backing store for **BullMQ** queues and workers.

---

## ⚙️ BullMQ / Workers

Four BullMQ queues, all backed by the same Redis instance, connect the Payment Service (producer) to the Worker (consumer):

| Queue | Produced by | Consumed by | Purpose |
|---|---|---|---|
| `paymentQueue` | Payment Service (`verify`, webhook) | Worker | Apply a captured/failed payment to an order; decrement stock |
| `reconcilePaymentQueue` | Payment Service (on signature mismatch) | Worker | Re-check the real payment status with Razorpay |
| `initiatePaymentQueue` | Worker (from reconciliation) | Worker | Re-drive `processOrderPayment` with the reconciled event |
| `refundQueue` | Worker (on insufficient stock) | Worker | Issue a Razorpay refund and update refund status |

All jobs use `attempts: 3` with exponential backoff (`5000ms` base delay) and a `jobId` to prevent duplicate processing.

```mermaid
flowchart LR
    Producer["Payment Service"] -->|add job| Queue["BullMQ Queue"]
    Queue --> Redis[(Redis)]
    Redis --> W["Worker (BullMQ Worker)"]
    W --> Processing["processOrderPayment /<br/>processOrderRefund /<br/>processReconcilePayment"]
```

- `processOrderPayment` — on `payment.captured`, decrements MongoDB product stock inside a Mongo transaction and marks the Postgres order `paid`/`processing`; if stock is unavailable it enqueues a refund instead. On `payment.failed`, marks the order `failed`/`cancelled`.
- `processOrderRefund` — fetches the Razorpay payment, issues a refund, and updates `refundStatus`/`paymentStatus`/`orderStatus` accordingly.
- `processReconcilePayment` — looks up the real payment status from Razorpay for an order and re-queues it on `initiatePaymentQueue`.

---

## 💳 Payment Processing

- **Order creation:** Order Service calls `razorpayInstance.orders.create` with the cart total (in paise) and persists the resulting `razorpay_order_id` alongside a `pending` order.
- **Verification:** Payment Service recomputes `HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id)` using `RAZORPAY_TEST_SECRET_KEY` and compares it to the client-supplied signature.
- **Webhook:** a separate route consumes the **raw** request body (required for signature verification) and validates it against `x-razorpay-signature` using `RAZORPAY_TEST_WEBHOOK_SECRET_KEY`, providing a server-to-server confirmation path independent of the client.
- **On success**, both paths enqueue the same `paymentQueue` job shape (`event`, `razorpay_order_id`, `razorpay_payment_id`, `orderId`), so downstream processing is identical regardless of which path triggered it.
- **On signature mismatch**, a `reconcilePaymentQueue` job is queued instead of trusting the client, and the request is rejected.
- **Refunds** are only ever initiated by the Worker (not the Payment Service) — automatically, when stock cannot be reserved for a captured payment.

---

## 🛡️ Error Handling

- Every service uses the same pattern: an `appError(message, status)` helper that throws an `Error` with an attached `status`, wrapped route handlers via `asyncHandler` (forwards rejections to `next`), and a final Express error-handling middleware that responds with `{ message }` and the attached status (defaulting to `500`).
- The **API Gateway's proxies** attach an `on: { error }` handler per service so that an unreachable downstream service returns a `503` with a "service is waking up" message instead of an unhandled connection error.
- Validation is done inline in controllers/services (required-field checks) rather than through a shared schema library, with a couple of dedicated validation helpers (`orderData.validations.js`, `verifyData.validations.js`) for the Order and Product services.

---

## 🚦 Rate Limiting

Rate limiting is applied only at the **API Gateway**, using `express-rate-limit` with a 15-minute window per limiter:

| Limiter | Limit | Applied to |
|---|---|---|
| `generalLimiter` | 500 | `/api/v1/inventory/*` |
| `statusLimiter` | 300 | `GET /api/v1/user/status` |
| `userLimiter` | 200 | `/api/v1/user/*` |
| `orderLimiter` | 200 | `/api/v1/checkout/*` |
| `paymentLimiter` | 50 | `/api/v1/payment/*` |

Individual microservices do not implement their own rate limiting — they rely on the gateway.

---

## ❤️ Health Checks

Every service (`apiGateway`, `userService`, `productService`, `orderService`, `paymentService`, `workers`) exposes `GET /health` returning `{ status: "ok" }`. The Worker's implementation is explicitly commented as a health check for **Render**, used to keep the process reachable for uptime/cold-start monitoring on free-tier hosting.

---

## 🔧 Environment Variables

| Service | Variables |
|---|---|
| API Gateway | `PORT`, `CLIENT_URL`, `SESSION_SECRET`, `REDIS_URL`, `USER_SERVICE`, `PRODUCT_SERVICE`, `ORDER_SERVICE`, `PAYMENT_SERVICE` |
| User Service | `PORT`, `DB_URL` |
| Product Service | `PORT`, `MONGO_URI` |
| Order Service | `PORT`, `DB_URL`, `RAZORPAY_TEST_KEY`, `RAZORPAY_TEST_SECRET_KEY` |
| Payment Service | `PORT`, `IOREDIS_HOST`, `RAZORPAY_TEST_SECRET_KEY`, `RAZORPAY_TEST_WEBHOOK_SECRET_KEY` |
| Worker | `PORT`, `DB_URL`, `MONGO_URI`, `IOREDIS_HOST`, `RAZORPAY_TEST_KEY`, `RAZORPAY_TEST_SECRET_KEY` |

Use placeholder values only (e.g. `DB_URL=postgres://user:password@host:5432/dbname`) — never commit real credentials. No `.env.example` files currently exist in the repository.

---

## ▶️ Local Development

Each service is standalone; run the ones you need in separate terminals.

**Terminal 1 — API Gateway**
```bash
cd server/apiGateway
npm install
npm run dev   # nodemon src/server.js — default port 5000
```

**Terminal 2 — User Service**
```bash
cd server/services/userService
npm install
npm run dev   # default port 5001
```

**Terminal 3 — Product Service**
```bash
cd server/services/productService
npm install
npm run dev   # default port 5002
```

**Terminal 4 — Order Service**
```bash
cd server/services/orderService
npm install
npm run dev   # default port 5003
```

**Terminal 5 — Payment Service**
```bash
cd server/services/paymentService
npm install
npm run dev   # default port 5004
```

**Terminal 6 — Worker**
```bash
cd server/services/workers
npm install
npm run dev   # nodemon src/app.js — health server default port 3000
```

You'll also need a running **PostgreSQL** instance, **MongoDB** instance, and **Redis** instance, and Sequelize migrations applied for the User, Order, and Worker services (`sequelize-cli` is included as a dev dependency in each).

---

## 🚀 Deployment

Backend services all expose `GET /health`, and the Worker's health endpoint is explicitly commented as being for **Render**. Combined with the client-side retry/"waking up" handling for `502`/`503`/`504` responses, this indicates the backend is deployed on free-tier, sleep-based hosting.

> ⚠️ Free-tier deployment notice: Backend services may sleep after periods of inactivity depending on the hosting provider. This can cause cold-start delays and occasional initial 502/503 responses while services wake up.

This is an infrastructure/hosting-tier limitation, not an application-code failure — the gateway and client both already handle it gracefully (503 fallback messages, automatic retry with backoff).

---

## ⚠️ Known Limitations

- **Cold starts** on free-tier hosting, as above.
- **No automated tests** — `jest` is a listed dev dependency in several services, but no test suites are present.
- **Admin/monitoring routes in the Payment Service** (`/admin/*` job-inspection endpoints) contain implementation bugs in the current code — e.g., a misspelled response helper (`repsonseUser`) and an undefined variable reference in `removeAllJobs` — and are not fully functional as written.
- **No shared package/monorepo tooling** — common utilities (e.g., `appError`, `asyncHandler`) are duplicated per service rather than shared from a common package.
- **No containerization or CI/CD pipeline** currently in the repository.

---

## 🔮 Future Backend Improvements

- Docker + docker-compose for consistent local orchestration of all services
- CI/CD pipeline for automated builds, migrations, and deploys
- Centralized logging and distributed tracing across services
- Monitoring/alerting for queue failures and service health
- Automated integration tests, particularly around the payment/refund/reconciliation flows
- Production-grade infrastructure without free-tier cold-start behavior
- Shared internal package for common utilities (error handling, response formatting) instead of per-service duplication