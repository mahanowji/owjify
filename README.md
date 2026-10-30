# OWJIFY (اوجیفای) — Bilingual Services & Skills Marketplace

**OWJIFY** is a responsive, bilingual (**Persian RTL / English LTR**) web platform built with **React + Vite + JavaScript (`.js`/`.jsx` only)** and **MUI Material (`@mui/material`)**, founded and administered by **Mahan Owji (`mahanowji1380@gmail.com`)** to connect people directly through skill, trust, and human collaboration.

---

## Quick Start

```bash
npm install
npm run dev
```

To connect the Operator & Auth services to a live REST / ASP.NET Core backend, set:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```
When `VITE_API_BASE_URL` is omitted, OWJIFY runs seamlessly in **API-Ready Simulation Mode** via `localStorage`.

---

## 4 Instant Role Accounts (`Owjify@2026`)

| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Platform Admin (Mahan Owji)** | `mahanowji1380@gmail.com` | `Owjify@2026` | Executive KPIs, 6-month growth charts, **Full Website CRM** (all users & specialists, Verified badge toggles, CRM lifecycle tags & notes), global ad moderation, and support oversight (`/admin`) |
| **Support Operator (API)** | `operator@owjify.com` | `Owjify@2026` | Dedicated API login (`POST /api/operator/auth/login`), report & ticket queue filtering, canned macros, and official answers (`POST /api/operator/tickets/:id/reply`) (`/operator`) |
| **Demo Specialist (Provider)** | `pro@owjify.com` | `Owjify@2026` | Publish/edit advertisements, receive customer inquiries, message peers, send/manage **Skill Requests** (`/dashboard`) |
| **Demo Client (Customer)** | `client@owjify.com` | `Owjify@2026` | Browse, save favorites, message providers, track sent inquiries, submit & track support reports (`/dashboard`, `/support`) |

---

## Key Modules & Routes

- **`/`** — Editorial Home Page (clean layout, zero decorative clutter)
- **`/explore`** — Responsive MUI Service & Specialist Explorer
- **`/support`** — Public & Member Support Center to report listings/issues and track operator answers via Tracking ID (`SUP-1041`)
- **`/operator`** — REST API-Structured Support Operator Console
- **`/admin`** — Executive Platform Statistics & Full Website CRM Dashboard (**Mahan Owji**)
- **`/about`** — OWJIFY Mission ("Connecting People"), Inspirational Manifesto, and Founder/Admin Contact (**Mahan Owji — `mahanowji1380@gmail.com`**)
