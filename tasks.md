# Brio — Project Fine-Tune Task List

Generated: 2026-05-11 | Context: CS1211 DBMS Final Exam Project

---

## Core Exam Objective Reminder

> **Frontend → DB**: Add a user from the website → row appears in MySQL Workbench.
> **DB → Frontend**: Delete a user from MySQL Workbench → website shows an error.

---

## BUGS & FALLACIES

### B1 — Schema Explorer is completely broken [CRITICAL]
**File:** `website/server.js`, `website/public/index.html:1002,1017`
The frontend calls `GET /api/showcase/tables` and `GET /api/showcase/table/:name` to power the Database Schema Explorer. Neither endpoint exists in `server.js`. The table chip grid never populates — the feature is silently dead.
**Fix:** Implement both endpoints using `SHOW TABLES` and `DESCRIBE :table` + `SELECT * LIMIT 5`.

### B2 — JWT does NOT verify user still exists in DB [CRITICAL — EXAM FAILS]
**File:** `website/server.js:69-77`
`authenticate()` only calls `jwt.verify()`. If a user is deleted from MySQL Workbench, their token remains valid for 24 hours. The exam objective "delete user from DB → frontend error" is impossible to demonstrate.
**Fix:** After token decode, query `SELECT user_id FROM users WHERE user_id = ?`. If 0 rows, return 401.

### B3 — No user registration or admin CRUD exists [CRITICAL — EXAM FAILS]
**File:** `website/server.js` (missing), `website/public/index.html` (missing)
There is no `POST /api/auth/register` or any admin endpoint to add/delete users. The exam objective "add user from frontend → appears in DB" cannot be demonstrated.
**Fix:** Add a User Management admin panel in the Showcase tab with add/delete/list user API endpoints.

### B4 — 6 of 15 queries missing from showcase [HIGH]
**File:** `website/server.js:135-148`
Queries Q7, Q9, Q11, Q12, Q13, Q14 from `03_QUERIES.sql` are never registered in the `queries` object. 40% of the query showcase is invisible. Only q1-q6, q8, q10, q15, and 3 views are shown.
**Fix:** Add all 6 missing queries to the `queries` map.

### B5 — `/api/projects` uses fragile LIKE + CONCAT pattern [MEDIUM]
**File:** `website/server.js:98`
`WHERE owner LIKE (SELECT CONCAT(f_name, " ", l_name) FROM users WHERE user_id = ?)` — relies on matching the view's computed `owner` string. Any whitespace or name collision silently returns no rows.
**Fix:** Query by `user_id` directly from the project table.

### B6 — Submission upsert needed for demo re-runs [LOW]
**File:** `website/server.js:128`, `sql/01_DDL.sql:142`
`UNIQUE (user_id, sub_date)` uses NOW() with second precision. Two fast submissions in the same second throw a duplicate key error. Re-running the trigger demo will also fail if the same lesson is submitted again within a second.
**Fix:** Change INSERT to `INSERT ... ON DUPLICATE KEY UPDATE ai_score=VALUES(ai_score), feedback=VALUES(feedback)`.

---

## MISSING FEATURES vs. COMPETITORS

### Competitor Comparison Matrix

| Feature | Brio | Codecademy | freeCodeCamp | LeetCode | Khan Academy |
|---|:---:|:---:|:---:|:---:|:---:|
| User registration (signup) | ❌ | ✅ | ✅ | ✅ | ✅ |
| Admin: add/delete user via UI | ❌ | ✅ | ✅ | ✅ | ✅ |
| DB-backed progress (not localStorage) | ❌ | ✅ | ✅ | ✅ | ✅ |
| Enroll in course from UI | ❌ | ✅ | ✅ | ✅ | ✅ |
| Full query showcase (all 15) | ❌ 9/15 | N/A | N/A | N/A | N/A |
| Live schema explorer | ❌ broken | N/A | N/A | N/A | N/A |
| Delete user reflected in frontend error | ❌ | ✅ | ✅ | ✅ | ✅ |
| Leaderboard | ❌ | ✅ | ✅ | ✅ | ❌ |
| Profile: edit name/email/password | ❌ bio only | ✅ | ✅ | ✅ | ✅ |

---

## TASK LIST

### P0 — EXAM CRITICAL (Do These First)

- [x] **T1** — Fix Schema Explorer: add `GET /api/showcase/tables` and `GET /api/showcase/table/:name`
- [x] **T2** — Fix JWT auth: verify user still exists in DB on every authenticated request
- [x] **T3** — Add User Management panel: list/add/delete users from frontend → reflects in DB
- [x] **T4** — Add all 6 missing queries (Q7, Q9, Q11, Q12, Q13, Q14) to the showcase

### P1 — HIGH PRIORITY

- [x] **T5** — Fix `/api/projects`: query by `user_id` directly instead of LIKE on full name
- [x] **T6** — Handle re-submission gracefully (upsert, not hard error)

### P2 — NICE TO HAVE

- [ ] **T7** — Add `POST /api/auth/register` endpoint and a signup form
- [ ] **T8** — Add enrollment management: enroll/unenroll from courses via UI
- [ ] **T9** — Add course management admin CRUD (add/delete courses)
- [ ] **T10** — Sync lesson progress to DB (not just localStorage)

---

## COMPLETED TASKS LOG

| Task | What Changed | Files |
|---|---|---|
| T1 | Added `GET /api/showcase/tables` + `GET /api/showcase/table/:name`; wired `loadTableList()` into `loadApp()` | `server.js`, `index.html` |
| T2 | `authenticate()` is now async; queries `users` table by decoded id; returns 401 if user no longer exists | `server.js:69-80` |
| T3 | Added `GET/POST /api/admin/users` + `DELETE /api/admin/users/:id`; added Admin User Management card with add-form + live user list + delete buttons | `server.js`, `index.html` |
| T4 | Added Q7 (teams+roles), Q9 (submissions+details), Q11 (tag cloud), Q12 (auth-tagged enrollments), Q13 (React projects), Q14 (top scorer) | `server.js:140-153` |
| T5 | `/api/projects` now uses `WHERE project_id IN (SELECT project_id FROM project WHERE user_id = ?)` | `server.js:98` |
| T6 | `POST /api/submit` uses `INSERT ... ON DUPLICATE KEY UPDATE` | `server.js:125-132` |
