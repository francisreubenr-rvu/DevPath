const pptxgen = require('pptxgenjs');
const path = require('path');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = 'Brio — DBMS Mini Project';

// Dark technical palette
const BG  = '0D1117';   // GitHub dark bg
const SURF = '161B22';  // surface
const B1  = '238636';   // github green
const B2  = '1F6FEB';   // github blue
const ACC = '58A6FF';   // accent blue
const WH  = 'F0F6FC';   // near-white text
const GR  = '8B949E';   // gray muted
const YL  = 'E3B341';   // yellow gold
const RD  = 'F85149';   // red

const ms = () => ({ type: 'outer', blur: 10, offset: 4, angle: 135, color: '000000', opacity: 0.35 });

// ── Slide 1: Title ──────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };

  // Top strip
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: B1 } });

  // Big title
  s.addText('Brio', { x: 0.5, y: 0.5, w: 9, h: 1.5, fontSize: 72, color: WH, bold: true, fontFace: 'Courier New', align: 'center' });
  s.addText('Project-Driven Programming Learning Platform', { x: 0.5, y: 1.9, w: 9, h: 0.55, fontSize: 18, color: GR, fontFace: 'Courier New', align: 'center' });

  // Tag line badges
  const tags = ['7 entities', '9 relationships', '13 tables', '3NF/BCNF', 'MySQL 8.0'];
  tags.forEach((tag, i) => {
    const w = 1.55, gap = 0.12, startX = (10 - tags.length * (w + gap) + gap) / 2;
    const x = startX + i * (w + gap);
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.7, w, h: 0.38, fill: { color: SURF }, line: { color: ACC, width: 1 } });
    s.addText(tag, { x, y: 2.7, w, h: 0.38, fontSize: 11, color: ACC, align: 'center', valign: 'middle', fontFace: 'Courier New', margin: 0 });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 2.5, y: 3.35, w: 5, h: 1.35, fill: { color: SURF }, line: { color: SURF, width: 0 } });
  s.addText([
    { text: 'Authors: ', options: { bold: true, color: ACC } },
    { text: 'Darshan Jain  |  Francis Reuben R  |  Harshith B A', options: { color: WH } },
    { text: '\nGuide: ', options: { bold: true, color: ACC, breakLine: false } },
    { text: 'Dr./Prof. [Name]   |   School of CSE, RV University  |  2025–26', options: { color: GR } },
  ], { x: 2.5, y: 3.35, w: 5, h: 1.35, fontSize: 12, fontFace: 'Courier New', align: 'center', valign: 'middle', margin: 12 });

  s.addText('CS1211 DATABASE MANAGEMENT SYSTEM', { x: 0, y: 5.3, w: 10, h: 0.3, fontSize: 9, color: GR, align: 'center', fontFace: 'Courier New' });
}

// ── Slide 2: Platform Overview ──────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: B1 } });

  s.addText('What is Brio?', { x: 0.5, y: 0.2, w: 9, h: 0.7, fontSize: 28, color: WH, bold: true, fontFace: 'Courier New' });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.05, w: 4.3, h: 0.35, fill: { color: B1 } });
  s.addText('The Problem', { x: 0.5, y: 1.05, w: 4.3, h: 0.35, fontSize: 12, color: WH, bold: true, align: 'center', valign: 'middle', margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.4, w: 4.3, h: 3.4, fill: { color: SURF } });
  s.addText([
    { text: 'Online courses are passive', options: { bullet: true, breakLine: true, color: WH } },
    { text: 'Certificates prove nothing real', options: { bullet: true, breakLine: true, color: WH } },
    { text: 'No connection between learning and building', options: { bullet: true, breakLine: true, color: WH } },
    { text: 'Zero accountability for shipping', options: { bullet: true, color: WH } },
  ], { x: 0.65, y: 1.55, w: 3.95, h: 3.0, fontSize: 12, fontFace: 'Calibri', paraSpaceAfter: 10 });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.05, w: 4.3, h: 0.35, fill: { color: B2 } });
  s.addText('Brio Solution', { x: 5.2, y: 1.05, w: 4.3, h: 0.35, fontSize: 12, color: WH, bold: true, align: 'center', valign: 'middle', margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.4, w: 4.3, h: 3.4, fill: { color: SURF } });
  s.addText([
    { text: 'AI-generated, project-scoped learning paths', options: { bullet: true, breakLine: true, color: WH } },
    { text: 'Skill-gated Kanban — lesson mastery unlocks tasks', options: { bullet: true, breakLine: true, color: WH } },
    { text: 'Role-based team workspaces (2–4 devs)', options: { bullet: true, breakLine: true, color: WH } },
    { text: 'Ship It milestones replace certificates', options: { bullet: true, color: WH } },
  ], { x: 5.35, y: 1.55, w: 3.95, h: 3.0, fontSize: 12, fontFace: 'Calibri', paraSpaceAfter: 10 });

  s.addText('CS1211 DATABASE MANAGEMENT SYSTEM', { x: 0, y: 5.3, w: 10, h: 0.3, fontSize: 9, color: GR, align: 'center', fontFace: 'Courier New' });
}

