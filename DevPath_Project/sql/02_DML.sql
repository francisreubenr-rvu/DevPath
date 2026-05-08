-- ==============================================================
-- CS1211 DATABASE MANAGEMENT SYSTEM
-- DevPath — Project-Driven Programming Learning Platform
-- File: 02_DML.sql  |  Data Manipulation Language (INSERT)
-- ==============================================================

USE devpath_db;

-- -------------------------
-- Insert Users (10)
-- -------------------------
INSERT INTO users (f_name, l_name, email, role, sub_tier) VALUES
('Aarav',    'Mehta',    'aarav.mehta@devpath.io',    'learner',  'pro'),
('Priya',    'Iyer',     'priya.iyer@devpath.io',     'learner',  'team'),
('Kiran',    'Reddy',    'kiran.reddy@devpath.io',    'learner',  'starter'),
('Sneha',    'Nair',     'sneha.nair@devpath.io',     'learner',  'team'),
('Rohan',    'Singh',    'rohan.singh@devpath.io',    'learner',  'pro'),
('Ananya',   'Sharma',   'ananya.sharma@devpath.io',  'learner',  'team'),
('Darshan',  'Jain',     'darshan.jain@devpath.io',   'learner',  'team'),
('Francis',  'Reuben',   'francis.reuben@devpath.io', 'learner',  'team'),
('Harshith', 'BA',       'harshith.ba@devpath.io',    'learner',  'team'),
('Kavita',   'Rao',      'kavita.rao@devpath.io',     'mentor',   'pro');

-- -------------------------
-- Insert Courses (5)
-- -------------------------
INSERT INTO course (title, tech_stack, difficulty) VALUES
('Full-Stack Web Development',        'React, Node.js, Express, PostgreSQL', 'intermediate'),
('Python for Data Science',           'Python, Pandas, NumPy, Matplotlib',   'beginner'),
('Mobile App Development with React Native', 'React Native, Expo, Supabase', 'intermediate'),
('DevOps & Cloud Foundations',        'Docker, GitHub Actions, AWS, Linux',  'intermediate'),
('Frontend Engineering Masterclass',  'HTML, CSS, JavaScript, Tailwind, Vite', 'beginner');

-- -------------------------
-- Insert Lessons (12)
-- -------------------------
-- Course 1: Full-Stack
INSERT INTO lesson (course_id, title, content, lesson_no) VALUES
(1, 'REST API Design Fundamentals',     'Learn HTTP verbs, status codes, resource naming, and REST constraints with hands-on Express routes.', 1),
(1, 'PostgreSQL Schema Design',         'Design normalized schemas, write DDL, and connect Node.js to a live PostgreSQL instance.', 2),
(1, 'React State Management with Hooks','Deep dive into useState, useEffect, useContext, and custom hooks for scalable component trees.', 3),
(1, 'Authentication with JWTs',         'Implement secure login/signup using bcrypt, jsonwebtoken, and HTTP-only cookie sessions.', 4),
-- Course 2: Python DS
(2, 'NumPy Array Operations',           'Master ndarray creation, indexing, broadcasting, and vectorized math operations.', 1),
(2, 'Pandas DataFrames in Depth',       'Load, clean, group, merge, and visualize real-world CSV datasets using Pandas.', 2),
(2, 'Data Visualization with Matplotlib', 'Plot line, bar, scatter, and heatmap charts with professional formatting.', 3),
-- Course 3: Mobile
(3, 'React Native Core Components',     'Build mobile UIs with View, Text, Image, FlatList, and StyleSheet.', 1),
(3, 'Supabase Auth in React Native',    'Integrate Supabase Auth SDK for email/password and OAuth flows in a mobile app.', 2),
-- Course 5: Frontend
(5, 'HTML Semantics & Accessibility',   'Structure documents with semantic HTML5, ARIA roles, and keyboard navigation.', 1),
(5, 'CSS Grid & Flexbox Layouts',       'Master two-dimensional layout with CSS Grid and one-dimensional flow with Flexbox.', 2),
(5, 'JavaScript DOM Manipulation',      'Select, modify, create, and delete DOM nodes; handle events and async fetch calls.', 3);

