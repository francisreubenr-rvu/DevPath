const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const JWT_SECRET = process.env.JWT_SECRET || 'brio-super-secret-key-2026';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'brio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- AUTHENTICATION ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    
    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.user_id, f_name: user.f_name, l_name: user.l_name, role: user.role, sub_tier: user.sub_tier, avatar_url: user.avatar_url } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) { res.status(401).json({ error: 'Invalid token' }); }
};

// --- PROFILE & MAIN APP ---
app.get('/api/profile/me', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id, f_name, l_name, email, bio, avatar_url, github_url, role, sub_tier, joined_at FROM users WHERE user_id = ?', [req.user.id]);
    const [stats] = await pool.query('SELECT * FROM learner_dashboard_view WHERE user_id = ?', [req.user.id]);
    res.json({ profile: rows[0], stats: stats[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/profile/update', authenticate, async (req, res) => {
  try {
    const { bio, github_url } = req.body;
    await pool.query('UPDATE users SET bio = ?, github_url = ? WHERE user_id = ?', [bio, github_url, req.user.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/projects', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM project_kanban_view WHERE owner LIKE (SELECT CONCAT(f_name, " ", l_name) FROM users WHERE user_id = ?)', [req.user.id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/kanban/:projectId', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM kanban_task WHERE project_id = ? ORDER BY priority DESC', [req.params.projectId]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/lessons', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT l.lesson_id, l.title, l.content, l.lesson_no, c.title as course_title, s.ai_score
      FROM lesson l
      JOIN course c ON l.course_id = c.course_id
      JOIN enrollment e ON c.course_id = e.course_id
      LEFT JOIN submission s ON (l.lesson_id = s.lesson_id AND s.user_id = e.user_id)
      WHERE e.user_id = ?
      ORDER BY c.title, l.lesson_no
    `, [req.user.id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/submit', authenticate, async (req, res) => {
  try {
    const { lessonId, score } = req.body;
    await pool.query('INSERT INTO submission (user_id, sub_date, lesson_id, ai_score, feedback) VALUES (?, NOW(), ?, ?, ?)', 
      [req.user.id, lessonId, score, `AI Evaluator feedback. Score: ${score}`]);
    res.json({ success: true, message: score >= 70 ? "Mastery achieved! Tasks unlocked." : "Score too low. Keep learning!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- TECHNICAL SHOWCASE ---
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

app.get('/api/showcase/stats', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [projects] = await pool.query('SELECT COUNT(*) as count FROM project');
    const [submissions] = await pool.query('SELECT COUNT(*) as count FROM submission');
    res.json({ users: users[0].count, projects: projects[0].count, submissions: submissions[0].count });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/showcase/queries', (req, res) => {
  res.json(Object.keys(queries).map(k => ({ id: k, name: queries[k].name })));
});

app.post('/api/showcase/query', async (req, res) => {
  try {
    const { queryId } = req.body;
    if (!queries[queryId]) return res.status(400).json({ error: "Invalid query" });
    const [rows] = await pool.query(queries[queryId].sql);
    res.json({ sql: queries[queryId].sql, rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/showcase/trigger', async (req, res) => {
  try {
    const userId = 4; const lessonId = 9; const projectId = 5;
    await pool.query('DELETE FROM submission WHERE user_id = ? AND lesson_id = ?', [userId, lessonId]);
    await pool.query('UPDATE kanban_task SET status = "locked" WHERE project_id = ? AND lesson_id = ?', [projectId, lessonId]);
    const [before] = await pool.query('SELECT task_name, status FROM kanban_task WHERE project_id = ? AND lesson_id = ?', [projectId, lessonId]);
    await pool.query('INSERT INTO submission (user_id, sub_date, lesson_id, ai_score, feedback) VALUES (?, NOW(), ?, 85, "Trigger Demo")', [userId, lessonId]);
    const [after] = await pool.query('SELECT task_name, status FROM kanban_task WHERE project_id = ? AND lesson_id = ?', [projectId, lessonId]);
    res.json({ before, after });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Unified Brio Backend running on http://localhost:${PORT}`));