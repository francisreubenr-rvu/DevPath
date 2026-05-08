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

// Get user profile + stats
app.get('/api/profile/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM learner_dashboard_view WHERE user_id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get user projects
app.get('/api/projects/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM project_kanban_view WHERE owner LIKE (SELECT CONCAT(f_name, " ", l_name) FROM users WHERE user_id = ?)', [req.params.userId]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get Kanban tasks for a project
app.get('/api/kanban/:projectId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM kanban_task WHERE project_id = ? ORDER BY priority DESC', [req.params.projectId]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Submit lesson
app.post('/api/submit', async (req, res) => {
  try {
    const { userId, lessonId, score } = req.body;
    await pool.query('INSERT INTO submission (user_id, sub_date, lesson_id, ai_score, feedback) VALUES (?, NOW(), ?, ?, ?)', 
      [userId, lessonId, score, `Submitted via Brio Main UI. Score: ${score}`]);
    res.json({ success: true, message: score >= 70 ? "Mastery achieved! Tasks unlocked." : "Score too low. Keep learning!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get all lessons for a user
app.get('/api/lessons/:userId', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT l.lesson_id, l.title, l.lesson_no, c.title as course_title, s.ai_score
        FROM lesson l
        JOIN course c ON l.course_id = c.course_id
        JOIN enrollment e ON c.course_id = e.course_id
        LEFT JOIN submission s ON (l.lesson_id = s.lesson_id AND s.user_id = e.user_id)
        WHERE e.user_id = ?
        ORDER BY c.title, l.lesson_no
      `, [req.params.userId]);
      res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

const PORT = 3001;
app.listen(PORT, () => console.log(`Brio Main Platform running on http://localhost:${PORT}`));