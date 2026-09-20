# PHASE 2 — Authentication, Authorization & Access Control Audit

**Audit Target:** Gevariya Jewels E-Commerce Platform  
**Scope:** Authentication endpoints, JWT lifecycle, RBAC & permission hierarchies, route authorization middleware, IDOR vulnerabilities, horizontal/vertical privilege escalation, and credential management.  
**Auditor:** Pre-Production Security & SRE Audit  

---

## 1. Executive Summary & Vulnerability Matrix

| Severity | ID | Vulnerability / Finding | Location | Status |
| :--- | :--- | :--- | :--- | :--- |
| **CRITICAL** | `AUTH-01` | Broken RBAC Architecture: `adminOnly` Hardcodes `superadmin`, Disabling All Staff Roles & Route Hierarchy | [`backend/src/middleware/auth.js:47-51`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/middleware/auth.js#L47-L51), [`backend/src/routes/admin.routes.js:36`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/routes/admin.routes.js#L36), [`src/pages/admin/AdminApp.jsx:49-53`](file:///c:/Users/User/Desktop/New%20folder%20(12)/src/pages/admin/AdminApp.jsx#L49-L53) | **CONFIRMED** |
| **HIGH** | `AUTH-02` | Unauthenticated IDOR & Customer PII Disclosure on Custom Jewelry Requests | [`backend/src/routes/customRequest.routes.js:41`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/routes/customRequest.routes.js#L41), [`backend/src/controllers/customRequestController.js:54-59`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/customRequestController.js#L54-L59) | **CONFIRMED** |
| **HIGH** | `AUTH-03` | Unauthenticated Customer PII Leakage via Razorpay Order Creation Endpoint | [`backend/src/routes/payment.routes.js:15-21`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/routes/payment.routes.js#L15-L21), [`backend/src/controllers/paymentController.js:38-69`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/paymentController.js#L38-L69) | **CONFIRMED** |
| **HIGH** | `AUTH-04` | Flawed Role Checks in Order Inspection & Cancellation Lock Out `superadmin` | [`backend/src/controllers/orderController.js:171`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/orderController.js#L171), [`backend/src/controllers/orderController.js:189`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/orderController.js#L189) | **CONFIRMED** |
| **MEDIUM** | `AUTH-05` | Stateless JWT Tokens Not Invalidated on Password Change or Staff Role Modification | [`backend/src/controllers/authController.js:61-73`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/authController.js#L61-L73), [`backend/src/utils/token.js:4-7`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/utils/token.js#L4-L7) | **CONFIRMED** |
| **MEDIUM** | `AUTH-06` | Lack of Self-Service Password Reset & Account Recovery Mechanism | [`backend/src/routes/auth.routes.js:1-84`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/routes/auth.routes.js#L1-L84), [`backend/src/controllers/authController.js:1-97`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/authController.js#L1-L97) | **CONFIRMED** |
| **LOW** | `AUTH-07` | Orphaned Staff Administration UI Component in Frontend Navigation Tree | [`src/pages/admin/AdminApp.jsx:25-34`](file:///c:/Users/User/Desktop/New%20folder%20(12)/src/pages/admin/AdminApp.jsx#L25-L34), [`src/pages/admin/Staff.jsx:1-254`](file:///c:/Users/User/Desktop/New%20folder%20(12)/src/pages/admin/Staff.jsx#L1-L254) | **CONFIRMED** |

---

## 2. Detailed Findings

### AUTH-01 [CRITICAL]: Broken RBAC Architecture — `adminOnly` Middleware Hardcodes `superadmin`, Disabling All Staff Roles

#### Citation
- Middleware: [`backend/src/middleware/auth.js:47-51`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/middleware/auth.js#L47-L51)
- Admin Router: [`backend/src/routes/admin.routes.js:35-36`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/routes/admin.routes.js#L35-L36)
- Frontend Login: [`src/pages/admin/AdminApp.jsx:49-53`](file:///c:/Users/User/Desktop/New%20folder%20(12)/src/pages/admin/AdminApp.jsx#L49-L53)

#### Evidence Code Snippet
From [`backend/src/middleware/auth.js:46-52`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/middleware/auth.js#L46-L52):
```javascript
46: /** Only superadmin role can access admin endpoints. Must run after `protect`. */
47: export const adminOnly = (req, _res, next) => {
48:   if (req.user?.role !== 'superadmin') {
49:     return next(ApiError.forbidden('Superadmin access required'));
50:   }
51:   next();
52: };
```
From [`backend/src/routes/admin.routes.js:35-36`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/routes/admin.routes.js#L35-L36):
```javascript
35: // Every route below needs a signed-in staff account.
36: router.use(protect, adminOnly);
```
From [`src/pages/admin/AdminApp.jsx:48-53`](file:///c:/Users/User/Desktop/New%20folder%20(12)/src/pages/admin/AdminApp.jsx#L48-L53):
```javascript
48:       const user = await api.login({ email, password });
49:       if (user.role !== 'superadmin') {
50:         api.logout();
51:         setError('Only Superadmin accounts can access this panel.');
52:         return;
53:       }
```

#### Exploitability & Architecture Breakdown
1. The codebase is designed around a multi-tier role hierarchy in [`backend/src/config/roles.js`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/config/roles.js): `['user', 'staff', 'manager', 'admin', 'superadmin']` with granular permissions (`products:read`, `orders:write`, `emails:send`, etc.).
2. In `User.js:81-83`, the helper `user.isStaff()` correctly identifies any account with role in `['staff', 'manager', 'admin', 'superadmin']`.
3. However, `adminOnly` was implemented to reject any user whose role is NOT `'superadmin'`.
4. Because `admin.routes.js:36` prepends `router.use(protect, adminOnly)` to the entire admin routing tree, **every route** (including those annotated with `requirePermission(PERMISSIONS.ORDERS_READ)`) will block staff members, managers, and basic admins with HTTP 403.
5. In addition, `AdminApp.jsx:49` immediately logs out any staff user upon login. The entire RBAC and staff delegation system is completely non-functional.

---

### AUTH-02 [HIGH]: Unauthenticated IDOR & Customer PII Disclosure on Custom Requests

#### Citation
- Route: [`backend/src/routes/customRequest.routes.js:41`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/routes/customRequest.routes.js#L41)
- Controller: [`backend/src/controllers/customRequestController.js:53-59`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/customRequestController.js#L53-L59)
- Model: [`backend/src/models/CustomRequest.js:46-53`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/models/CustomRequest.js#L46-L53)

#### Evidence Code Snippet
From [`backend/src/routes/customRequest.routes.js:40-42`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/routes/customRequest.routes.js#L40-L42):
```javascript
40: router.get('/', protect, adminOnly, listCustomRequests);
41: router.get('/:reference', getCustomRequest);
42: router.put('/:id', protect, adminOnly, updateCustomRequest);
```
From [`backend/src/controllers/customRequestController.js:53-59`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/customRequestController.js#L53-L59):
```javascript
53: // GET /api/custom-requests/:reference
54: export const getCustomRequest = asyncHandler(async (req, res) => {
55:   const request = await CustomRequest.findOne({ reference: req.params.reference.toUpperCase() });
56:   if (!request) throw ApiError.notFound('Custom request not found');
57: 
58:   res.json({ success: true, data: { request } });
59: });
```
From [`backend/src/models/CustomRequest.js:46-52`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/models/CustomRequest.js#L46-L52):
```javascript
46: customRequestSchema.pre('validate', function assignReference(next) {
47:   if (!this.reference) {
48:     const stamp = Date.now().toString(36).toUpperCase();
49:     const random = Math.random().toString(36).slice(2, 5).toUpperCase();
50:     this.reference = `GJC-${stamp}-${random}`;
51:   }
52:   next();
53: });
```

#### Exploitability & Impact
1. `GET /api/custom-requests/:reference` has no `protect` middleware, no user ownership check, and no email verification requirement.
2. The reference format is `GJC-${Date.now().toString(36)}-${random(3)}`. The timestamp portion is easily estimated to within a narrow range, and the 3-character random suffix has only $36^3 = 46,656$ combinations.
3. Without authentication or rate limiting, an attacker can enumerate references and scrape sensitive customer PII:
   - `contactName` (Customer full name)
   - `contactEmail` (Email address)
   - `contactPhone` (Phone number)
   - `referenceImage` (Uploaded private jewelry designs / photos)
   - `notes` (Bespoke design specifications)
   - `adminNote` (Internal atelier notes and pricing margins)

---

### AUTH-03 [HIGH]: Unauthenticated Customer PII Leakage via Razorpay Order Creation Endpoint

#### Citation
- Route: [`backend/src/routes/payment.routes.js:15-21`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/routes/payment.routes.js#L15-L21)
- Controller: [`backend/src/controllers/paymentController.js:38-69`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/paymentController.js#L38-L69)

#### Evidence Code Snippet
From [`backend/src/controllers/paymentController.js:38-69`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/paymentController.js#L38-L69):
```javascript
38: export const createRazorpayOrder = asyncHandler(async (req, res) => {
39:   const order = await Order.findOne({ orderNumber: String(req.body.orderNumber).toUpperCase() });
40:   if (!order) throw ApiError.notFound('Order not found');
41:   if (order.paymentStatus === 'PAID') throw ApiError.badRequest('This order is already paid');
42:   if (order.total <= 0) throw ApiError.badRequest('This order has no payable amount yet');
...
55:   res.status(201).json({
56:     success: true,
57:     data: {
58:       keyId: env.razorpay.keyId,
59:       razorpayOrderId: rzpOrder.id,
60:       amount: rzpOrder.amount,
61:       currency: rzpOrder.currency,
62:       orderNumber: order.orderNumber,
63:       customer: {
64:         name: order.shippingAddress.fullName,
65:         email: order.shippingAddress.email,
66:         contact: order.shippingAddress.phone,
67:       },
68:     },
69:   });
```

#### Exploitability & Impact
1. `POST /api/payments/razorpay/order` uses `optionalAuth`, meaning anyone can submit an unauthenticated HTTP request containing `{ "orderNumber": "GJ-2026-XXXX" }`.
2. The endpoint checks neither caller session identity nor caller email.
3. If the order is unpaid (`paymentStatus !== 'PAID'`), the server responds with HTTP 201 containing the customer's full name, email, and phone number (`lines 63-67`).
4. An attacker knowing or guessing order numbers can query this endpoint to extract customer contact details.

---

### AUTH-04 [HIGH]: Flawed Role Checks in Order Inspection & Cancellation Lock Out `superadmin`

#### Citation
- File: [`backend/src/controllers/orderController.js:166-190`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/orderController.js#L166-L190)

#### Evidence Code Snippet
From [`backend/src/controllers/orderController.js:170-178`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/orderController.js#L170-L178):
```javascript
170:   const isOwner = req.user && order.user && order.user.equals(req.user._id);
171:   const isAdmin = req.user?.role === 'admin';
172:   const emailMatches =
173:     req.query.email &&
174:     order.shippingAddress.email === String(req.query.email).toLowerCase().trim();
175: 
176:   if (!isOwner && !isAdmin && !emailMatches) {
177:     throw ApiError.forbidden('Add the email used at checkout to view this order');
178:   }
```
From [`backend/src/controllers/orderController.js:188-190`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/orderController.js#L188-L190):
```javascript
188:   const isOwner = order.user && order.user.equals(req.user._id);
189:   if (!isOwner && req.user.role !== 'admin') throw ApiError.forbidden('Not your order');
```

#### Exploitability & Impact
1. Both `getOrder` (`line 171`) and `cancelOrder` (`line 189`) test `req.user?.role === 'admin'` specifically rather than checking if the user is staff or superadmin (`['admin', 'superadmin'].includes(req.user.role)` or `req.user.isStaff()`).
2. If the platform owner (`superadmin`) or a store manager (`manager`) attempts to inspect an order via `GET /api/orders/:orderNumber` without passing the customer's email in `?email=`, they are blocked with HTTP 403.
3. If a `superadmin` attempts to cancel an order via `PUT /api/orders/:orderNumber/cancel`, `req.user.role !== 'admin'` evaluates to `true` (since role is `'superadmin'`), blocking the owner with `ApiError.forbidden('Not your order')`.

---

### AUTH-05 [MEDIUM]: Stateless JWT Tokens Not Invalidated on Password Change or Staff Demotion

#### Citation
- Password Change: [`backend/src/controllers/authController.js:61-73`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/authController.js#L61-L73)
- Staff Access Update: [`backend/src/controllers/adminController.js:275-302`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/adminController.js#L275-L302)
- Token Generation: [`backend/src/utils/token.js:4-7`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/utils/token.js#L4-L7)
- Auth Middleware: [`backend/src/middleware/auth.js:12-17`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/middleware/auth.js#L12-L17)

#### Evidence Code Snippet
From [`backend/src/utils/token.js:4-7`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/utils/token.js#L4-L7):
```javascript
4: export const signToken = (user) =>
5:   jwt.sign({ id: user._id.toString(), role: user.role }, env.jwtSecret, {
6:     expiresIn: env.jwtExpiresIn,
7:   });
```
From [`backend/src/middleware/auth.js:12-17`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/middleware/auth.js#L12-L17):
```javascript
12: const loadUser = async (token) => {
13:   const decoded = verifyToken(token);
14:   const user = await User.findById(decoded.id);
15:   if (!user || !user.isActive) throw ApiError.unauthorized('Account no longer available');
16:   return user;
17: };
```

#### Exploitability & Impact
1. Tokens are signed for 7 days (`JWT_EXPIRES_IN=7d`).
2. There is no `tokenVersion` or `passwordChangedAt` timestamp stored on the `User` schema.
3. When a compromised account has its password changed via `PUT /api/auth/me/password`, existing tokens in the attacker's possession remain valid for up to 7 days.
4. When an administrator revokes permissions or demotes a rogue staff member via `PUT /api/admin/staff/:id`, the staff member's active session token retains its privileges until expiration.

---

### AUTH-06 [MEDIUM]: Missing Self-Service Password Reset & Account Recovery

#### Citation
- Routes: [`backend/src/routes/auth.routes.js:1-84`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/routes/auth.routes.js#L1-L84)
- Controller: [`backend/src/controllers/authController.js:1-97`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/authController.js#L1-L97)

#### Analysis & Impact
The authentication system supports only `register`, `login`, `getMe`, `updateMe`, `changePassword`, and address book endpoints. There is no password reset mechanism (e.g. `POST /api/auth/forgot-password` with email token dispatch, `POST /api/auth/reset-password`). A customer or staff member who forgets their password has no automated recovery mechanism and will be permanently locked out unless manually reset via database manipulation.

---

### AUTH-07 [LOW]: Orphaned Staff Administration UI Component

#### Citation
- Navigation: [`src/pages/admin/AdminApp.jsx:25-34`](file:///c:/Users/User/Desktop/New%20folder%20(12)/src/pages/admin/AdminApp.jsx#L25-L34)
- Staff Page: [`src/pages/admin/Staff.jsx:1-254`](file:///c:/Users/User/Desktop/New%20folder%20(12)/src/pages/admin/Staff.jsx#L1-L254)

#### Analysis & Impact
The `Staff.jsx` component exists in the frontend codebase and implements a full team management interface (listing staff, adding team members, assigning roles, and tuning permissions). However, `AdminApp.jsx` does not import `Staff`, does not include it in `NAV`, and does not define a `<Route path="staff" />`. As a result, the store owner cannot access the staff management interface from the web browser.

---

## 3. RBAC & Access Control Matrix (Actual vs. Intended)

| Endpoint | Method | Intended Access | Actual Implementation | Security Impact |
| :--- | :--- | :--- | :--- | :--- |
| `/api/admin/*` | ALL | Staff tiers (`staff`, `manager`, `admin`, `superadmin`) based on permissions | `protect` + `adminOnly` (`superadmin` only) | **Staff tiers completely blocked** |
| `/api/custom-requests/:reference` | GET | Customer owner or Staff | Public unauthenticated | **PII / Design Leakage** |
| `/api/payments/razorpay/order` | POST | Customer placing payment for their order | Public unauthenticated by `orderNumber` | **PII Leakage (Name, Email, Phone)** |
| `/api/orders/:orderNumber` | GET | Order owner, guest with matching email, Staff, Superadmin | Owner, guest with matching email, `role === 'admin'` only | **Superadmin blocked unless email given** |
| `/api/orders/:orderNumber/cancel` | PUT | Order owner, Admin, Superadmin | Order owner, `role === 'admin'` only | **Superadmin blocked from cancelling** |
| `/api/coupons` | POST/PUT/DEL | Manager, Admin, Superadmin (`COUPONS_WRITE`) | `protect` + `adminOnly` (`superadmin` only) | **Managers/Admins blocked from coupons** |
| `/api/products` | POST/PUT/DEL | Manager, Admin, Superadmin (`PRODUCTS_WRITE`) | `protect` + `adminOnly` (`superadmin` only) | **Managers blocked from updating catalog** |

---

## 4. Remediation Checklist for Access Control

- [ ] **1. Fix `adminOnly` / Staff Middleware Hierarchy:**
  - Update `adminOnly` in `backend/src/middleware/auth.js` to allow all staff roles:
    ```javascript
    export const staffOnly = (req, _res, next) => {
      if (!req.user?.isStaff()) return next(ApiError.forbidden('Staff access required'));
      next();
    };
    ```
  - In `backend/src/routes/admin.routes.js:36`, replace `router.use(protect, adminOnly)` with `router.use(protect, staffOnly)`.
  - In `src/pages/admin/AdminApp.jsx:49`, check `if (!user.isStaff)` instead of `if (user.role !== 'superadmin')`.

- [ ] **2. Secure Custom Request Reference Retrieval:**
  - Require authentication or matching `?email=` parameter before returning custom request details in `GET /api/custom-requests/:reference`.
  - Strip internal fields (`adminNote`) when returning details to non-staff users.

- [ ] **3. Authenticate & Authorize Razorpay Order Initiation:**
  - Verify caller identity in `createRazorpayOrder`: Ensure signed-in users can only initialize payments for their own orders, or require matching email for guest orders.
  - Do not return customer PII in the payment order response if the caller is unauthenticated.

- [ ] **4. Fix Role Checking in Order Controller:**
  - Replace `req.user?.role === 'admin'` with `['admin', 'superadmin'].includes(req.user?.role)` or `req.user?.isStaff()`.

- [ ] **5. Implement Token Revocation / Versioning:**
  - Add `tokenVersion: { type: Number, default: 0 }` to `User` schema.
  - Include `tokenVersion` in JWT payload; increment `tokenVersion` on password change and staff demotion.

- [ ] **6. Integrate Staff Management UI:**
  - Import `Staff` in `AdminApp.jsx`, add `{ path: 'staff', label: 'Team & Staff', icon: Users, permission: 'users:manage', element: <Staff /> }` to `NAV`.
