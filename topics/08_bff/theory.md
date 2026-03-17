# BFF (Backend for Frontend) — Theory & Interview Prep

## The Problem BFF Solves

In a microservices architecture, you might have:
- UserService
- AccountService
- TransactionService
- NotificationService

Without BFF, the frontend must:
1. Make 4 separate API calls to build one dashboard page
2. Aggregate the responses in the browser
3. Handle failure/retry for each call independently
4. Transform data formats from multiple services

**Result:** Chatty network, complex frontend logic, slow page load (waterfall requests).

---

## What is BFF?

**BFF = Backend for Frontend**
A dedicated backend service that acts as an aggregation and orchestration layer — owned and maintained by the frontend team.

```
Browser/Mobile App
       │
       │ ONE aggregated request
       ▼
   ┌────────┐
   │  BFF   │  ← owned by frontend team
   └────────┘
    │  │  │  │
    ▼  ▼  ▼  ▼
  User  Account  Transaction  Notification
  Svc    Svc       Svc          Svc
```

The BFF:
- Aggregates multiple microservice calls into ONE response
- Shapes the response for the specific UI client's needs
- Handles auth token exchange / session management
- Applies client-specific business logic (which fields to show, formatting)

---

## BFF vs API Gateway

| | BFF | API Gateway |
|-|-----|-------------|
| **Who owns it** | Frontend team | Platform/infra team |
| **Purpose** | UI-specific data aggregation | Infrastructure routing |
| **Contains** | Presentation-layer logic | Rate limiting, auth, routing, load balancing |
| **Clients** | One specific client (web, mobile) | All clients |
| **Business logic** | UI-specific, shallow | None — transparent proxy |
| **Example** | Web dashboard BFF aggregating account+transaction data | Kong, AWS API Gateway, Nginx |

**Key distinction:** API Gateway is infrastructure (it routes and guards); BFF is presentation logic (it shapes and aggregates). They often coexist — requests go through API Gateway first, then BFF.

---

## BFF vs GraphQL

Both solve the over-fetching / under-fetching problem. Different approaches:

| | BFF | GraphQL |
|-|-----|---------|
| **Query flexibility** | Fixed endpoints, response shape defined by BFF | Client specifies exact fields needed |
| **Ownership** | Frontend team owns BFF | Schema owned centrally |
| **Complexity** | Simpler — standard REST | Requires schema design, resolvers, N+1 problem management |
| **Caching** | Standard HTTP caching | Cache is harder (POST requests, per-field) |
| **Best for** | Well-defined views, stable data needs | Diverse clients with varying data needs |

**When to choose BFF:**
- You have a specific client with stable, well-understood data requirements
- Your team prefers RESTful patterns

**When to choose GraphQL:**
- Multiple clients (web, mobile, partner) with very different data needs
- Data requirements change frequently
- You want clients to drive what data they fetch

---

## What BFF Should and Should Not Do

### BFF SHOULD:
- Aggregate multiple microservice responses
- Shape response for the specific client (omit unnecessary fields, rename, transform)
- Handle presentation concerns (pagination cursor format, date formatting for display)
- Manage auth tokens (exchange OAuth tokens, refresh, attach headers)
- Cache responses appropriate for the client's TTL needs

### BFF SHOULD NOT:
- Contain domain business logic (that belongs in microservices)
- Become a general-purpose service used by multiple clients
- Direct-access databases (it calls microservices, not DBs)
- Become a monolith — keep it thin

---

## Confirmed NAB Question: "Why don't microservices share a single database?"

**The 5-reason answer:**

1. **Loose coupling / independent deployability**
   - If Service A and Service B share a table, any schema change in that table requires coordinating both teams
   - You can no longer deploy Service A independently — it's coupled to Service B's schema assumptions

2. **Data encapsulation / bounded context (DDD)**
   - Each service should own its data and expose it only via API
   - Another service accessing the DB directly bypasses all business rules and validation
   - If UserService enforces "email must be unique", TransactionService writing directly to user table bypasses that rule

3. **Technology freedom**
   - Service A might want a relational DB (Postgres) for ACID transactions
   - Service B might want a document store (MongoDB) for flexible schemas
   - A shared DB forces one technology choice on all services

4. **Independent scaling**
   - You can scale Service A's DB (read replicas, connection pooling) without affecting Service B
   - A shared DB becomes a single point of scaling constraint

5. **Fault isolation**
   - A slow query or connection exhaustion from Service A doesn't degrade Service B's DB performance
   - A DB migration in Service A can't accidentally corrupt Service B's data

**When data IS shared:** Use event-driven communication (Kafka, RabbitMQ) with eventual consistency. For distributed transactions: Saga pattern (choreography or orchestration).

---

## BFF at NAB — How to Frame It

NAB has a microservices-based architecture with separate services for accounts, transactions, notifications, etc. The web frontend (React app) likely uses a BFF to:
- Aggregate account + recent transaction data for the dashboard
- Handle token exchange for the web-specific auth flow
- Format currency/date for Australian locale

**Senior answer framework when asked about architecture:**
> "In the current NAB architecture, I'd expect each product team to own a BFF that aggregates their microservices' data for the React frontend. The BFF handles the impedance mismatch between the granular microservice API surface and the coarser UI data needs — one page load results in one BFF call instead of four service calls. It also keeps the frontend code simple: the React app just calls `/api/dashboard` and gets back everything it needs."

---

## Interview Model Answers

### "What is a BFF and how is it different from an API Gateway?"
> "BFF is a dedicated backend owned by the frontend team. Its job is to aggregate multiple microservice calls and shape the response for a specific client — the web app, the mobile app, etc. It's owned by the frontend team because it contains presentation-layer logic: which fields to include, how to combine data, client-specific formatting.
>
> An API Gateway is infrastructure — it handles routing, rate limiting, auth validation, and load balancing for all services. It's a transparent proxy; it doesn't know or care about the UI. Both often coexist: requests go through the API Gateway first for security/routing, then to the BFF for aggregation, then to downstream microservices."

### "What are the risks of the BFF pattern?"
> "The main risk is that BFF becomes a monolith — teams start adding domain logic that belongs in microservices, and it bloats into another complicated backend. The discipline is: BFF only contains presentation logic, never domain logic. A second risk is it becomes a single point of failure for the frontend, so you need circuit breakers and fallbacks. Third: if you create one BFF for both web and mobile, you lose the client-specific optimization benefit — you should have separate BFFs per client type."