// ── Slide 3: ER Schema ───────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: B2 } });
  s.addText('ER Schema — 7 Entities + 9 Relationships', { x: 0.5, y: 0.1, w: 9, h: 0.65, fontSize: 24, color: WH, bold: true, fontFace: 'Courier New' });

  const ents = [
    { name: 'USERS',         type: 'Strong', key: 'user_id, email*', col: B2,   x: 0.2,  y: 1.1,  w: 2.0, h: 0.9 },
    { name: 'COURSE',       type: 'Strong', key: 'course_id, title', col: B2,  x: 3.2,  y: 0.9,  w: 2.0, h: 0.9 },
    { name: 'LESSON',       type: 'Strong', key: 'lesson_id, tags**', col: B2, x: 6.2,  y: 0.9,  w: 2.0, h: 0.9 },
    { name: 'PROJECT',      type: 'Strong', key: 'project_id, comp%~', col: B1, x: 3.2, y: 2.5,  w: 2.0, h: 0.9 },
    { name: 'TEAM',         type: 'Strong', key: 'team_id, roles**', col: B1,  x: 0.2,  y: 3.6,  w: 2.0, h: 0.9 },
    { name: 'BLUEPRINT',    type: 'Strong', key: 'blueprint_id, ai_gen~', col: YL, x: 6.0, y: 2.5, w: 2.2, h: 0.9 },
    { name: 'KANBAN_TASK',  type: 'Weak',  key: '(project_id, task_name)', col: RD, x: 6.0, y: 4.1, w: 2.2, h: 0.9 },
    { name: 'SUBMISSION',   type: 'Weak',  key: '(user_id, sub_date)', col: RD, x: 0.2, y: 4.55, w: 2.0, h: 0.9 },
  ];

  ents.forEach(e => {
    const isweak = e.type === 'Weak';
    s.addShape(pres.shapes.RECTANGLE, { x: e.x, y: e.y, w: e.w, h: e.h, fill: { color: SURF }, line: { color: e.col, width: isweak ? 3 : 1 }, shadow: ms() });
    if (isweak) s.addShape(pres.shapes.RECTANGLE, { x: e.x + 0.06, y: e.y + 0.06, w: e.w - 0.12, h: e.h - 0.12, fill: { color: SURF }, line: { color: e.col, width: 1 } });
    s.addText(e.name, { x: e.x, y: e.y + 0.05, w: e.w, h: 0.35, fontSize: 11, color: e.col, bold: true, align: 'center', fontFace: 'Courier New' });
    s.addText(`${e.type}\n${e.key}`, { x: e.x, y: e.y + 0.42, w: e.w, h: 0.44, fontSize: 8, color: GR, align: 'center', fontFace: 'Courier New', valign: 'top' });
  });

  // Legend
  s.addText([
    { text: '* UNIQUE  ', options: { color: ACC } },
    { text: '** Multivalued  ', options: { color: YL } },
    { text: '~ Derived  ', options: { color: GR } },
    { text: 'Double-border = Weak', options: { color: RD } },
  ], { x: 0.5, y: 5.28, w: 9, h: 0.3, fontSize: 9, fontFace: 'Courier New', align: 'center' });
}

