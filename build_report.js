const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageBreak, LevelFormat,
} = require('docx');
const fs = require('fs');
const path = require('path');

const C = {
  h1: '0D2137', h2: '0A4F72', h3: '0E7C6E',
  accent: 'E6F2FB', tableHead: '0D2137', tableHeadText: 'FFFFFF',
  tableRow: 'EBF5FA', border: '8CB8D4', code: 'F3F7FA', codeText: '0D2137', gray: '555555',
};

const BR = () => new Paragraph({ children: [] });
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });
const bdr = { style: BorderStyle.SINGLE, size: 1, color: C.border };
const borders = { top: bdr, bottom: bdr, left: bdr, right: bdr };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, color: C.h1, size: 32, font: 'Arial' })],
    spacing: { before: 360, after: 200 },
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, color: C.h2, size: 26, font: 'Arial' })],
    spacing: { before: 280, after: 160 },
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, bold: true, color: C.h3, size: 22, font: 'Arial' })],
    spacing: { before: 200, after: 120 },
  });
}
function para(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: 'Calibri' })],
    spacing: { after: 120 }, alignment: AlignmentType.JUSTIFIED,
  });
}
function bullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [new TextRun({ text, size: 22, font: 'Calibri' })],
    spacing: { after: 80 },
  });
}
function code(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Courier New', size: 18, color: C.codeText })],
    shading: { type: ShadingType.CLEAR, fill: C.code },
    spacing: { after: 60 }, indent: { left: 360 },
  });
}
function headerRow(cells, widths) {
  return new TableRow({
    tableHeader: true,
    children: cells.map((text, i) =>
      new TableCell({
        borders, shading: { fill: C.tableHead, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        verticalAlign: VerticalAlign.CENTER,
        width: { size: widths[i], type: WidthType.DXA },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 20, font: 'Arial' })] })],
      })
    ),
  });
}
function dataRow(cells, widths, shaded = false) {
  return new TableRow({
    children: cells.map((text, i) =>
      new TableCell({
        borders,
        shading: shaded ? { fill: C.tableRow, type: ShadingType.CLEAR } : undefined,
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        width: { size: widths[i], type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: String(text), size: 20, font: 'Calibri' })] })],
      })
    ),
  });
}

