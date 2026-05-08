-- ==============================================================
-- CS1211 DATABASE MANAGEMENT SYSTEM
-- DevPath — Project-Driven Programming Learning Platform
-- File: 04_VIEWS_TRIGGERS_TRANSACTIONS.sql
-- ==============================================================

USE devpath_db;

-- ============================================================
-- SECTION A: VIEWS
-- ============================================================

-- View 1: Learner Progress Dashboard
-- Combines enrollment, submission history, and project status per user
CREATE OR REPLACE VIEW learner_dashboard_view AS
SELECT
    u.user_id,
    CONCAT(u.f_name, ' ', u.l_name)  AS full_name,
    u.sub_tier,
    COUNT(DISTINCT e.course_id)       AS courses_enrolled,
    ROUND(AVG(e.progress), 1)         AS avg_course_progress,
    COUNT(DISTINCT s.sub_date)        AS total_submissions,
    ROUND(AVG(s.ai_score), 1)         AS avg_ai_score,
    COUNT(DISTINCT p.project_id)      AS projects_owned
FROM users u
LEFT JOIN enrollment e   ON u.user_id = e.user_id
LEFT JOIN submission s   ON u.user_id = s.user_id
LEFT JOIN project p      ON u.user_id = p.user_id
WHERE u.role = 'learner'
GROUP BY u.user_id, u.f_name, u.l_name, u.sub_tier;

-- Usage:
SELECT * FROM learner_dashboard_view ORDER BY avg_ai_score DESC;

-- View 2: Project Kanban Status View
-- Shows each project's task breakdown and % completion
CREATE OR REPLACE VIEW project_kanban_view AS
SELECT
    p.project_id,
    p.proj_name,
    p.status          AS project_status,
    CONCAT(u.f_name, ' ', u.l_name) AS owner,
    t.team_name,
    COUNT(kt.task_name)                                         AS total_tasks,
    SUM(CASE WHEN kt.status = 'done'        THEN 1 ELSE 0 END) AS done_count,
    SUM(CASE WHEN kt.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
    SUM(CASE WHEN kt.status = 'locked'      THEN 1 ELSE 0 END) AS locked_count,
    ROUND(
        SUM(CASE WHEN kt.status = 'done' THEN 1 ELSE 0 END) * 100.0 / COUNT(kt.task_name)
    , 2)                                                         AS completion_pct
FROM project p
JOIN users u            ON p.user_id = u.user_id
LEFT JOIN team t       ON p.team_id = t.team_id
LEFT JOIN kanban_task kt ON p.project_id = kt.project_id
GROUP BY p.project_id, p.proj_name, p.status, u.f_name, u.l_name, t.team_name;

-- Usage:
SELECT * FROM project_kanban_view ORDER BY completion_pct DESC;

-- View 3: Skill Gate Compliance View
-- Shows which locked tasks have their prerequisite lesson completed by the project owner
CREATE OR REPLACE VIEW skill_gate_compliance_view AS
SELECT
    p.proj_name,
    kt.task_name,
    kt.status,
    l.title                          AS gating_lesson,
    CONCAT(u.f_name, ' ', u.l_name)  AS owner,
    CASE
        WHEN s.ai_score IS NOT NULL AND s.ai_score >= 70 THEN 'Eligible to unlock'
        WHEN s.ai_score IS NOT NULL AND s.ai_score < 70  THEN 'Score too low (need >= 70)'
        ELSE 'Lesson not submitted yet'
    END                              AS gate_status,
    s.ai_score                       AS lesson_score
FROM kanban_task kt
JOIN project p ON kt.project_id = p.project_id
JOIN users u            ON p.user_id = u.user_id
LEFT JOIN lesson l ON kt.lesson_id = l.lesson_id
LEFT JOIN submission s ON (s.user_id = u.user_id AND s.lesson_id = kt.lesson_id)
WHERE kt.status = 'locked';

-- Usage:
SELECT * FROM skill_gate_compliance_view;


-- ============================================================
-- SECTION B: TRIGGERS
-- ============================================================

-- Trigger 1: Auto-unlock Kanban task when a qualifying submission exists
-- AFTER INSERT on submission — checks if the new score unlocks any locked tasks
DELIMITER $$

CREATE TRIGGER trg_unlock_task_after_submission
AFTER INSERT ON submission
FOR EACH ROW
BEGIN
    -- If the new submission scores >= 70, unlock any locked tasks gated on that lesson
    -- for any project owned by this user
    IF NEW.ai_score >= 70 AND NEW.lesson_id IS NOT NULL THEN
        UPDATE kanban_task kt
        JOIN project p ON kt.project_id = p.project_id
        SET kt.status = 'in_progress'
        WHERE kt.lesson_id = NEW.lesson_id
          AND kt.status    = 'locked'
          AND p.user_id    = NEW.user_id;
    END IF;
END$$

DELIMITER ;

-- Test Trigger 1 (Aarav submits lesson 4 — should unlock 'Add JWT authentication')
INSERT INTO submission (user_id, sub_date, lesson_id, ai_score, feedback)
VALUES (1, '2025-03-20 10:00:00', 4, 88, 'Solid JWT implementation. Token expiry handled correctly.');

-- Verify:
SELECT task_name, status FROM kanban_task
WHERE project_id = 1 AND lesson_id = 4;


-- Trigger 2: Enforce team size limit (max 4 members) on TEAM_MEMBER insert
DELIMITER $$

CREATE TRIGGER trg_enforce_team_size
BEFORE INSERT ON team_member
FOR EACH ROW
BEGIN
    DECLARE current_members INT;
    DECLARE team_limit      INT;

    SELECT COUNT(*) INTO current_members
    FROM team_member WHERE team_id = NEW.team_id;

    SELECT max_members INTO team_limit
    FROM team WHERE team_id = NEW.team_id;

    IF current_members >= team_limit THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Team has reached its maximum member capacity.';
    END IF;
END$$

DELIMITER ;

-- Test Trigger 2 (Team Voyager already has 3 members, max is 3 — should fail):
-- INSERT INTO team_member (user_id, team_id) VALUES (5, 3);
-- Expected: ERROR 1644 (45000): Team has reached its maximum member capacity.


-- Trigger 3: Auto-update project status to 'shipped' when all tasks are 'done'
DELIMITER $$

CREATE TRIGGER trg_auto_ship_project
AFTER UPDATE ON kanban_task
FOR EACH ROW
BEGIN
    DECLARE total_tasks     INT;
    DECLARE done_tasks      INT;

    SELECT COUNT(*), SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END)
    INTO total_tasks, done_tasks
    FROM kanban_task WHERE project_id = NEW.project_id;

    IF total_tasks > 0 AND total_tasks = done_tasks THEN
        UPDATE project SET status = 'shipped'
        WHERE project_id = NEW.project_id AND status != 'shipped';
    END IF;