// ── Slide 4: Table Reduction ─────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: YL } });
  s.addText('ER-to-Table Reduction — 13 Tables', { x: 0.5, y: 0.1, w: 9, h: 0.65, fontSize: 24, color: WH, bold: true, fontFace: 'Courier New' });

  const rows = [
    ['Step', 'Source', 'Table(s) Produced', 'Notes'],
    ['1 — Strong Entities', 'USERS, COURSE, LESSON, TEAM, BLUEPRINT, PROJECT', '6 tables', 'Composite attrs expanded; derived attrs omitted'],
    ['2 — Weak Entities', 'KANBAN_TASK, SUBMISSION', '2 tables', 'Composite PKs; ON DELETE CASCADE FK'],
    ['3 — 1:1 (HAS)', 'PROJECT ↔ BLUEPRINT', 'blueprint_id FK on PROJECT', 'UNIQUE FK; minimizes NULLs'],
    ['4 — 1:N FK Migration', 'OWNS, BELONGS_TO, WORKS_ON, SKILL_GATES', 'FK columns on child tables', 'user_id, course_id, team_id, lesson_id'],
    ['5 — M:N Junctions', 'ENROLLS_IN, JOINS', 'ENROLLMENT, TEAM_MEMBER', 'Composite PKs; grade/progress in ENROLLMENT'],
    ['6 — Multivalued Attrs', 'tags, tech_recs, roles', 'LESSON_TAG, BLUEPRINT_TECH, TEAM_ROLE', 'Separate tables; composite PKs'],
    ['7 — Derived Attrs', 'completion%, ai_gen', '— (omitted)', 'Computed at query time via aggregates'],
  ];

  const colW = [1.6, 2.5, 2.0, 3.6];
  const tbl = [];

  rows.forEach((row, ri) => {
    const cells = row.map((text, ci) =>
      ({ text: [{ text, options: ri === 0 ? { bold: true, color: 'FFFFFF', fontSize: 10 } : { color: ri % 2 === 0 ? WH : GR, fontSize: 9 } }],
         options: {
           fill: ri === 0 ? B2 : (ri % 2 === 0 ? SURF : BG),
           border: [{ pt: 1, color: '30363D' }],
           valign: 'middle',
           margin: [4, 6, 4, 6],
         }
      })
    );
    tbl.push(cells);
  });

  s.addTable(tbl, { x: 0.3, y: 0.85, w: 9.4, h: 4.25, colW, fontFace: 'Courier New' });
  s.addText('CS1211 DATABASE MANAGEMENT SYSTEM', { x: 0, y: 5.3, w: 10, h: 0.3, fontSize: 9, color: GR, align: 'center', fontFace: 'Courier New' });
}

