-- ==============================================================
-- CS1211 DATABASE MANAGEMENT SYSTEM
-- DevPath — Project-Driven Programming Learning Platform
-- File: 03_QUERIES.sql  |  SELECT Queries
-- ==============================================================

USE devpath_db;

-- ============================================================
-- SECTION A: SIMPLE SELECT QUERIES
-- ============================================================

-- Q1: List all learners on Pro or Team subscription tiers
SELECT user_id, CONCAT(f_name, ' ', l_name) AS full_name, email, sub_tier
FROM users
WHERE sub_tier IN ('pro', 'team') AND role = 'learner'
ORDER BY sub_tier, f_name;

-- Q2: Count of lessons per course
SELECT c.title AS course_title, c.difficulty,
       COUNT(l.lesson_id) AS lesson_count
FROM course c
LEFT JOIN lesson l ON c.course_id = l.course_id
GROUP BY c.course_id, c.title, c.difficulty
ORDER BY lesson_count DESC;

-- Q3: All projects currently in 'active' status with their blueprints
SELECT p.project_id, p.proj_name, p.status,
       b.description AS blueprint_description, b.difficulty_est
FROM project p
JOIN blueprint b ON p.blueprint_id = b.blueprint_id
WHERE p.status = 'active'
ORDER BY p.project_id;

-- Q4: Kanban task completion stats per project
SELECT p.proj_name,
       COUNT(*) AS total_tasks,
       SUM(CASE WHEN kt.status = 'done'        THEN 1 ELSE 0 END) AS done_count,
       SUM(CASE WHEN kt.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_count,
       SUM(CASE WHEN kt.status = 'locked'      THEN 1 ELSE 0 END) AS locked_count
FROM project p
LEFT JOIN kanban_task kt ON p.project_id = kt.project_id
GROUP BY p.project_id, p.proj_name
ORDER BY done_count DESC;

-- Q5: AI submission scores — average per user
SELECT CONCAT(u.f_name, ' ', u.l_name) AS full_name,
       COUNT(s.user_id) AS total_submissions,
       ROUND(AVG(s.ai_score), 1) AS avg_ai_score,
       MAX(s.ai_score) AS best_score
FROM users u
JOIN submission s ON u.user_id = s.user_id
GROUP BY u.user_id, u.f_name, u.l_name
ORDER BY avg_ai_score DESC;

-- ============================================================
-- SECTION B: JOIN QUERIES
-- ============================================================

-- Q6: Full enrollment report — user, course, progress, grade (INNER JOIN)
SELECT CONCAT(u.f_name, ' ', u.l_name) AS student_name,
       u.sub_tier, c.title AS course, c.difficulty,
       e.progress, e.grade, e.enrolled_at
FROM enrollment e
JOIN users u   ON e.user_id = u.user_id
JOIN course c ON e.course_id = c.course_id
ORDER BY e.progress DESC, student_name;

-- Q7: Team details with all members and roles (3-table JOIN)
SELECT t.team_name,
       CONCAT(u.f_name, ' ', u.l_name) AS member_name,
       tr.role AS team_role,
       p.proj_name AS working_on
FROM team t
JOIN team_member tm ON t.team_id = tm.team_id
JOIN users u         ON tm.user_id = u.user_id
LEFT JOIN team_role tr ON (t.team_id = tr.team_id AND u.user_id = tr.user_id)
LEFT JOIN project p    ON (p.team_id = t.team_id AND p.status = 'active')
ORDER BY t.team_name, tr.role;

-- Q8: Kanban tasks with their skill-gating lesson (INNER JOIN)
SELECT p.proj_name, kt.task_name, kt.status, kt.priority,
       l.title AS gating_lesson, l.lesson_no,
       c.title AS course_required
FROM kanban_task kt
JOIN project p ON kt.project_id = p.project_id
LEFT JOIN lesson l ON kt.lesson_id = l.lesson_id
LEFT JOIN course c ON l.course_id = c.course_id
ORDER BY p.proj_name, kt.priority DESC, kt.task_name;

-- Q9: Submissions with lesson and user details (LEFT JOIN)
SELECT CONCAT(u.f_name, ' ', u.l_name) AS submitter,
       l.title AS lesson_submitted,
       c.title AS course,
       s.ai_score, s.sub_date, s.feedback
FROM submission s
JOIN users u   ON s.user_id = u.user_id
LEFT JOIN lesson l ON s.lesson_id = l.lesson_id
LEFT JOIN course c ON l.course_id = c.course_id
ORDER BY s.sub_date DESC;

-- Q10: Users who have NOT submitted any code yet (LEFT JOIN + IS NULL)
SELECT CONCAT(u.f_name, ' ', u.l_name) AS full_name,
       u.email, u.role, u.sub_tier
FROM users u
LEFT JOIN submission s ON u.user_id = s.user_id
WHERE s.user_id IS NULL
ORDER BY u.f_name;

-- Q11: Tags associated with lessons per course (tag cloud report)
SELECT c.title AS course_title,
       l.title AS lesson_title,
       GROUP_CONCAT(lt.tag ORDER BY lt.tag SEPARATOR ', ') AS tags
FROM course c
JOIN lesson l    ON c.course_id = l.course_id
JOIN lesson_tag lt ON l.lesson_id = lt.lesson_id
GROUP BY c.course_id, c.title, l.lesson_id, l.title
ORDER BY c.title, l.lesson_no;

-- ============================================================
-- SECTION C: NESTED / SUBQUERIES
-- ============================================================

-- Q12: Users enrolled in courses that contain 'auth' tagged lessons
SELECT DISTINCT CONCAT(u.f_name, ' ', u.l_name) AS full_name, u.email
FROM users u
JOIN enrollment e ON u.user_id = e.user_id
WHERE e.course_id IN (
    SELECT DISTINCT l.course_id
    FROM lesson l
    JOIN lesson_tag lt ON l.lesson_id = lt.lesson_id
    WHERE lt.tag = 'auth'
);

-- Q13: Projects whose blueprints recommend React (subquery with IN)
SELECT p.proj_name, p.status,
       CONCAT(u.f_name, ' ', u.l_name) AS owner
FROM project p
JOIN users u ON p.user_id = u.user_id
WHERE p.blueprint_id IN (
    SELECT blueprint_id FROM blueprint_tech WHERE tech = 'React'
)
ORDER BY p.status;

-- Q14: User with the highest average AI score (subquery in HAVING)
SELECT CONCAT(u.f_name, ' ', u.l_name) AS full_name,
       ROUND(AVG(s.ai_score), 1) AS avg_score
FROM users u
JOIN submission s ON u.user_id = s.user_id
GROUP BY u.user_id, u.f_name, u.l_name
HAVING AVG(s.ai_score) = (
    SELECT MAX(avg_sub)
    FROM (SELECT AVG(ai_score) AS avg_sub FROM submission GROUP BY user_id) AS scores
);

-- Q15: Locked tasks where the prerequisite lesson has NOT been completed
-- i.e., the user hasn't submitted (passed) the gating lesson
SELECT p.proj_name, kt.task_name, kt.skill_req,
       l.title AS required_lesson,
       CONCAT(u.f_name, ' ', u.l_name) AS project_owner
FROM kanban_task kt
JOIN project p  ON kt.project_id = p.project_id
JOIN users u     ON p.user_id = u.user_id
JOIN lesson l   ON kt.lesson_id = l.lesson_id
WHERE kt.status = 'locked'
  AND l.lesson_id NOT IN (
      SELECT DISTINCT lesson_id FROM submission
      WHERE user_id = p.user_id AND ai_score >= 70
  )
ORDER BY p.proj_name, kt.task_name;