-- -------------------------
-- Insert Teams (3)
-- -------------------------
INSERT INTO team (team_name, max_members) VALUES
('Team Pixel',    4),
('Team Sigma',    4),
('Team Voyager',  3);

-- -------------------------
-- Insert Blueprints (5)
-- -------------------------
INSERT INTO blueprint (description, difficulty_est) VALUES
('AI-powered task manager with drag-and-drop Kanban board, real-time sync, and natural language task creation.', 'hard'),
('Personal finance dashboard tracking income, expenses, and budgets with chart visualizations.', 'medium'),
('Collaborative markdown notes app with live co-editing, tagging, and full-text search.', 'medium'),
('Developer portfolio site with project showcases, GitHub stats integration, and blog.', 'easy'),
('Real-time multiplayer quiz app with lobby, timer, leaderboard, and WebSocket backend.', 'hard');

-- -------------------------
-- Insert Projects (5)
-- -------------------------
-- user_id 1 owns projects 1 and 4 (solo)
-- user_id 7,8,9 team (Team Pixel) owns project 3
INSERT INTO project (user_id, team_id, blueprint_id, proj_name, status) VALUES
(1, NULL, 1, 'TaskFlow AI',            'active'),
(2, NULL, 2, 'BudgetLens',             'active'),
(7, 1,    3, 'CollaboNote',            'active'),
(5, NULL, 4, 'DevFolio',               'shipped'),
(4, 2,    5, 'QuizBlitz',              'planning');

-- -------------------------
-- Insert Team Members
-- -------------------------
-- Team Pixel (team_id=1): Darshan, Francis, Harshith
INSERT INTO team_member (user_id, team_id) VALUES
(7, 1), (8, 1), (9, 1);

-- Team Sigma (team_id=2): Sneha, Ananya
INSERT INTO team_member (user_id, team_id) VALUES
(4, 2), (6, 2);

-- Team Voyager (team_id=3): Aarav, Priya, Kiran
INSERT INTO team_member (user_id, team_id) VALUES
(1, 3), (2, 3), (3, 3);

-- -------------------------
-- Insert Team Roles
-- -------------------------
INSERT INTO team_role (team_id, user_id, role) VALUES
(1, 7, 'lead'),
(1, 8, 'backend'),
(1, 9, 'frontend'),
(2, 4, 'lead'),
(2, 6, 'frontend');

-- -------------------------
-- Insert Kanban Tasks
-- -------------------------
-- Project 1: TaskFlow AI
INSERT INTO kanban_task (project_id, task_name, lesson_id, status, skill_req, priority) VALUES
(1, 'Design REST API endpoints',      1, 'done',        'REST API knowledge',       'high'),
(1, 'Build PostgreSQL schema',         2, 'done',        'Schema design',            'high'),
(1, 'Implement React UI components',   3, 'in_progress', 'React Hooks',              'high'),
(1, 'Add JWT authentication',          4, 'locked',      'Auth & security',          'medium'),
(1, 'Deploy to Vercel + Supabase',     NULL, 'locked',   'Deployment know-how',      'low');

-- Project 3: CollaboNote
INSERT INTO kanban_task (project_id, task_name, lesson_id, status, skill_req, priority) VALUES
(3, 'Set up React Native project',     8, 'done',        'React Native basics',      'high'),
(3, 'Integrate Supabase Auth',         9, 'in_progress', 'Auth SDK',                 'high'),
(3, 'Build Markdown editor component', 3, 'locked',      'React component design',   'medium'),
(3, 'Real-time sync with subscriptions', NULL, 'locked', 'WebSocket/Supabase realtime', 'high');

-- Project 4: DevFolio
INSERT INTO kanban_task (project_id, task_name, lesson_id, status, skill_req, priority) VALUES
(4, 'Create semantic HTML structure',  10, 'done',       'HTML5 semantics',          'high'),
(4, 'Style with Tailwind CSS',         11, 'done',       'CSS Grid & Flexbox',       'high'),
(4, 'Add JavaScript interactivity',    12, 'done',       'DOM manipulation',         'medium'),
(4, 'Deploy to GitHub Pages',          NULL, 'done',     'Git & deployment',         'low');

