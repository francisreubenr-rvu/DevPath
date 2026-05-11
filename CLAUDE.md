# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
cd website && npm run dev    # nodemon hot-reload
cd website && npm start      # production

# Database setup — run in order against MySQL `brio_db`
mysql -u root brio_db < sql/01_DDL.sql
mysql -u root brio_db < sql/02_DML.sql
mysql -u root brio_db < sql/03_QUERIES.sql
mysql -u root brio_db < sql/04_VIEWS_TRIGGERS_TRANSACTIONS.sql

# Report/deck generation (from project root)
node build_report.js    # → Brio_DBMS_Report.docx
node build_ppt.js       # → Brio_Presentation.pptx
```

Frontend served statically by Express at `http://localhost:3000` (no separate dev server).

## Architecture

**Brio** is a full-stack learning platform that doubles as a DBMS showcase. The entire backend lives in a single `website/server.js` monolith — intentional for an educational context.

### Backend (`website/server.js`)

- Express 5 + MySQL 8 (`brio_db`), `mysql2/promise` with parameterized `?` placeholders throughout
- **Dual connection pools**: primary pool (10 connections, read-write) + read-only pool (5 connections) — the read-only pool is exclusively used by `/api/showcase/chaos-sandbox` to allow arbitrary user `SELECT` queries safely
- JWT auth (24 h expiry): `authenticate()` middleware extracts `Authorization: Bearer <token>` and attaches `req.user = { id, role }` to protected routes
- Zod validates inputs; global error handler normalizes all throws to `{ "error": "..." }` (500) or `{ "error": "Validation failed", "details": [...] }` (400)

**All 11 API endpoints:**

| Route | Auth | Purpose |
|---|---|---|
| `POST /api/auth/login` | — | bcrypt verify → JWT |
| `GET /api/profile/me` | JWT | Profile + `learner_dashboard_view` stats |
| `POST /api/profile/update` | JWT | Update bio |
| `GET /api/projects` | JWT | Projects via `project_kanban_view` |
| `GET /api/kanban/:projectId` | JWT | Tasks ordered by priority |
| `GET /api/lessons` | JWT | Enrolled lessons + submission scores |
| `POST /api/submit` | JWT | Insert submission → triggers skill-gate |
| `GET /api/showcase/stats` | — | Public counts (users/projects/submissions) |
| `GET /api/showcase/queries` | — | List of 15 curated query descriptors |
| `POST /api/showcase/query` | — | Execute a query by ID (Q1–Q15 + 3 views) |
| `POST /api/showcase/chaos-sandbox` | — | Arbitrary SELECT via read-only pool |
| `POST /api/showcase/trigger` | — | Demo trigger execution |

### Frontend (`website/public/`)

Vanilla JS SPA — no build step, no framework. Three tabs wired to the same `index.html`:

1. **Platform** — Learning dashboard: enrolled lessons, project kanban, progress stats (fetched from the JWT-protected API)
2. **Showcase** — Runs the 15 queries from `03_QUERIES.sql` live; includes view demos, chaos sandbox, trigger demo (all public, no login required)
3. **System Viz** — Static architecture diagrams (`img/`)

Client-side state: JWT token, learning progress, and theme preference all in `localStorage`. The subject catalog loads from `public/content/subjects.json` (static — no DB backing).

### Database Design (`sql/`)

13 tables in 3NF: strong entities → weak entities → junction tables → multivalued attribute tables. Composite PKs on weak/junction tables (no surrogate keys except `submission`).

**Skill-gate trigger chain** — the core automation path:

```
POST /api/submit
  → INSERT INTO submission (ai_score, lesson_id, user_id)
  → trg_unlock_task_after_submission fires (AFTER INSERT on submission)
      if ai_score >= 70: UPDATE kanban_task SET status='in_progress'
                         WHERE status='locked' AND lesson_id matches user's projects
  → trg_auto_ship_project fires (AFTER UPDATE on kanban_task)
      if ALL tasks in project are 'done': UPDATE project SET status='shipped'
```

**Three views used directly by API endpoints:**
- `learner_dashboard_view` — per-learner aggregate stats (courses, avg progress, submissions, avg score)
- `project_kanban_view` — per-project task breakdown + completion %
- `skill_gate_compliance_view` — locked tasks with gate status ("Eligible to unlock" / "Score too low" / "Lesson not submitted yet")

Transactions are demonstrated in `04_VIEWS_TRIGGERS_TRANSACTIONS.sql` (enrollment, team assignment, rollback demo) — not called from the API.

## Code Style

- SQL files: numbered prefix order matters — DDL before DML before queries before views/triggers
- Tables/columns: `snake_case`; JS variables/functions: `camelCase`; CSS: `kebab-case`
- JS file names: `snake_case` or `kebab-case`

## Environment

`website/.env` is dotenvx-encrypted. Minimum required for local dev:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=brio_db
JWT_SECRET=brio-super-secret-key-2026
```

`.env.keys` holds the dotenvx private key — do not commit it.