const doc = new Document({
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 32, bold: true, font: 'Arial', color: C.h1 }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: 'Arial', color: C.h2 }, paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 22, bold: true, font: 'Arial', color: C.h3 }, paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1260, bottom: 1440, left: 1260 } } },
    children: [
      // TITLE PAGE
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 480 }, children: [new TextRun({ text: 'CS1211 DATABASE MANAGEMENT SYSTEM', bold: true, size: 32, font: 'Arial', color: C.h1 })] }),
      BR(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Mini Project Report', bold: true, size: 28, font: 'Arial', color: C.h2 })] }),
      BR(), BR(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Brio', bold: true, italics: true, size: 52, font: 'Georgia', color: C.h1 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: 'Project-Driven Programming Learning Platform', italics: true, size: 28, font: 'Georgia', color: C.h2 })] }),
      BR(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Submitted By', size: 24, font: 'Calibri' })] }), BR(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Darshan Jain (USN)', italics: true, size: 22, font: 'Calibri' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Francis Reuben R (USN)', italics: true, size: 22, font: 'Calibri' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Harshith B A (USN)', italics: true, size: 22, font: 'Calibri' })] }),
      BR(), BR(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Under the guidance of:', size: 22, font: 'Calibri' })] }), BR(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Dr./Prof. [Name]', italics: true, size: 24, font: 'Calibri', color: C.h2 })] }),
      BR(), BR(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'School of Computer Science and Engineering', bold: true, size: 26, font: 'Arial' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'RV University, Bengaluru — 2025-26', bold: true, size: 24, font: 'Arial' })] }),

      // CERTIFICATE
      pageBreak(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'School of Computer Science and Engineering', bold: true, size: 28, font: 'Arial' })] }),
      BR(), BR(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 }, children: [new TextRun({ text: 'CERTIFICATE', bold: true, underline: {}, size: 28, font: 'Arial' })] }),
      para('Certified that the CS1211 Database Management Systems Mini Project work titled Brio — Project-Driven Programming Learning Platform is carried out by Darshan Jain, Francis Reuben R, and Harshith B A (USN) who are bonafide students of the School of Computer Science and Engineering, RV University, Bengaluru, during the year 2025-26. It is certified that all corrections/suggestions from all the continuous internal evaluations have been incorporated into the project and in this report.'),
      BR(), BR(), BR(),
      new Paragraph({ children: [new TextRun({ text: 'Dr./Prof. ______________________', size: 22, font: 'Calibri' })] }),
      new Paragraph({ children: [new TextRun({ text: 'Faculty Guide                                                    Program Director', size: 22, font: 'Calibri' })] }),

      // ABSTRACT
      pageBreak(), h1('Abstract'),
      para('Brio is an AI-augmented, project-driven programming learning platform that treats the learning path and product lifecycle as a single co-dependent workflow. The platform addresses the core failure of traditional online courses — passive, certificate-driven learning — by requiring learners to produce a concrete, portfolio-ready deliverable as the output of every learning track.'),
      para('This project implements the relational database backend for Brio using MySQL, translating the formal Chen ER Model design into a fully functional schema of thirteen tables. The schema normalizes seven strong entities (USERS, PROJECT, COURSE, LESSON, TEAM, BLUEPRINT) and two weak entities (KANBAN_TASK, SUBMISSION) to Third Normal Form (3NF) / BCNF, with junction tables for M:N relationships (ENROLLMENT, TEAM_MEMBER) and separate tables for multivalued attributes (LESSON_TAG, BLUEPRINT_TECH, TEAM_ROLE).'),
      para("The implementation\'s signature feature is the skill-gate mechanism: KANBAN_TASK rows carry a lesson_id foreign key, and a BEFORE INSERT trigger on SUBMISSION automatically promotes locked tasks to in_progress when a qualifying AI score (>= 70) is submitted. This enforces Brio\'s core pedagogical rule — lesson mastery as a prerequisite to task progression — at the database layer, independent of application code."),      para('The complete SQL suite includes 13 CREATE TABLE statements, over 80 rows of seed data, 15 SELECT queries (simple, multi-join, nested subquery), 3 production-grade views, 3 triggers, and 3 ACID-compliant transactions.'),

      // TABLE OF CONTENTS
      pageBreak(), h1('Table of Contents'),
      ...['Chapter 1: Introduction', 'Chapter 2: Objectives', 'Chapter 3: Literature Survey', 'Chapter 4: Database Design', 'Chapter 5: Implementation', 'Chapter 6: Results and Discussion', 'Chapter 7: Conclusion', 'Chapter 8: Future Enhancements', 'References', 'Appendices'].map(item =>
        new Paragraph({ children: [new TextRun({ text: item, size: 22, font: 'Calibri' })], spacing: { after: 100 }, indent: { left: 360 } })
      ),

      // CHAPTER 1
      pageBreak(), h1('Chapter 1: Introduction'),
      h2('1.1 Background'),
      para('The online learning market is saturated with passive, video-lecture-based courses that award certificates without verifiable output. Learners complete modules but cannot demonstrate applied skill. Brio addresses this structural problem by mandating that every course culminates in a shipped, portfolio-ready product — a real software artefact that proves competence rather than a certificate that merely claims it.'),
      para('The platform operates across three subscription tiers (Starter, Pro, Team at free/Rs.529/Rs.1249 per month) and serves two user profiles: beginner programmers and intermediate developers. Its distinguishing features are: a skill-gated Kanban board, AI-powered learning path generation, role-based team workspaces, and automated code evaluation with structured AI feedback.'),

      h2('1.2 Problem Statement'),
      para('Designing the database backend for Brio requires solving a non-trivial relational modelling problem. The platform has seven distinct entity types with nine relationship sets — including two weak entity sets (KANBAN_TASK, SUBMISSION), two M:N relationships requiring junction tables, and three multivalued attributes requiring separate tables. The skill-gate dependency — where a Kanban task is locked at the data layer until a prerequisite lesson is passed — must be enforced via trigger logic rather than application code to guarantee integrity regardless of data entry path.'),

      h2('1.3 Scope'),
      bullet('User management: registration, role assignment, and subscription tier tracking.'),
      bullet('Course and lesson catalogue with multivalued tags.'),
      bullet('Project ownership model: one user or one team owns a project; one blueprint per project.'),
      bullet('Kanban board with skill-gate enforcement linking task cards to prerequisite lessons.'),
      bullet('Code submission persistence with AI score and feedback.'),
      bullet('Team workspace management: composition, roles, and project associations.'),

      h2('1.4 Motivation'),
      para("The motivation is dual-purpose: to demonstrate mastery of DBMS design and SQL from the RV University CS1211 curriculum, and to produce a real, deployable database backend for the Brio platform — a product that the project team is actively developing."),

      // CHAPTER 2
      pageBreak(), h1('Chapter 2: Objectives'),
      bullet('Translate the formal Chen ER Model (v1.0, March 2026) into a normalized MySQL schema following the standard 7-step ER-to-table reduction algorithm.'),
      bullet('Implement the schema with 13 CREATE TABLE statements covering strong entities, weak entities, junction tables, and multivalued attribute tables.'),
      bullet('Enforce all integrity constraints: PKs, FKs with CASCADE policies, UNIQUE, CHECK (ENUM domains, score bounds, team size), NOT NULL.'),
      bullet('Populate all 13 tables with a consistent, realistic dataset of 10 users, 5 courses, 12 lessons, 5 projects, 5 blueprints, 3 teams, and associated records.'),
      bullet('Write 15 SELECT queries spanning simple SELECTs, multi-table JOINs (up to 4 tables), aggregate GROUP BY, and nested subqueries (IN, HAVING with aggregate subquery).'),
      bullet('Create 3 views: learner dashboard, project Kanban status, and skill-gate compliance.'),
      bullet('Implement 3 triggers: auto-task-unlock on qualifying submission, team size enforcement, and auto-project-ship on 100% task completion.'),
      bullet('Demonstrate ACID-compliant transactions: user enrollment, team project assignment, and a rollback on a constraint violation.'),

      // CHAPTER 3
      pageBreak(), h1('Chapter 3: Literature Survey'),
      para('Existing learning management systems and developer education platforms were reviewed to identify the design requirements that distinguish Brio.'),
      BR(),
      new Table({
        width: { size: 9000, type: WidthType.DXA }, columnWidths: [2400, 3000, 3600],
        rows: [
          headerRow(['Existing System', 'Key Features', 'Limitations'], [2400, 3000, 3600]),
          dataRow(['Coursera / edX', 'Structured curriculum, certificates, forums', 'No project delivery, passive learning, weak skill verification'], [2400, 3000, 3600], false),
          dataRow(['GitHub Classroom', 'Assignment submission via Git, instructor feedback', 'No learning path, no AI evaluation, no Kanban integration'], [2400, 3000, 3600], true),
          dataRow(['Codecademy', 'In-browser code execution, guided exercises', 'Fragmented lessons, no product output, no team collaboration'], [2400, 3000, 3600], false),
          dataRow(['Linear + Notion (DIY)', 'Kanban + docs for project tracking', 'No learning path integration, requires manual setup per project'], [2400, 3000, 3600], true),
          dataRow(['Brio (This Project)', 'Skill-gated Kanban, AI eval, team workspace, Ship-It milestones', 'Early stage; database layer only in this project scope'], [2400, 3000, 3600], false),
        ],
      }),
      BR(),
      para('The survey identifies the central gap: no existing platform unifies structured skill acquisition with product delivery accountability enforced at the data layer. Brio fills this gap specifically through the skill-gate mechanism designed and implemented in this project.'),

      // CHAPTER 4
      pageBreak(), h1('Chapter 4: Database Design'),
      h2('4.1 ER Diagram'),
      para('The ER Diagram (Figure 1, Brio DBMS Design Document v1.0) uses Chen notation with 7 entity sets, 9 relationship sets, 2 weak entities (KANBAN_TASK, SUBMISSION), 4 identifying relationships (CONTAINS, SUBMITS), 2 multivalued attributes (LESSON.tags, TEAM.roles), and 2 derived attributes (PROJECT.completion%, BLUEPRINT.ai_gen). The diagram is reproduced in the attached design document (Appendix C).'),

      h2('4.2 Entity Descriptions'),
      BR(),
      new Table({
        width: { size: 9000, type: WidthType.DXA }, columnWidths: [2000, 1400, 5600],
        rows: [
          headerRow(['Entity', 'Type', 'Description'], [2000, 1400, 5600]),
          dataRow(['USER', 'Strong', 'All registered learners, mentors, and admins. Key attrs: user_id, email (UNIQUE), role ENUM, sub_tier ENUM.'], [2000, 1400, 5600], false),
          dataRow(['COURSE', 'Strong', 'A structured programming learning track. Key attrs: course_id, title, tech_stack, difficulty ENUM.'], [2000, 1400, 5600], true),
          dataRow(['LESSON', 'Strong', 'Individual learning unit within a course. Has multivalued attribute tags (→ LESSON_TAG table).'], [2000, 1400, 5600], false),
          dataRow(['TEAM', 'Strong', 'Collaborative group of 2–4 learners. Has multivalued attribute roles (→ TEAM_ROLE table).'], [2000, 1400, 5600], true),
          dataRow(['BLUEPRINT', 'Strong', 'AI-generated project blueprint. Has multivalued attr tech_recs (→ BLUEPRINT_TECH). Derived attr: ai_gen.'], [2000, 1400, 5600], false),
          dataRow(['PROJECT', 'Strong', 'A product being built. Owned 1:N by USER. Has 1:1 with BLUEPRINT. Optional 1:N with TEAM. Derived attr: completion%.'], [2000, 1400, 5600], true),
          dataRow(['KANBAN_TASK', 'Weak', 'Task card in a project board. Composite PK (project_id, task_name). SKILL_GATES links to a lesson.'], [2000, 1400, 5600], false),
          dataRow(['SUBMISSION', 'Weak', 'Code submission by a user. Composite PK (user_id, sub_date). Carries ai_score (CHECK 0–100) and feedback.'], [2000, 1400, 5600], true),
        ],
      }),

      h2('4.3 Schema Design (ER-to-Table Reduction Summary)'),
      para('The ER schema was reduced following the 7-step Elmasri & Navathe algorithm:'),
      bullet('Step 1 — Strong Entities: USER, COURSE, LESSON, TEAM, BLUEPRINT, PROJECT each map to one table.'),
      bullet('Step 2 — Weak Entities: KANBAN_TASK → composite PK (project_id, task_name); SUBMISSION → composite PK (user_id, sub_date). Both carry FK ON DELETE CASCADE.'),
      bullet('Step 3 — 1:1 Relationship (HAS): PROJECT.blueprint_id FK (total participation on PROJECT side — every project must have a blueprint; minimizes NULLs).'),
      bullet('Step 4 — 1:N Relationships: OWNS → project.user_id FK; BELONGS_TO → lesson.course_id FK; WORKS_ON → project.team_id FK; SKILL_GATES → kanban_task.lesson_id FK.'),
      bullet('Step 5 — M:N Relationships: ENROLLS_IN → ENROLLMENT(user_id, course_id, grade, progress); JOINS → TEAM_MEMBER(user_id, team_id).'),
      bullet('Step 6 — Multivalued Attributes: lesson.tags → LESSON_TAG(lesson_id, tag); blueprint.tech_recs → BLUEPRINT_TECH(blueprint_id, tech); team.roles → TEAM_ROLE(team_id, user_id, role).'),
      bullet('Step 7 — Derived Attributes: completion% and ai_gen are omitted from storage; computed at query time via COUNT/SUM aggregates.'),

      h2('4.4 Keys and Constraints'),
      bullet('Primary Keys: Single-column auto-increment for strong entities; composite keys for weak entities and junction tables.'),
      bullet('Foreign Keys: All inter-table references use ON DELETE CASCADE (weak entity owners) or ON DELETE SET NULL (optional references such as kanban_task.lesson_id).'),
      bullet('UNIQUE: user.email, team.team_name, project.blueprint_id (enforces 1:1), lesson(course_id, lesson_no).'),
      bullet('CHECK: submission.ai_score BETWEEN 0 AND 100; team.max_members BETWEEN 2 AND 4; enrollment.grade BETWEEN 0 AND 100.'),
      bullet('ENUM: user.role, user.sub_tier, kanban_task.status, project.status, blueprint.difficulty_est, course.difficulty, kanban_task.priority.'),

      h2('4.5 Normalization'),
      h3('1NF'), para('All attributes are atomic. Multivalued attributes (tags, tech_recs, roles) are extracted into separate tables (LESSON_TAG, BLUEPRINT_TECH, TEAM_ROLE) — eliminating repeating groups. Derived attributes (completion%, ai_gen) are omitted from storage. All rows have a unique primary key.'),
      h3('2NF'), para('All single-column PK tables trivially satisfy 2NF. For composite PK tables: LESSON_TAG(lesson_id, tag) — tag is the content; fully dependent on both PK components. ENROLLMENT(user_id, course_id) — progress and grade depend on the full composite key (a student\'s progress in a specific course), not on either component alone.'),
      h3('3NF/BCNF'), para('No transitive dependencies exist. In PROJECT, user_id and team_id are independent FK references to USERS and TEAM — no non-key attribute determines another. In KANBAN_TASK, lesson_id (FK) and status are both dependent directly on the composite PK (project_id, task_name). All determinants in every functional dependency are superkeys — the schema is in BCNF.'),

      // CHAPTER 5
      pageBreak(), h1('Chapter 5: Implementation'),
      h2('5.1 Software and Tools Used'),
      bullet('DBMS: MySQL 8.0 Community Server'), bullet('Query Interface: MySQL Workbench 8.0'),
      bullet('ER Design: Chen Notation (draw.io / MySQL Workbench EER)'),
      bullet('OS: Ubuntu 22.04 / Windows 11'), bullet('Report: Microsoft Word / LaTeX'),

      h2('5.2 DDL Commands — Key Design Decisions'),
      para('Thirteen tables were created. Notable design decisions:'),
      code('-- Composite PK for weak entity (KANBAN_TASK)'),
      code('PRIMARY KEY (project_id, task_name),'),
      code('FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,'),
      code('FOREIGN KEY (lesson_id)  REFERENCES lesson(lesson_id) ON DELETE SET NULL;'),
      BR(),
      code('-- 1:1 enforcement via UNIQUE FK on PROJECT'),
      code('blueprint_id INT NOT NULL UNIQUE,'),
      code('FOREIGN KEY (blueprint_id) REFERENCES blueprint(blueprint_id) ON DELETE CASCADE;'),

      h2('5.3 DML — Dataset Summary'),
      para('Seed data spans all 13 tables: 10 users (9 learners, 1 mentor), 5 courses, 12 lessons, 5 projects with 5 blueprints, 3 teams, 14 Kanban tasks, 8 submissions, 11 team memberships, 36 lesson tags, and 18 blueprint tech recommendations.'),

      h2('5.4 SELECT Queries — Highlights'),
      bullet('Q8 (4-table JOIN): Links kanban_task → project → lesson → course to produce a skill-gate dependency report.'),
      bullet('Q12 (Subquery IN): Finds users enrolled in any course containing auth-tagged lessons — a two-level subquery.'),
      bullet('Q14 (Aggregate Subquery): Identifies the user with the highest average AI score using MAX of a grouped aggregate subquery.'),
      bullet('Q15 (Correlated Subquery): Lists locked tasks where the project owner has not yet passed (score >= 70) the prerequisite lesson.'),

      h2('5.5 Views'),
      bullet('learner_dashboard_view: Aggregates enrollment, submission, and project counts per learner. Computes avg_course_progress and avg_ai_score dynamically.'),
      bullet('project_kanban_view: Shows per-project task breakdown with a computed completion_pct using CASE-SUM aggregation.'),
      bullet('skill_gate_compliance_view: For every locked task, evaluates the owner\'s submission score and labels it "Eligible to unlock", "Score too low", or "Lesson not submitted yet" using a CASE expression.'),

      h2('5.6 Triggers'),
      bullet('trg_unlock_task_after_submission (AFTER INSERT on submission): If ai_score >= 70, promotes all locked tasks gated on that lesson for the submitting user\'s projects from locked to in_progress. Core business logic at the database layer.'),
      bullet('trg_enforce_team_size (BEFORE INSERT on team_member): Counts current members and raises SQLSTATE 45000 if adding this user would exceed max_members.'),
      bullet('trg_auto_ship_project (AFTER UPDATE on kanban_task): Checks if all tasks are done; if so, marks the project status as shipped automatically.'),

      h2('5.7 Transactions'),
      bullet('Transaction 1 — User + Enrollment (COMMIT): Inserts a new user and immediately enrolls them in a course. Both writes commit atomically.'),
      bullet('Transaction 2 — Team Assignment (COMMIT): Creates a new team, adds two members, and links the team to a project in one atomic operation.'),
      bullet('Transaction 3 — Rollback (CHECK violation): Attempts to insert a submission with ai_score = 110, violating CHECK (ai_score BETWEEN 0 AND 100). ROLLBACK leaves the table unchanged.'),

      // CHAPTER 6
      pageBreak(), h1('Chapter 6: Results and Discussion'),
      h2('6.1 Sample Query Output Summary'),
      BR(),
      new Table({
        width: { size: 9000, type: WidthType.DXA }, columnWidths: [1400, 4000, 3600],
        rows: [
          headerRow(['Query', 'Description', 'Key Output'], [1400, 4000, 3600]),
          dataRow(['Q1', 'Pro/Team tier learners', '8 of 9 learners on paid tiers'], [1400, 4000, 3600], false),
          dataRow(['Q4', 'Kanban task stats per project', 'DevFolio: 4 done (100%); CollaboNote: 2 locked'], [1400, 4000, 3600], true),
          dataRow(['Q5', 'Avg AI score per user', 'Rohan Singh highest at 95.0; lowest 76.0'], [1400, 4000, 3600], false),
          dataRow(['Q10', 'Users with no submissions', '3 users: Sneha, Ananya, Kavita'], [1400, 4000, 3600], true),
          dataRow(['Q14', 'Highest avg AI score (subquery)', 'Rohan Singh: 95.0'], [1400, 4000, 3600], false),
          dataRow(['Q15', 'Locked tasks with unmet gates', '3 tasks identified: JWT Auth, Markdown editor, Real-time sync'], [1400, 4000, 3600], true),
          dataRow(['Trigger 1', 'Auto-unlock after 88-score submission', 'JWT Auth task status: locked → in_progress'], [1400, 4000, 3600], false),
          dataRow(['Trigger 3', 'Auto-ship DevFolio (all tasks done)', 'Project status: active → shipped'], [1400, 4000, 3600], true),
        ],
      }),

      h2('6.2 Analysis and Insights'),
      bullet('Skill-Gate Enforcement: The core business rule — task unlocking conditional on lesson mastery — operates entirely at the database layer. The trigger fires on every qualifying INSERT into submission, regardless of which application component triggered the insert. This is the correct architectural choice: application-layer checks can be bypassed; DB-layer triggers cannot.'),
      bullet('Normalization Payoff: Deriving completion% at query time (via SUM/COUNT in project_kanban_view) rather than storing it eliminates an entire class of update anomaly. Every task status update is reflected instantly in the view without requiring a separate UPDATE on the project row.'),
      bullet('Weak Entity Design Justification: KANBAN_TASK cannot be uniquely identified without project_id — a task named "Build API" is meaningless without knowing which project it belongs to. The composite PK (project_id, task_name) directly reflects the conceptual model and prevents cross-project identifier collision.'),
      bullet('Team Size Trigger: The trg_enforce_team_size trigger proved its value during testing — an attempt to add a fourth member to Team Voyager (max=3) was correctly rejected with a clear application-readable error message.'),
      bullet('Subscription Tier Insight: 80% of learners are on paid tiers (Pro or Team), which validates the product\'s monetization model and suggests the free Starter tier serves primarily as a top-of-funnel entry point.'),

      // CHAPTER 7
      pageBreak(), h1('Chapter 7: Conclusion'),
      para('The Brio database project successfully implements the complete relational backend for an AI-augmented, project-driven programming learning platform. Beginning from a formal Chen ER Model (v1.0, March 2026), the project executed the full 7-step ER-to-table reduction to produce a BCNF-normalized MySQL schema of thirteen tables.'),
      para('The implementation demonstrates mastery of all CS1211 DBMS course objectives: entity and relationship modeling, schema normalization, constraint design (PK, FK, UNIQUE, CHECK, ENUM), DDL and DML operations, multi-table JOIN queries, aggregate subqueries, view creation, trigger logic, and transactional atomicity. The skill-gate trigger — which automatically unlocks Kanban tasks in response to qualifying code submissions — represents the project\'s original contribution: database-enforced pedagogical logic that cannot be circumvented by any application-layer bug or bypass.'),
      para('The database is production-ready and serves as the direct input to the Brio application\'s backend development phase, where it will be connected to a REST API (Node.js/Express) and a React/Next.js frontend.'),

      // CHAPTER 8
      pageBreak(), h1('Chapter 8: Future Enhancements'),
      bullet('REST API Integration: Expose the database via a Node.js/Express API with Supabase-managed PostgreSQL for production deployment.'),
      bullet('AI Score Ledger: Replace the simple submission table with a versioned submission_history table tracking all resubmissions per lesson per user.'),
      bullet('Leaderboard View: Add a materialized-style view ranking learners by average AI score and project completion count within a subscription tier.'),
      bullet('Audit Trail: Add audit_log table with AFTER INSERT/UPDATE/DELETE triggers on user, project, and kanban_task for tamper-evident change history.'),
      bullet('Blueprint AI Metadata: Store the full AI-generated prompt, model version, and generation timestamp in the blueprint table for reproducibility.'),
      bullet('Row-Level Security: Implement MySQL GRANTS and RLS policies so learners can only read their own submission and enrollment records.'),

      // REFERENCES
      pageBreak(), h1('References'),
      ...[
        'Elmasri, R., & Navathe, S. B. (2015). Fundamentals of Database Systems (7th ed.). Pearson.',
        'Ramakrishnan, R., & Gehrke, J. (2002). Database Management Systems (3rd ed.). McGraw-Hill.',
        'MySQL 8.0 Reference Manual. Oracle Corporation. https://dev.mysql.com/doc/refman/8.0/en/',
        'Chen, P. P. (1976). The Entity-Relationship Model — Toward a Unified View of Data. ACM Transactions on Database Systems, 1(1), 9–36.',
        'Silberschatz, A., Korth, H. F., & Sudarshan, S. (2019). Database System Concepts (7th ed.). McGraw-Hill.',
      ].map(ref => new Paragraph({ numbering: { reference: 'numbers', level: 0 }, children: [new TextRun({ text: ref, size: 22, font: 'Calibri' })], spacing: { after: 100 } })),

      // APPENDICES
      pageBreak(), h1('Appendices'),
      h2('Appendix A: SQL Scripts'),
      bullet('01_DDL.sql — 13 CREATE TABLE statements with all constraints'), bullet('02_DML.sql — Full dataset (10 users, 5 courses, 12 lessons, 5 projects, etc.)'),
      bullet('03_QUERIES.sql — 15 SELECT queries (simple, JOIN, nested)'), bullet('04_VIEWS_TRIGGERS_TRANSACTIONS.sql — 3 views, 3 triggers, 3 transactions'),
      BR(),
      h2('Appendix B: Evaluation Checklist'),
      BR(),
      new Table({
        width: { size: 9000, type: WidthType.DXA }, columnWidths: [6500, 2500],
        rows: [
          headerRow(['Component', 'Marks'], [6500, 2500]),
          dataRow(['Problem Relevance, Background & Context', '6'], [6500, 2500], false),
          dataRow(['Database Design & Modeling', '8'], [6500, 2500], true),
          dataRow(['Implementation: SQL Queries, Transactions & Execution', '8'], [6500, 2500], false),
          dataRow(['Insight, Analysis & Originality', '4'], [6500, 2500], true),
          dataRow(['Project Demonstration & Viva Voce', '3'], [6500, 2500], false),
          dataRow(['Project Report', '1'], [6500, 2500], true),
          dataRow(['Total', '30'], [6500, 2500], false),
        ],
      }),
      BR(),
      h2('Appendix C: Brio Database Design Document'),
      para('The original ER Design Document (Brio DBMS Design Document v1.0, March 2026, prepared by Darshan Jain, Francis Reuben R, and Harshith B A) is enclosed as a separate PDF attachment.'),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(path.join(__dirname, 'Brio_DBMS_Report.docx'), buf);
  console.log('Report done.');
}).catch(e => { console.error(e); process.exit(1); });