-- -------------------------
-- Insert Enrollments
-- -------------------------
INSERT INTO enrollment (user_id, course_id, grade, progress) VALUES
(1, 1, 88.5, 100),   -- Aarav: Full-Stack (complete)
(1, 2, NULL, 30),    -- Aarav: Python DS (in progress)
(2, 2, 92.0, 100),   -- Priya: Python DS (complete)
(3, 5, NULL, 60),    -- Kiran: Frontend (in progress)
(4, 3, NULL, 45),    -- Sneha: Mobile (in progress)
(5, 5, 95.0, 100),   -- Rohan: Frontend (complete)
(6, 1, NULL, 70),    -- Ananya: Full-Stack (in progress)
(7, 1, 78.0, 100),   -- Darshan: Full-Stack (complete)
(8, 1, 84.0, 100),   -- Francis: Full-Stack (complete)
(9, 5, NULL, 80),    -- Harshith: Frontend (in progress)
(10, 1, NULL, 0);    -- Kavita (mentor): Full-Stack (auditing)

-- -------------------------
-- Insert Submissions (8)
-- -------------------------
INSERT INTO submission (user_id, sub_date, lesson_id, ai_score, feedback) VALUES
(1, '2025-03-01 10:00:00', 1, 91, 'Excellent RESTful route structure. Minor: missing input validation middleware.'),
(1, '2025-03-05 14:30:00', 2, 85, 'Schema is in 3NF. Suggested index on user_id FK would improve query performance.'),
(2, '2025-03-02 09:00:00', 5, 78, 'Good use of broadcasting. Array slicing syntax needs review in problems 3 and 4.'),
(3, '2025-03-10 16:00:00', 10, 88, 'Semantic HTML is clean and well-structured. Add aria-label to nav elements.'),
(5, '2025-02-20 11:00:00', 11, 95, 'Excellent mastery of CSS Grid. Creative responsive layout. 5/5 for originality.'),
(7, '2025-03-08 10:00:00', 3, 82, 'useEffect cleanup function missing, which causes memory leak on unmount. Fix and resubmit.'),
(8, '2025-03-09 15:00:00', 3, 90, 'Custom hook is well-abstracted. Minor: memoize the callback with useCallback.'),
(9, '2025-03-11 09:30:00', 12, 76, 'DOM event delegation pattern is correct. Async fetch error handling is incomplete.');

-- -------------------------
-- Insert Lesson Tags
-- -------------------------
INSERT INTO lesson_tag (lesson_id, tag) VALUES
(1, 'backend'), (1, 'api'), (1, 'http'),
(2, 'database'), (2, 'sql'), (2, 'postgresql'),
(3, 'frontend'), (3, 'react'), (3, 'hooks'),
(4, 'security'), (4, 'auth'), (4, 'jwt'),
(5, 'python'), (5, 'numpy'), (5, 'arrays'),
(6, 'python'), (6, 'pandas'), (6, 'data-wrangling'),
(7, 'visualization'), (7, 'matplotlib'), (7, 'charts'),
(8, 'mobile'), (8, 'react-native'),
(9, 'mobile'), (9, 'auth'), (9, 'supabase'),
(10, 'html'), (10, 'semantics'), (10, 'accessibility'),
(11, 'css'), (11, 'layout'), (11, 'flexbox'),
(12, 'javascript'), (12, 'dom'), (12, 'async');

-- -------------------------
-- Insert Blueprint Tech Recs
-- -------------------------
INSERT INTO blueprint_tech (blueprint_id, tech) VALUES
(1, 'React'), (1, 'Node.js'), (1, 'PostgreSQL'), (1, 'Socket.io'),
(2, 'React'), (2, 'Chart.js'), (2, 'Supabase'), (2, 'TypeScript'),
(3, 'React Native'), (3, 'Supabase'), (3, 'TypeScript'),
(4, 'HTML'), (4, 'Tailwind CSS'), (4, 'JavaScript'),
(5, 'React'), (5, 'Node.js'), (5, 'WebSocket'), (5, 'Redis');