// ── Slide 5: Skill-Gate Mechanism ───────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: B1 } });
  s.addText('Signature Feature: Skill-Gate Mechanism', { x: 0.5, y: 0.1, w: 9, h: 0.65, fontSize: 24, color: WH, bold: true, fontFace: 'Courier New' });

  // Flow boxes
  const flow = [
    { label: 'Learner submits code', sub: 'submission.ai_score = 88', col: B2, x: 0.3, y: 1.0 },
    { label: 'AFTER INSERT trigger fires', sub: 'trg_unlock_task_after_submission', col: B1, x: 3.0, y: 1.0 },
    { label: 'Score >= 70?', sub: 'IF ai_score >= 70', col: YL, x: 5.7, y: 1.0 },
    { label: 'Task unlocked', sub: 'status: locked → in_progress', col: B1, x: 5.7, y: 2.5 },
    { label: 'Task stays locked', sub: 'status: locked (unchanged)', col: RD, x: 8.0, y: 1.0 },
  ];

  flow.forEach(f => {
    s.addShape(pres.shapes.RECTANGLE, { x: f.x, y: f.y, w: 2.5, h: 0.85, fill: { color: SURF }, line: { color: f.col, width: 2 }, shadow: ms() });
    s.addText(f.label, { x: f.x, y: f.y + 0.05, w: 2.5, h: 0.42, fontSize: 11, color: f.col, bold: true, align: 'center', valign: 'middle', fontFace: 'Courier New', margin: 2 });
    s.addText(f.sub, { x: f.x, y: f.y + 0.45, w: 2.5, h: 0.35, fontSize: 9, color: GR, align: 'center', fontFace: 'Courier New' });
  });

  // Arrows
  s.addShape(pres.shapes.LINE, { x: 2.85, y: 1.42, w: 0.14, h: 0, line: { color: WH, width: 2 } });
  s.addShape(pres.shapes.LINE, { x: 5.55, y: 1.42, w: 0.14, h: 0, line: { color: WH, width: 2 } });
  s.addShape(pres.shapes.LINE, { x: 6.95, y: 1.85, w: 0, h: 0.64, line: { color: B1, width: 2 } });
  s.addShape(pres.shapes.LINE, { x: 8.2, y: 1.42, w: 0.14, h: 0, line: { color: RD, width: 2 } });
  s.addText('YES', { x: 6.6, y: 2.0, w: 0.5, h: 0.25, fontSize: 9, color: B1, fontFace: 'Courier New' });
  s.addText('NO', { x: 7.85, y: 1.3, w: 0.4, h: 0.25, fontSize: 9, color: RD, fontFace: 'Courier New' });

  // SQL Code block
  s.addText('Trigger Code', { x: 0.3, y: 3.55, w: 9.4, h: 0.3, fontSize: 12, color: ACC, bold: true, fontFace: 'Courier New' });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.88, w: 9.4, h: 1.42, fill: { color: SURF } });
  s.addText(
    'IF NEW.ai_score >= 70 AND NEW.lesson_id IS NOT NULL THEN\n    UPDATE kanban_task kt\n    JOIN project p ON kt.project_id = p.project_id\n    SET kt.status = \'in_progress\'\n    WHERE kt.lesson_id = NEW.lesson_id AND kt.status = \'locked\' AND p.user_id = NEW.user_id;\nEND IF;',
    { x: 0.45, y: 3.95, w: 9.1, h: 1.28, fontSize: 10.5, color: WH, fontFace: 'Courier New', valign: 'top' }
  );
  s.addText('CS1211 DATABASE MANAGEMENT SYSTEM', { x: 0, y: 5.3, w: 10, h: 0.3, fontSize: 9, color: GR, align: 'center', fontFace: 'Courier New' });
}

// ── Slide 6: Key Queries ─────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: ACC } });
  s.addText('Key SQL Queries', { x: 0.5, y: 0.1, w: 9, h: 0.65, fontSize: 24, color: WH, bold: true, fontFace: 'Courier New' });

  const queries = [
    { tag: 'Q8 — Skill-Gate Map (4-table JOIN)', sql: 'SELECT p.proj_name, kt.task_name, kt.status, l.title AS gating_lesson, c.title\nFROM kanban_task kt\nJOIN project p ON kt.project_id = p.project_id\nLEFT JOIN lesson l ON kt.lesson_id = l.lesson_id\nLEFT JOIN course c ON l.course_id = c.course_id\nORDER BY p.proj_name, kt.priority DESC;' },
    { tag: 'Q15 — Locked tasks with unmet prerequisites (correlated subquery)', sql: 'SELECT p.proj_name, kt.task_name, l.title AS required_lesson\nFROM kanban_task kt JOIN project p ON kt.project_id = p.project_id\nJOIN lesson l ON kt.lesson_id = l.lesson_id\nWHERE kt.status = \'locked\'\n  AND l.lesson_id NOT IN (\n      SELECT DISTINCT lesson_id FROM submission\n      WHERE user_id = p.user_id AND ai_score >= 70);' },
  ];

  queries.forEach((q, i) => {
    const y = 0.85 + i * 2.3;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 0.85, h: 0.32, fill: { color: B2 } });
    s.addText(q.tag, { x: 1.2, y: y + 0.03, w: 8.5, h: 0.28, fontSize: 11, color: ACC, bold: true, fontFace: 'Courier New' });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: y + 0.36, w: 9.4, h: 1.75, fill: { color: SURF } });
    s.addText(q.sql, { x: 0.45, y: y + 0.42, w: 9.1, h: 1.63, fontSize: 10.5, color: WH, fontFace: 'Courier New', valign: 'top' });
  });

  s.addText('CS1211 DATABASE MANAGEMENT SYSTEM', { x: 0, y: 5.3, w: 10, h: 0.3, fontSize: 9, color: GR, align: 'center', fontFace: 'Courier New' });
}

