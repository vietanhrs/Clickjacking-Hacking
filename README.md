# Clickjacking Demo

> **Educational Purpose Only** — This project is a proof-of-concept that demonstrates the Clickjacking attack technique for learning and security awareness. Do not use against real systems without explicit authorization.

---

## What is Clickjacking?

**Clickjacking** (also known as a "UI redress attack") is a malicious technique that tricks a user into clicking on something different from what they perceive. An attacker embeds a legitimate website in a transparent `<iframe>` and overlays invisible input fields on top of it. When the victim types their credentials into what looks like the real login form, those keystrokes are actually captured by the attacker's hidden inputs.

**Attack flow:**
```
User visits attacker page
        │
        ▼
Attacker page loads legitimate site in a transparent iframe
        │
        ▼
Invisible input fields are layered on top of the iframe
        │
        ▼
User types credentials into the "fake" inputs
        │
        ▼
Credentials are sent to attacker's server & stored
        │
        ▼
User is redirected to the real site (appears normal login)
```

**Defenses (what this demo lacks — intentionally):**
- `X-Frame-Options: DENY` or `SAMEORIGIN` HTTP header on the target site
- `Content-Security-Policy: frame-ancestors 'none'` header
- Frame-busting JavaScript on the target page

---

## Project Architecture

```
Clickjacking-Hacking/
├── client/                  # Angular 11 frontend (attacker's page)
│   └── src/app/
│       ├── law/             # Demo: VNU Law portal overlay
│       ├── office/          # Demo: Office document portal overlay
│       ├── net/             # Demo: Network services portal overlay
│       └── account.service.ts  # HTTP service to send captured credentials
│
└── server/                  # Node.js/Express backend (attacker's server)
    ├── server.js            # Express app entry point (port 8080)
    └── app/
        ├── config/db.config.js      # MySQL connection config
        ├── models/account.model.js  # Sequelize Account model
        ├── controllers/account.controller.js  # Credential storage logic
        └── routes/account.routes.js           # POST /api/account route
```

### Frontend (Angular 11)

Each component (`law`, `office`, `net`) follows the same attack pattern:
- Renders an `<iframe>` pointing to a real login portal
- Overlays invisible `<input>` fields on top using CSS (`opacity: 0`, absolute positioning)
- On form submit, sends `{ username, password }` to the backend and then redirects the user to the real portal

### Backend (Node.js + Express + Sequelize)

- **Port:** 8080
- **Database:** MySQL (`clickjacking` database)
- **Endpoint:** `POST /api/account` — saves username and password to the `Accounts` table
- **ORM:** Sequelize with auto-sync (`force: false`)

---

## Getting Started

### Prerequisites

- Node.js >= 14
- Angular CLI (`npm install -g @angular/cli`)
- MySQL server running locally

### 1. Database Setup

```sql
CREATE DATABASE clickjacking;
```

Update credentials in [server/app/config/db.config.js](server/app/config/db.config.js) if needed.

### 2. Start the Backend

```bash
cd server
npm install
node server.js
```

Server starts on `http://localhost:8080`.

### 3. Start the Frontend

```bash
cd client
npm install
ng serve
```

App serves on `http://localhost:4200`.

### 4. Switch Demo Scenario

In [client/src/app/app.component.html](client/src/app/app.component.html), uncomment the desired component:

```html
<!-- <app-law></app-law> -->
<app-office></app-office>
<!-- <app-net></app-net> -->
```

---

## Tech Debt & Known Issues

### Critical (Security — intentional for demo, must fix before any real deployment)

| # | Issue | Location |
|---|-------|----------|
| 1 | Passwords stored in plain text | [account.model.js](server/app/models/account.model.js) |
| 2 | No authentication on the `/api/account` endpoint | [account.routes.js](server/app/routes/account.routes.js) |
| 3 | CORS hardcoded to `localhost:4200` | [server.js](server/server.js) |
| 4 | Database password is empty | [db.config.js](server/app/config/db.config.js) |
| 5 | All communication over HTTP (no TLS) | server + client |

### Code Quality

| # | Issue | Location |
|---|-------|----------|
| 6 | API URL hardcoded to `http://localhost:8080` | [account.service.ts](client/src/app/account.service.ts) |
| 7 | Target iframe URLs hardcoded in templates | `law/office/net` component HTML files |
| 8 | No environment config (`environment.ts` unused for API URL) | [client/src/environments/](client/src/environments/) |
| 9 | No error handling on the HTTP POST (only `console.log`) | [account.service.ts](client/src/app/account.service.ts) |
| 10 | No backend input validation (username/password not sanitized) | [account.controller.js](server/app/controllers/account.controller.js) |
| 11 | No rate limiting on API | [server.js](server/server.js) |
| 12 | `username` is the primary key — duplicate submissions silently fail | [account.model.js](server/app/models/account.model.js) |
| 13 | `app.component.html` has a commented-out login form with no explanation | [app.component.html](client/src/app/app.component.html) |
| 14 | Three components share identical logic — no shared base/mixin | `law/`, `office/`, `net/` |
| 15 | No README or comments explaining the CSS overlay trick | component CSS files |

### Infrastructure

| # | Issue | Location |
|---|-------|----------|
| 16 | No `docker-compose.yml` — manual DB setup required | root |
| 17 | Angular version pinned to 11 (EOL) | [client/package.json](client/package.json) |
| 18 | No `.env` file support — config lives in source code | [db.config.js](server/app/config/db.config.js) |
| 19 | No logging library (only `console.log`) | server |
| 20 | No health check endpoint | [server.js](server/server.js) |

---

## Suggested Improvements

1. **Refactor components** — Extract shared clickjacking logic (overlay + submit + redirect) into a single `ClickjackOverlayComponent` that accepts a `targetUrl` input.
2. **Environment config** — Move the API URL and target URLs into `environment.ts` (dev) and `environment.prod.ts` (prod).
3. **`.env` for server** — Use `dotenv` for database credentials instead of committing them.
4. **Docker Compose** — Add a `docker-compose.yml` to spin up the MySQL instance automatically, removing the manual setup step.
5. **Visualize captured data** — Add an admin dashboard page to view captured credentials (for demo completeness without needing a DB client).
6. **Add defense demo** — Include a toggle that switches the iframe target between a vulnerable site and a protected one (with `X-Frame-Options` set), so users can observe the defense in action.

---

## References

- [OWASP Clickjacking Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html)
- [MDN: X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
- [MDN: CSP frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)
