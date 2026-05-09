# Brio DBMS Project — Context & Progress

## Project Identity
- **Course:** CS1211 Database Management System
- **Institution:** RV University, Bengaluru (School of CSE), 2025–26
- **Team:** Michael Smith, Francis Reuben R, David Miller
- **Platform:** Brio — Project-Driven Programming Learning Platform

---

## Environment

| Tool | Version | Location |
|------|---------|----------|
| macOS | darwin (arm64) | — |
| MySQL Server | 9.6.0 (Homebrew) | brew services |
| MySQL Workbench | 8.0.47 CE | `/Applications/MySQLWorkbench.app` |
| Node.js | v24.14.1 | nvm |
| npm | 11.11.0 | nvm |
| Homebrew | 5.1.9 | `/opt/homebrew/bin/brew` |

**Connection:** `mysql -u root` (no password, localhost:3306)

---

## File Inventory

| File | Purpose | Lines |
|------|---------|-------|
| `01_DDL.sql` | CREATE DATABASE + 13 tables | 211 |
| `02_DML.sql` | INSERT seed data (all 13 tables) | 189 |
| `03_QUERIES.sql` | 15 SELECT queries (simple, JOIN, subquery) | 170 |
| `04_VIEWS_TRIGGERS_TRANSACTIONS.sql` | 3 views, 3 triggers, 3 transactions | 229 |
| `build_ppt.js` | Generate PPT using pptxgenjs | 316 |
| `build_report.js` | Generate DOCX report using docx | 365 |
| `index.html` | Landing page for Brio | 392 |
| `context.md` | This file | — |

---

## Schema Summary (13 Tables)

### Strong Entities (6)
| Table | PK | Notable Constraints |
|-------|-----|-------------------|
| `user` | user_id AUTO_INCREMENT | email UNIQUE, role ENUM, sub_tier ENUM |
| `course` | course_id AUTO_INCREMENT | title, tech_stack, difficulty ENUM |
| `lesson` | lesson_id AUTO_INCREMENT | UNIQUE(course_id, lesson_no), FK→course CASCADE |
| `team` | team_id AUTO_INCREMENT | team_name UNIQUE, max_members CHECK 2–4 |
| `blueprint` | blueprint_id AUTO_INCREMENT | difficulty_est ENUM |
| `project` | project_id AUTO_INCREMENT | blueprint_id UNIQUE (1:1), FK→user CASCADE, FK→team SET NULL |

### Weak Entities (2)
| Table | Composite PK | Owner |
|-------|-------------|-------|
| `kanban_task` | (project_id, task_name) | FK→project CASCADE; lesson_id FK→lesson SET NULL |
| `submission` | (user_id, sub_date) | FK→user CASCADE; lesson_id FK→lesson SET NULL |

### Junction Tables (2) — M:N
| Table | Composite PK | Descriptive Attrs |
|-------|-------------|-------------------|
| `enrollment` | (user_id, course_id) | grade DECIMAL(4,1), progress INT, enrolled_at |
| `team_member` | (user_id, team_id) | joined_at |

### Multivalued Attribute Tables (3)
| Table | PK | Source |
|-------|-----|--------|
| `lesson_tag` | (lesson_id, tag) | lesson.tags |
| `blueprint_tech` | (blueprint_id, tech) | blueprint.tech_recs |
| `team_role` | (team_id, user_id) | team roles (lead/backend/frontend/devops/qa) |

---

## Normalization
- **1NF:** All attributes atomic; multivalued attrs extracted; derived attrs omitted
- **2NF:** Composite PK tables have full functional dependency on both components
- **3NF/BCNF:** No transitive dependencies; all determinants are superkeys

---

## Seed Data Counts

| Entity | Count |
|--------|-------|
| users | 10 (9 learners + 1 mentor) |
| courses | 5 |
| lessons | 12 |
| teams | 3 |
| blueprints | 5 |
| projects | 5 |
| kanban_tasks | 13 |
| submissions | 8 |
| enrollments | 11 |
| team_members | 8 |
| team_roles | 5 |
| lesson_tags | 36 |
| blueprint_techs | 18 |

---

## 15 Queries

### Section A — Simple SELECTs
| # | Description | Key Features |
|---|-------------|-------------|
| Q1 | Pro/Team learners | WHERE IN, ORDER BY |
| Q2 | Lessons per course | LEFT JOIN, COUNT, GROUP BY |
| Q3 | Active projects + blueprints | INNER JOIN, WHERE |
| Q4 | Kanban task stats per project | LEFT JOIN, CASE SUM aggregation |
| Q5 | Avg AI score per user | AVG, ROUND, MAX, GROUP BY |

### Section B — JOIN Queries
| # | Description | Tables Joined |
|---|-------------|--------------|
| Q6 | Full enrollment report | enrollment → user → course |
| Q7 | Team details + members + roles | team → member → user → role → project |
| Q8 | Kanban tasks with skill-gating lesson | kanban_task → project → lesson → course |
| Q9 | Submissions with lesson + course | submission → user → lesson → course |
| Q10 | Users with no submissions | LEFT JOIN + IS NULL |
| Q11 | Tag cloud per lesson per course | GROUP_CONCAT |

### Section C — Nested/Subqueries
| # | Description | Technique |
|---|-------------|-----------|
| Q12 | Users in auth-tagged courses | Subquery IN with JOIN |
| Q13 | Projects recommending React | Subquery IN |
| Q14 | User with highest avg score | HAVING = MAX(subquery) |
| Q15 | Locked tasks with unmet prerequisites | Correlated NOT IN subquery |

---

## 3 Views

