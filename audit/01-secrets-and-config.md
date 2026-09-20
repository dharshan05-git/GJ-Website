# PHASE 1 — Secrets, Configuration & Environment Integrity Audit

**Audit Target:** Gevariya Jewels E-Commerce Platform  
**Scope:** Git history credentials scan, environment configuration files, `process.env` & `import.meta.env` references, default fallbacks, startup validation, and client-bundle leakage analysis.  
**Auditor:** Pre-Production Security & SRE Audit  

---

## 1. Executive Summary & Vulnerability Matrix

| Severity | ID | Vulnerability / Finding | Location | Status |
| :--- | :--- | :--- | :--- | :--- |
| **CRITICAL** | `SEC-01` | Live MongoDB Atlas, Razorpay & Resend API Keys Committed to Git in `.env.example` | [`backend/.env.example:11-32`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/.env.example#L11-L32) | **CONFIRMED** |
| **HIGH** | `SEC-02` | Unignored Stash File `backend/.en` Containing Live MongoDB Atlas Cluster Credentials | [`backend/.en:13`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/.en#L13) | **CONFIRMED** |
| **HIGH** | `SEC-03` | Hardcoded Admin Password Fallback & Automatic Overwrite on `npm run seed` | [`backend/src/config/env.js:32`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/config/env.js#L32), [`backend/src/seed/seed.js:93-107`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/seed/seed.js#L93-L107) | **CONFIRMED** |
| **MEDIUM** | `SEC-04` | Incomplete Production Environment Validation & Silent Fallback to Localhost | [`backend/src/config/env.js:15-70`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/config/env.js#L15-L70) | **CONFIRMED** |
| **MEDIUM** | `SEC-05` | `RAZORPAY_WEBHOOK_SECRET` Bypasses Central Env Config & Silently Ignores Webhooks | [`backend/src/controllers/paymentController.js:121-122`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/paymentController.js#L121-L122) | **CONFIRMED** |
| **LOW** | `SEC-06` | Incomplete `.gitignore` Allowed Root `node_modules` to be Tracked in Git | [`.gitignore:1-14`](file:///c:/Users/User/Desktop/New%20folder%20(12)/.gitignore#L1-L14) | **CONFIRMED** |
| **INFO** | `SEC-07` | Client Bundle Secret Isolation Verified (Only `VITE_API_URL` Exposed) | [`src/services/api.js:16`](file:///c:/Users/User/Desktop/New%20folder%20(12)/src/services/api.js#L16) | **VERIFIED CLEAN** |

---

## 2. Detailed Findings

### SEC-01 [CRITICAL]: Live Production & Test Credentials Committed to Git in `backend/.env.example`

#### Citation
- File: [`backend/.env.example:11-32`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/.env.example#L11-L32)
- Commit: `3678e55` ("feat: initialize backend application with core models, controllers, routes, and middleware")

#### Evidence Code Snippet
```dotenv
11: MONGO_URI=mongodb+srv://dsqaureagency_db_user:InZwKk52Mm24otcw@cluster0.c6zppxi.mongodb.net/gevariya_jewels?retryWrites=true&w=majority
...
21: ADMIN_PASSWORD=admin@12345
...
25: RAZORPAY_KEY_ID=rzp_test_TcFGUBtYGa81ot
26: RAZORPAY_KEY_SECRET=WVqimypX1WphkB5bxX2HkcOg
..
```

#### Exploitability & Impact
1. **MongoDB Atlas URI**: Plaintext credentials (`dsqaureagency_db_user:InZwKk52Mm24otcw`) grant full read/write access to the remote database cluster `cluster0.c6zppxi.mongodb.net`. An attacker can dump customer PII, alter product pricing, grant themselves superadmin privileges, or wipe the database.
2. **Resend API Key**: The API key (`re_4XTDFWW4_...`) allows an attacker to send emails from any verified sender domains (`@gevariyajewels.in`, `@resend.dev`), run phishing campaigns, or exhaust account quotas.
3. **Razorpay Key & Secret**: `RAZORPAY_KEY_SECRET` (`WVqimypX1WphkB5bxX2HkcOg`) allows an attacker to forge payment verification HMAC signatures, bypass checkout, generate fake payment refunds, and drain merchant balance.

---

### SEC-02 [HIGH]: Unignored File `backend/.en` on Disk with Live Cluster Credentials

#### Citation
- File: [`backend/.en:13`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/.en#L13)
- Ignore File: [`.gitignore:1-4`](file:///c:/Users/User/Desktop/New%20folder%20(12)/.gitignore#L1-L4)

#### Evidence Code Snippet
From [`backend/.en:13-23`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/.en#L13-L23):
```dotenv
13: MONGO_URI=mongodb+srv://GJ:1aNU2pAfbfMAxCyw@cluster0.symxlbf.mongodb.net/gevariya_jewels?retryWrites=true&w=majority
...
23: ADMIN_PASSWORD=Admin@12345
```
From [`.gitignore:1-4`](file:///c:/Users/User/Desktop/New%20folder%20(12)/.gitignore#L1-L4):
```gitignore
1: # Local environment files (never commit real credentials)
2: .env
3: .env.local
4: .env.*.local
```

#### Exploitability & Impact
The file `backend/.en` exists on disk (likely created as a typo for `.env`). Because `.gitignore` only specifies `.env` and `.env.local`, git does NOT ignore `.en`. A generic `git add .` or `git add backend/` will stage this file and push live credentials (`GJ:1aNU2pAfbfMAxCyw` on `cluster0.symxlbf.mongodb.net`) to the remote git repository.

---

### SEC-03 [HIGH]: Hardcoded Admin Password Fallback & Automatic Overwrite on Re-Seed

#### Citation
- Configuration: [`backend/src/config/env.js:32`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/config/env.js#L32)
- Seed Script: [`backend/src/seed/seed.js:93-107`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/seed/seed.js#L93-L107)

#### Evidence Code Snippet
From [`backend/src/config/env.js:29-33`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/config/env.js#L29-L33):
```javascript
29:   admin: {
30:     name: process.env.ADMIN_NAME || 'Gevariya Admin',
31:     email: process.env.ADMIN_EMAIL || 'admin@gevariyajewels.com',
32:     password: process.env.ADMIN_PASSWORD || 'Admin@12345',
33:   },
```
From [`backend/src/seed/seed.js:93-107`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/seed/seed.js#L93-L107):
```javascript
93:   const existingAdmin = await User.findOne({ email: env.admin.email.toLowerCase() });
94:   if (existingAdmin) {
95:     existingAdmin.role = 'superadmin';
96:     existingAdmin.password = env.admin.password;
97:     await existingAdmin.save();
98:     console.log(`✅ Owner account updated & password synced: ${existingAdmin.email}`);
99:   } else {
100:     await User.create({
101:       name: env.admin.name,
102:       email: env.admin.email,
103:       password: env.admin.password,
104:       role: 'superadmin',
105:     });
106:     console.log(`✅ Owner account created: ${env.admin.email} (password from ADMIN_PASSWORD in .env)`);
107:   }
```

#### Exploitability & Impact
1. If `ADMIN_PASSWORD` is omitted from the deployment environment, the default superadmin account password is set to `'Admin@12345'`.
2. Whenever `npm run seed` is executed in production (e.g. to sync new products), line 96 forcibly overrides the existing administrator's password back to `env.admin.password`. If `ADMIN_PASSWORD` is not set or defaults to `'Admin@12345'`, any custom password set by the store owner will be silently overwritten by the seed script.

---

### SEC-04 [MEDIUM]: Incomplete Production Environment Validation

#### Citation
- File: [`backend/src/config/env.js:14-70`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/config/env.js#L14-L70)

#### Evidence Code Snippet
```javascript
19:   mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gevariya_jewels',
20: 
21:   jwtSecret: process.env.JWT_SECRET || 'gevariya_dev_secret_change_me',
...
68: if (env.isProd && env.jwtSecret === 'gevariya_dev_secret_change_me') {
69:   throw new Error('JWT_SECRET must be set to a strong value in production.');
70: }
```

#### Exploitability & Impact
While `env.js` validates `JWT_SECRET` when `NODE_ENV === 'production'`, it lacks validation for all other required production variables:
- **`MONGO_URI`**: If unset in production, backend attempts to connect to `mongodb://127.0.0.1:27017/gevariya_jewels`, causing connection timeouts and crashing upon incoming requests.
- **`CLIENT_URL`**: Defaults to `http://localhost:5173`. If omitted in production, legitimate web requests from the production domain will be blocked by CORS or malformed.
- **`ADMIN_PASSWORD`**: No check ensuring it is strong and not the default string.
- **`JWT_SECRET` in Non-Production**: If `NODE_ENV` is accidentally left as `development` on staging or production, any token can be forged using the hardcoded secret `'gevariya_dev_secret_change_me'`.

---

### SEC-05 [MEDIUM]: `RAZORPAY_WEBHOOK_SECRET` Bypasses Central Configuration & Fails Silently

#### Citation
- File: [`backend/src/controllers/paymentController.js:120-123`](file:///c:/Users/User/Desktop/New%20folder%20(12)/backend/src/controllers/paymentController.js#L120-L123)

#### Evidence Code Snippet
```javascript
120: export const razorpayWebhook = asyncHandler(async (req, res) => {
121:   const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
122:   if (!secret) return res.status(200).json({ received: true, ignored: true });
```

#### Exploitability & Impact
1. `RAZORPAY_WEBHOOK_SECRET` is read ad-hoc directly from `process.env` rather than going through `backend/src/config/env.js`.
2. When the merchant configures a webhook in the Razorpay dashboard but forgets to set `RAZORPAY_WEBHOOK_SECRET` in `.env`, incoming webhook notifications for captured payments (`payment.captured`) are silently dropped with HTTP 200 `{ received: true, ignored: true }`. The order status remains unconfirmed and no warning is logged.

---

### SEC-06 [LOW]: Root `.gitignore` Allows Tracking of `node_modules/`

#### Citation
- File: [`.gitignore:1-14`](file:///c:/Users/User/Desktop/New%20folder%20(12)/.gitignore#L1-L14)

#### Evidence Code Snippet
```gitignore
1: # Local environment files (never commit real credentials)
2: .env
3: .env.local
4: .env.*.local
5: 
6: # Backend
7: backend/node_modules/
8: backend/uploads/*
9: !backend/uploads/.gitkeep
```

#### Exploitability & Impact
The root `.gitignore` ignores `backend/node_modules/` but does not ignore `node_modules/` in the project root. As verified by `git ls-files`, 7,000+ files from root `node_modules/` are currently tracked in git. This bloats repository size, pollutes commit logs, and risks committing any local dependency patches or embedded credentials.

---

### SEC-07 [INFORMATIONAL / CLEAN]: Frontend Client-Bundle Environment Boundary Check

#### Citation
- File: [`src/services/api.js:16`](file:///c:/Users/User/Desktop/New%20folder%20(12)/src/services/api.js#L16)
- File: [`dist/`](file:///c:/Users/User/Desktop/New%20folder%20(12)/dist)

#### Verification Code Snippet
```javascript
16: const BASE_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
```

#### Analysis & Status
A comprehensive grep of `src/` and the built client files in `dist/` confirms that **NO backend secrets** (e.g. `JWT_SECRET`, `MONGO_URI`, `RESEND_API_KEY`, `RAZORPAY_KEY_SECRET`, `ADMIN_PASSWORD`) are prefixed with `VITE_` or leaked to the client bundle. Only `VITE_API_URL` is consumed.

---

## 3. Active Environment Variable Reference Table

| Variable | Target Layer | Default Value in Code | Required in Prod? | Security / Operational Risk |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | Backend | `5000` | Optional | Low |
| `NODE_ENV` | Backend | `'development'` | **YES** | If not `'production'`, JWT fallback `'gevariya_dev_secret_change_me'` is allowed |
| `MONGO_URI` | Backend | `'mongodb://127.0.0.1:27017/gevariya_jewels'` | **YES** | Silent fallback to localhost if missing |
| `JWT_SECRET` | Backend | `'gevariya_dev_secret_change_me'` | **YES** | Token forgery if left as default in non-prod |
| `JWT_EXPIRES_IN` | Backend | `'7d'` | Optional | 7 days token validity |
| `CLIENT_URL` | Backend | `'http://localhost:5173'` | **YES** | CORS origins configuration |
| `SITE_URL` | Backend | `'http://localhost:5173'` | **YES** | Email confirmation hyperlinks |
| `ADMIN_NAME` | Backend | `'Gevariya Admin'` | Optional | Admin account name |
| `ADMIN_EMAIL` | Backend | `'admin@gevariyajewels.com'` | **YES** | Superadmin account login |
| `ADMIN_PASSWORD` | Backend | `'Admin@12345'` | **YES (CRITICAL)** | Seed script will set/reset to default password if missing |
| `RAZORPAY_KEY_ID` | Backend | `''` | **YES** (for online payments) | Disables Razorpay gateway if blank (COD only) |
| `RAZORPAY_KEY_SECRET` | Backend | `''` | **YES** (for online payments) | Required for HMAC-SHA256 signature verification |
| `RAZORPAY_WEBHOOK_SECRET` | Backend | `undefined` | Optional | Missing from `env.js`; silently drops webhooks if omitted |
| `RESEND_API_KEY` | Backend | `''` | **YES** (for emails) | Disables transactional emails if blank |
| `MAIL_FROM` | Backend | `'GEVARIYA JEWELS <onboarding@resend.dev>'` | **YES** | Sandbox sender domain if default |
| `ADMIN_ALERT_EMAIL`| Backend | `'gevariyajewels@gmail.com'` | Optional | New order notification inbox |
| `SMTP_HOST` | Backend | `''` | Optional | Fallback SMTP transport |
| `SMTP_PORT` | Backend | `587` | Optional | Port |
| `SMTP_SECURE` | Backend | `false` | Optional | TLS toggle |
| `SMTP_USER` | Backend | `''` | Optional | SMTP username |
| `SMTP_PASS` | Backend | `''` | Optional | SMTP password |
| `FREE_SHIPPING_THRESHOLD`| Backend | `1500` | Optional | Cart calculation rule |
| `SHIPPING_FEE` | Backend | `0` | Optional | Cart calculation rule |
| `VITE_API_URL` | Frontend | `'http://localhost:5000/api'` | **YES** | Bundled into client SPA build |

---

## 4. Remediation & Key Revocation Checklist

### Immediate Remediation Steps (Prior to Production Deployment)

- [ ] **1. Revoke Compromised Credentials:**
  - **MongoDB Atlas:** Rotate password for user `dsqaureagency_db_user` and `GJ` immediately on MongoDB Cloud Console; delete unneeded database users; restrict Atlas IP Access List to the EC2 elastic IP (remove `0.0.0.0/0` if present).
  - **Resend:** Revoke API key `re_4XTDFWW4_6oZ9B6bUbxwTyxGcHrEsYtTv` in Resend Dashboard and issue a new restricted sending key.
  - **Razorpay:** Regenerate Razorpay Test/Live Key Secret from Razorpay Dashboard (`rzp_test_TcFGUBtYGa81ot` / `WVqimypX1WphkB5bxX2HkcOg`).

- [ ] **2. Sanitize Files and Update `.gitignore`:**
  - Scrub all real credentials from `backend/.env.example` and replace with placeholders (e.g., `mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname`).
  - Delete or rename `backend/.en` and ensure `.gitignore` contains:
    ```gitignore
    node_modules/
    .env
    .env.*
    .en
    *.log
    ```

- [ ] **3. Hardening `backend/src/config/env.js` Validation:**
  - Enforce mandatory validation at server boot for:
    - `JWT_SECRET` (min length >= 32 characters, non-default)
    - `MONGO_URI` (must be present and valid URI)
    - `CLIENT_URL` (must not default to localhost in production)
    - `ADMIN_PASSWORD` (must be explicitly set and not `'Admin@12345'`)
    - Export `razorpay.webhookSecret` from `env.js`.

- [ ] **4. Fix Seed Script Password Reset Behavior:**
  - Modify `backend/src/seed/seed.js:93-98` so that running `npm run seed` does NOT overwrite an existing superadmin's password if the user already exists in the database.
