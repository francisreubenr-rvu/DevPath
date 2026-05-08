const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'brio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const queries = {
  q1: { name: "Q1: Pro/Team tier learners", sql: "SELECT user_id, CONCAT(f_name, ' ', l_name) AS full_name, email, sub_tier FROM users WHERE sub_tier IN ('pro', 'team') AND role = 'learner' ORDER BY sub_tier, f_name;" },
  q2: { name: "Q2: Count of lessons per course", sql: "SELECT c.title AS course_title, c.difficulty, COUNT(l.lesson_id) AS lesson_count FROM course c LEFT JOIN lesson l ON c.course_id = l.course_id GROUP BY c.course_id, c.title, c.difficulty ORDER BY lesson_count DESC;" },
  q3: { name: "Q3: Active projects + blueprints", sql: "SELECT p.proj_name, p.status, b.description AS blueprint_desc, b.difficulty_est FROM project p JOIN blueprint b ON p.blueprint_id = b.blueprint_id WHERE p.status = 'active';" },
  q4: { name: "Q4: Kanban task stats per project", sql: "SELECT p.proj_name, COUNT(kt.task_name) AS total_tasks, SUM(CASE WHEN kt.status = 'done' THEN 1 ELSE 0 END) AS done_tasks, SUM(CASE WHEN kt.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress, SUM(CASE WHEN kt.status = 'locked' THEN 1 ELSE 0 END) AS locked_tasks FROM project p LEFT JOIN kanban_task kt ON p.project_id = kt.project_id GROUP BY p.project_id, p.proj_name;" },
  q5: { name: "Q5: Avg AI score per user", sql: "SELECT CONCAT(u.f_name, ' ', u.l_name) AS full_name, COUNT(s.user_id) AS total_submissions, ROUND(AVG(s.ai_score), 1) AS avg_ai_score, MAX(s.ai_score) AS best_score FROM users u JOIN submission s ON u.user_id = s.user_id GROUP BY u.user_id, u.f_name, u.l_name ORDER BY avg_ai_score DESC;" },
  q6: { name: "Q6: Full enrollment report", sql: "SELECT CONCAT(u.f_name, ' ', u.l_name) AS student_name, u.sub_tier, c.title AS course, c.difficulty, e.progress, e.grade FROM enrollment e JOIN users u ON e.user_id = u.user_id JOIN course c ON e.course_id = c.course_id ORDER BY e.progress DESC, student_name;" },
  q8: { name: "Q8: Kanban tasks with skill-gating lesson", sql: "SELECT p.proj_name, kt.task_name, kt.status, l.title AS gating_lesson, c.title FROM kanban_task kt JOIN project p ON kt.project_id = p.project_id LEFT JOIN lesson l ON kt.lesson_id = l.lesson_id LEFT JOIN course c ON l.course_id = c.course_id ORDER BY p.proj_name, kt.priority DESC;" },
  q10: { name: "Q10: Users with no submissions", sql: "SELECT CONCAT(u.f_name, ' ', u.l_name) AS full_name, u.email, u.role, u.sub_tier FROM users u LEFT JOIN submission s ON u.user_id = s.user_id WHERE s.user_id IS NULL ORDER BY u.f_name;" },
  q15: { name: "Q15: Locked tasks with unmet prerequisites", sql: "SELECT p.proj_name, kt.task_name, l.title AS required_lesson FROM kanban_task kt JOIN project p ON kt.project_id = p.project_id JOIN lesson l ON kt.lesson_id = l.lesson_id WHERE kt.status = 'locked' AND l.lesson_id NOT IN (SELECT DISTINCT lesson_id FROM submission WHERE user_id = p.user_id AND ai_score >= 70);" },
  view1: { name: "View: Learner Dashboard", sql: "SELECT * FROM learner_dashboard_view;" },
  view2: { name: "View: Project Kanban Status", sql: "SELECT * FROM project_kanban_view;" },
  view3: { name: "View: Skill Gate Compliance", sql: "SELECT * FROM skill_gate_compliance_view;" }
};

app.get('/api/queries', (req, res) => {
  res.json(Object.keys(queries).map(k => ({ id: k, name: queries[k].name })));
});

app.post('/api/query', async (req, res) => {
  try {
    const { queryId } = req.body;
    if (!queries[queryId]) return res.status(400).json({ error: "Invalid query" });
    const [rows] = await pool.query(queries[queryId].sql);
    res.json({ sql: queries[queryId].sql, rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trigger demo: Submit a score to unlock a task
app.post('/api/trigger', async (req, res) => {
  try {
    const userId = 4; // Sneha Nair
    const lessonId = 9; // Supabase Auth in React Native
    const projectId = 5; // QuizBlitz (owned by Team Sigma: Sneha & Ananya)
    
    // Clean up first just in case
    await pool.query(`DELETE FROM submission WHERE user_id = ? AND lesson_id = ?`, [userId, lessonId]);
    await pool.query(`UPDATE kanban_task SET status = 'locked' WHERE project_id = ? AND lesson_id = ?`, [projectId, lessonId]);
    
    // Get BEFORE state
    const [before] = await pool.query(`SELECT task_name, status FROM kanban_task WHERE project_id = ? AND lesson_id = ?`, [projectId, lessonId]);
    
    // Trigger INSERT
    await pool.query(`INSERT INTO submission (user_id, sub_date, lesson_id, ai_score, feedback) VALUES (?, NOW(), ?, 85, 'Trigger Demo Pass')`, [userId, lessonId]);
    
    // Get AFTER state
    const [after] = await pool.query(`SELECT task_name, status FROM kanban_task WHERE project_id = ? AND lesson_id = ?`, [projectId, lessonId]);
    
    res.json({ before, after });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [projects] = await pool.query('SELECT COUNT(*) as count FROM project');
    const [submissions] = await pool.query('SELECT COUNT(*) as count FROM submission');
    res.json({
      users: users[0].count,
      projects: projects[0].count,
      submissions: submissions[0].count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Brio SQL Engine running on http://localhost:${PORT}`));