// ── Slide 7: Views ───────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: B2 } });
  s.addText('Views — Real-Time Reporting Layer', { x: 0.5, y: 0.1, w: 9, h: 0.65, fontSize: 24, color: WH, bold: true, fontFace: 'Courier New' });

  const views = [
    { name: 'learner_dashboard_view', desc: 'Aggregates enrollment, submission, and project counts per learner. Exposes avg_course_progress (AVG of progress) and avg_ai_score (AVG of ai_score) without storing either.', cols: 'full_name | sub_tier | courses_enrolled | avg_progress | total_submissions | avg_ai_score | projects_owned', col: B2 },
    { name: 'project_kanban_view', desc: 'Shows per-project task breakdown with computed completion_pct using CASE-SUM aggregation. Replaces the derived attribute completion% from the ER model.', cols: 'proj_name | owner | team | total_tasks | done | in_progress | locked | completion_pct', col: B1 },
    { name: 'skill_gate_compliance_view', desc: 'For every locked task, evaluates the owner\'s submission score and produces a CASE expression label: "Eligible to unlock", "Score too low", or "Not submitted".', cols: 'proj_name | task_name | gating_lesson | owner | gate_status | lesson_score', col: YL },
  ];

  views.forEach((v, i) => {
    const y = 0.85 + i * 1.5;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 9.4, h: 1.35, fill: { color: SURF }, line: { color: v.col, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 9.4, h: 0.34, fill: { color: v.col } });
    s.addText(v.name, { x: 0.5, y, w: 9.0, h: 0.34, fontSize: 12, color: BG, bold: true, valign: 'middle', fontFace: 'Courier New', margin: 4 });
    s.addText(v.desc, { x: 0.5, y: y + 0.38, w: 9.0, h: 0.55, fontSize: 10, color: GR, fontFace: 'Calibri', valign: 'top' });
    s.addText(v.cols, { x: 0.5, y: y + 0.95, w: 9.0, h: 0.28, fontSize: 9, color: ACC, fontFace: 'Courier New' });
  });

  s.addText('CS1211 DATABASE MANAGEMENT SYSTEM', { x: 0, y: 5.3, w: 10, h: 0.3, fontSize: 9, color: GR, align: 'center', fontFace: 'Courier New' });
}