| View | Purpose | Key Output Columns |
|------|---------|-------------------|
| `learner_dashboard_view` | Per-learner aggregate stats | courses_enrolled, avg_progress, total_submissions, avg_ai_score, projects_owned |
| `project_kanban_view` | Per-project Kanban breakdown | total_tasks, done_count, in_progress, locked_count, completion_pct |
| `skill_gate_compliance_view` | Locked task gate evaluation | gate_status (Eligible/Score too low/Not submitted), lesson_score |

---

## 3 Triggers

| Trigger | Event | Logic |
|---------|-------|-------|
| `trg_unlock_task_after_submission` | AFTER INSERT on submission | If ai_score ≥ 70, promote locked tasks gated on that lesson → in_progress |
| `trg_enforce_team_size` | BEFORE INSERT on team_member | COUNT current members; SIGNAL 45000 if exceeds max_members |
| `trg_auto_ship_project` | AFTER UPDATE on kanban_task | If all tasks done, set project.status = 'shipped' |

---

## 3 Transactions

| # | Type | Description | Result |
|---|------|-------------|--------|
| 1 | COMMIT | Insert user + enroll in course atomically | Christopher Clark added + enrolled in Full-Stack |
| 2 | COMMIT | Create team + add members + assign to project | Team Apex created, linked to QuizBlitz |
| 3 | ROLLBACK | Attempt insert with ai_score = 110 | CHECK constraint violated — rejected |

---

## Bugs Found & Fixed

### Critical (Fixed)
| File | Line | Bug | Fix |
|------|------|-----|-----|
| `04_VIEWS_TRIGGERS_TRANSACTIONS.sql` | 52 | `JOIN user u ON p.user_id = p.user_id` (self-join, cartesian product) | `ON p.user_id = u.user_id` |
| `02_DML.sql` | 138 | `INSERT ... VALUES (10, 1, NULL, NULL)` — progress NOT NULL violated | Changed to `(10, 1, NULL, 0)` |

### Medium (TODO)
| File | Line | Issue | Recommendation |
|------|------|-------|---------------|
| `01_DDL.sql` | 20 | Table named `user` (SQL reserved keyword) | Rename to `users` or backtick-quote |
| `01_DDL.sql` | 129 | `submission` PK (user_id, sub_date) — collision risk on same-second inserts | Add synthetic `submission_id` PK |
| `build_ppt.js` | 314 | Hardcoded path `/home/claude/Brio_Project/...` — fails on macOS | Use `__dirname` + `path.join()` |
| `build_report.js` | 363 | Hardcoded path `/home/claude/Brio_Project/...` — fails on macOS | Use `__dirname` + `path.join()` |

### Low (Info)
| File | Issue |
|------|-------|
| `04_VIEWS_TRIGGERS_TRANSACTIONS.sql:92` | Multi-table UPDATE syntax (`UPDATE kt JOIN p`) is MySQL-specific, not portable |
| `04_VIEWS_TRIGGERS_TRANSACTIONS.sql:128` | Team size trigger has race condition under high concurrency (SELECT COUNT before INSERT) |
| `build_report.js` | Placeholder `Dr./Prof. [Name]` and `(USN)` need real values |
| `index.html` | Pricing buttons need `type="button"`; nav links need `aria-label` |
| Root | Missing `package.json`, `.gitignore`, `README.md` |

---

## Execution Log

```
2026-05-08
  [✓] MySQL 9.6.0 already installed (brew)
  [✓] MySQL Workbench 8.0.47 CE already installed
  [✓] MySQL service started (brew services)
  [✓] 01_DDL.sql executed — 13 tables created
  [✓] 02_DDL.sql executed — seed data inserted
  [✓] 03_QUERIES.sql executed — all 15 queries returned correct results
  [✓] 04_VIEWS_TRIGGERS_TRANSACTIONS.sql executed — 3 views, 3 triggers, 3 transactions verified
  [✓] Trigger 1 verified: JWT Auth task auto-unlocked (locked → in_progress)
  [✓] Trigger 3 verified: DevFolio marked shipped (all 4 tasks done)
  [✓] Transaction 1 verified: Christopher Clark committed + enrolled
  [✓] Transaction 2 verified: Team Apex + 2 members + QuizBlitz assignment
  [✓] Transaction 3 verified: Score 110 rejected by CHECK constraint
```

---

## Post-Transaction Final State

```
users         11     courses          5     lessons          12
projects       5     teams            4     kanban_tasks     13
submissions    9     enrollments      12    team_members     10
```

New since seed data: +1 user (Christopher Clark), +1 team (Team Apex), +1 submission (Trigger 1 test)

---

## Quick Start Commands

```bash
# Reset and run everything
mysql -u root -e "DROP DATABASE IF EXISTS devpath_db;"
mysql -u root < 01_DDL.sql
mysql -u root < 02_DML.sql
mysql -u root -t < 03_QUERIES.sql
mysql -u root -t < 04_VIEWS_TRIGGERS_TRANSACTIONS.sql

# Generate artifacts (after fixing paths in build scripts)
npm install pptxgenjs docx
node build_ppt.js
node build_report.js

# Open MySQL Workbench GUI
open /Applications/MySQLWorkbench.app
```

---

## Marking Rubric Reference

| Component | Marks | Status |
|-----------|-------|--------|
| Problem Relevance, Background & Context | 6 | Covered (Ch1-3 in report) |
| Database Design & Modeling | 8 | ER → 13 tables, BCNF |
| SQL Queries, Transactions & Execution | 8 | 15 queries, 3 triggers, 3 TXNs verified |
| Insight, Analysis & Originality | 4 | Skill-gate mechanism, derived attr design |
| Project Demonstration & Viva Voce | 3 | Ready for demo |
| Project Report | 1 | DOCX generation script ready |
| **Total** | **30** | — |
