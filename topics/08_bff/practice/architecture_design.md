# BFF Architecture Design Exercise

## Scenario (NAB-style)

NAB's mobile app and web app both need to display a **"My Finances" dashboard** showing:
1. Account balances (from AccountService)
2. Last 5 transactions (from TransactionService)
3. Upcoming scheduled payments (from PaymentService)
4. Unread notification count (from NotificationService)

Currently, the React web app makes 4 separate API calls on every page load, resulting in a slow, janky dashboard.

---

## Exercise 1: Design the BFF

**Q1: Draw the architecture** (text diagram) — where does the BFF sit?

```
Web App (React)      Mobile App
     │                   │
     ?                   ?
     │                   │
     ▼                   ▼
   [fill in]           [fill in]
     │                   │
     └────────┬──────────┘
              │
              ▼
  [fill in downstream services]
```

Your diagram:

---

**Q2: Should web and mobile share one BFF or have separate BFFs?**

Arguments for one shared BFF:
-
-

Arguments for separate BFFs:
-
-

Your recommendation:

---

**Q3: Design the BFF endpoint for the dashboard**

What should the endpoint look like?

```
Method:
Path:
Auth: How does BFF verify the user?
Response shape:
```

Your answer:

---

**Q4: One of the downstream services (NotificationService) is slow or down. What does the BFF do?**

Your answer:

---

## Exercise 2: Implement the BFF Handler (Node.js / Express)

```js
// bff/src/routes/dashboard.js
const express = require('express');
const router = express.Router();

// Downstream service clients
const accountService = require('../services/accountService');
const transactionService = require('../services/transactionService');
const paymentService = require('../services/paymentService');
const notificationService = require('../services/notificationService');

// GET /api/dashboard
// Auth: Bearer token passed in Authorization header
router.get('/dashboard', async (req, res) => {
  // YOUR IMPLEMENTATION:
  // 1. Extract and validate auth token from req.headers.authorization
  // 2. Call all 4 services IN PARALLEL (use Promise.allSettled for resilience)
  // 3. If a non-critical service (notifications) fails, return partial data
  // 4. If a critical service (accounts) fails, return 503 with error
  // 5. Shape the response for the web client

  // YOUR CODE HERE
});

module.exports = router;
```

---

## Exercise 3: BFF vs API Gateway

**Q: You propose adding a BFF. Your team lead says "we already have an API Gateway — why do we need another service?"**

Write your 3-minute verbal response:

Your answer:

---

## Model Answers (read after attempting)

### Q1 Model Diagram
```
Web App (React)      Mobile App
     │                   │
     │                   │
     ▼                   ▼
 Web BFF            Mobile BFF
  :3001               :3002
     │                   │
     └────────┬──────────┘
              │
              ▼ (via API Gateway)
  ┌───────────┬────────────┬──────────────┐
  ▼           ▼            ▼              ▼
AccountSvc TxnSvc   PaymentSvc   NotificationSvc
```

### Q2 Model Answer
Separate BFFs. Web and mobile have different data needs — mobile may want a more compact response with fewer fields due to bandwidth. Mobile needs different auth flows (device tokens vs session cookies). Shared BFF becomes a bottleneck — changes for mobile might break web. The overhead of two BFFs is low and pays off in independence.

### Q3 Model Answer
```
GET /api/v1/dashboard
Authorization: Bearer <jwt_token>

Response 200:
{
  "accounts": [
    { "id": "acc_123", "name": "Everyday", "balance": 2450.00, "currency": "AUD" }
  ],
  "recentTransactions": [
    { "id": "tx_456", "description": "Woolworths", "amount": -45.20, "date": "2026-03-15" }
  ],
  "upcomingPayments": [
    { "id": "pay_789", "description": "Mortgage", "amount": 2100.00, "dueDate": "2026-03-20" }
  ],
  "unreadNotifications": 3
}
```

### Q4 Model Answer
Use Promise.allSettled — never let one service failure bring down the whole dashboard. Notifications are non-critical: if NotificationService is down, return `unreadNotifications: null` (or omit the field) and include a `_warnings` array so the client can show a graceful degradation message. If AccountService is down (critical), return HTTP 503 with a clear error — the dashboard is meaningless without account data.

### Exercise 2 Model Answer
```js
router.get('/dashboard', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const userId = verifyToken(token); // throws if invalid
  if (!userId) return res.status(401).json({ error: 'Invalid token' });

  const [accounts, transactions, payments, notifications] = await Promise.allSettled([
    accountService.getAccounts(userId),
    transactionService.getRecent(userId, 5),
    paymentService.getUpcoming(userId),
    notificationService.getUnreadCount(userId),
  ]);

  // Critical service check
  if (accounts.status === 'rejected') {
    return res.status(503).json({ error: 'Account service unavailable' });
  }

  return res.json({
    accounts: accounts.value,
    recentTransactions: transactions.status === 'fulfilled' ? transactions.value : [],
    upcomingPayments: payments.status === 'fulfilled' ? payments.value : [],
    unreadNotifications: notifications.status === 'fulfilled' ? notifications.value : null,
  });
});
```

### Q: BFF vs API Gateway verbal response
"Great question — they serve different purposes and both are needed. The API Gateway is infrastructure: it handles routing, rate limiting, auth token validation, and load balancing for ALL services. It's transparent — it doesn't know about the UI. The BFF is a presentation-layer service that WE own. It aggregates four separate service calls into one response shaped for our dashboard. It knows that the web app needs account + transactions + payments together in one call. If I put that aggregation logic into the API Gateway, I'm pushing UI concerns into infrastructure, which means the infra team needs to change the gateway config every time our dashboard UI changes. The BFF keeps UI logic in the frontend team's control."