// ── Slide 8: Results ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: B1 } });
  s.addText('Results & Analysis', { x: 0.5, y: 0.1, w: 9, h: 0.65, fontSize: 24, color: WH, bold: true, fontFace: 'Courier New' });

  const stats = [
    { v: '80%', l: 'Learners on paid tiers', c: B1 },
    { v: '3', l: 'Tasks auto-unlocked\nby trigger (test run)', c: B2 },
    { v: '95.0', l: 'Highest avg AI score\n(Rohan Singh)', c: YL },
    { v: '0', l: 'Constraint violations\npassed through', c: RD },
  ];

  stats.forEach((st, i) => {
    const x = 0.3 + i * 2.38;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.0, w: 2.15, h: 1.55, fill: { color: SURF }, line: { color: st.c, width: 1 }, shadow: ms() });
    s.addText(st.v, { x, y: 1.1, w: 2.15, h: 0.7, fontSize: 32, color: st.c, bold: true, align: 'center', fontFace: 'Courier New' });
    s.addText(st.l, { x, y: 1.8, w: 2.15, h: 0.65, fontSize: 9.5, color: GR, align: 'center', fontFace: 'Calibri', valign: 'top', margin: 4 });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 2.75, w: 9.4, h: 2.3, fill: { color: SURF } });
  s.addText('Key Findings', { x: 0.5, y: 2.83, w: 3, h: 0.35, fontSize: 13, color: ACC, bold: true, fontFace: 'Courier New' });
  s.addText([
    { text: 'Skill-gate trigger enforces pedagogical rule at DB layer — no application bypass possible', options: { bullet: true, breakLine: true } },
    { text: 'Composite PK on KANBAN_TASK correctly models weak entity semantics from ER diagram', options: { bullet: true, breakLine: true } },
    { text: 'Skill-gate compliance view detects 3 locked tasks with unmet prerequisites — actionable student alert', options: { bullet: true, breakLine: true } },
    { text: 'Team size trigger rejected over-capacity insert (Team Voyager max=3); clean SIGNAL error returned', options: { bullet: true, breakLine: true } },
    { text: 'Derived attrs (completion%, ai_gen) correctly omitted from schema; recomputed on-demand via view aggregates', options: { bullet: true } },
  ], { x: 0.5, y: 3.22, w: 9.1, h: 1.7, fontSize: 10.5, color: WH, fontFace: 'Calibri', paraSpaceAfter: 5 });

  s.addText('CS1211 DATABASE MANAGEMENT SYSTEM', { x: 0, y: 5.3, w: 10, h: 0.3, fontSize: 9, color: GR, align: 'center', fontFace: 'Courier New' });
}

// ── Slide 9: Conclusion ──────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: B1 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.06, w: 3.5, h: 5.565, fill: { color: SURF } });

  s.addText('Conclusion', { x: 0.3, y: 0.2, w: 2.9, h: 0.55, fontSize: 22, color: WH, bold: true, fontFace: 'Courier New' });

  const facts = [
    { n: '13', l: 'Tables\nproduced' },
    { n: '15+', l: 'Queries\nwritten' },
    { n: '3',  l: 'Triggers\nimplemented' },
    { n: 'BCNF', l: 'Normalization\nachieved' },
  ];
  facts.forEach((f, i) => {
    const y = 0.9 + i * 1.15;
    s.addText(f.n, { x: 0.3, y, w: 1.1, h: 0.65, fontSize: 28, color: B1, bold: true, fontFace: 'Courier New', align: 'center' });
    s.addText(f.l, { x: 1.45, y: y + 0.05, w: 1.85, h: 0.6, fontSize: 10.5, color: GR, fontFace: 'Calibri', valign: 'top' });
  });

  s.addText([
    { text: 'Brio DB — Production Ready', options: { bold: true, fontSize: 20, color: WH, breakLine: true } },
    { text: 'BCNF-normalized, trigger-enforced, transaction-safe relational backend\nfor the Brio learning platform.\n\nThe skill-gate trigger is the original DB-layer contribution:\nLesson mastery enforced as task prerequisite — impossible to bypass.\n\nDirect input to Phase 2: Node.js/Express API + React frontend.', options: { fontSize: 12, color: GR } },
  ], { x: 3.7, y: 0.8, w: 5.9, h: 3.2, fontFace: 'Calibri', valign: 'top' });

  s.addShape(pres.shapes.RECTANGLE, { x: 3.7, y: 4.15, w: 5.9, h: 0.95, fill: { color: B2 } });
  s.addText([
    { text: 'Thank you — Open for Viva\n', options: { bold: true, color: WH, fontSize: 16, breakLine: true } },
    { text: 'Darshan Jain  |  Francis Reuben R  |  Harshith B A  |  RV University 2025–26', options: { color: GR, fontSize: 10 } },
  ], { x: 3.7, y: 4.15, w: 5.9, h: 0.95, align: 'center', valign: 'middle', fontFace: 'Courier New' });

  s.addText('CS1211 DATABASE MANAGEMENT SYSTEM', { x: 0, y: 5.3, w: 10, h: 0.3, fontSize: 9, color: GR, align: 'center', fontFace: 'Courier New' });
}

pres.writeFile({ fileName: path.join(__dirname, 'Brio_Presentation.pptx') })
  .then(() => console.log('PPT done.'))
  .catch(e => { console.error(e); process.exit(1); });