END$$

DELIMITER ;

-- Test Trigger 3 (complete DevFolio — all 4 tasks already 'done'):
UPDATE kanban_task SET status = 'done'
WHERE project_id = 4 AND task_name = 'Deploy to GitHub Pages';
-- Verify:
SELECT project_id, proj_name, status FROM project WHERE project_id = 4;


-- ============================================================
-- SECTION C: TRANSACTIONS
-- ============================================================

-- Transaction 1: New User Enrollment with Submission Record
-- Enrolls a new user into a course and records their first submission atomically.
START TRANSACTION;

    -- Step 1: Insert new user
    INSERT INTO users (f_name, l_name, email, role, sub_tier)
    VALUES ('Arjun', 'Kapoor', 'arjun.kapoor@devpath.io', 'learner', 'pro');

    -- Step 2: Enroll the new user in Full-Stack Web Development (course_id=1)
    INSERT INTO enrollment (user_id, course_id, progress)
    VALUES (LAST_INSERT_ID(), 1, 0);

    -- Verify
    SELECT CONCAT(f_name, ' ', l_name) AS new_user, sub_tier FROM users WHERE email = 'arjun.kapoor@devpath.io';

COMMIT;

-- Transaction 2: Team Project Assignment
-- Creates a new team, assigns members, and links them to a project — atomically.
START TRANSACTION;

    -- Step 1: Create new team
    INSERT INTO team (team_name, max_members)
    VALUES ('Team Apex', 4);

    -- Step 2: Add two members to the team
    -- (Using existing users — Rohan Singh user_id=5, Kiran Reddy user_id=3)
    INSERT INTO team_member (user_id, team_id) VALUES (5, LAST_INSERT_ID());
    INSERT INTO team_member (user_id, team_id) VALUES (3, LAST_INSERT_ID());

    -- Step 3: Assign team to an existing project (QuizBlitz, project_id=5)
    UPDATE project SET team_id = (SELECT team_id FROM team WHERE team_name = 'Team Apex')
    WHERE project_id = 5;

COMMIT;

-- Transaction 3: Rollback Demo — Invalid AI Score
-- Attempts to insert a submission with an invalid ai_score (> 100), triggering ROLLBACK.
START TRANSACTION;

    -- This violates the CHECK constraint: ai_score BETWEEN 0 AND 100
    INSERT INTO submission (user_id, sub_date, lesson_id, ai_score, feedback)
    VALUES (3, '2025-03-25 12:00:00', 5, 110, 'Score exceeds maximum — invalid.');
    -- MySQL raises error, no row inserted

ROLLBACK;
-- After ROLLBACK: table state unchanged. Zero partial writes.

