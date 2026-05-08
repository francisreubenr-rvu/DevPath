-- ==============================================================
-- CS1211 DATABASE MANAGEMENT SYSTEM
-- DevPath — Project-Driven Programming Learning Platform
-- File: 01_DDL.sql  |  Data Definition Language
-- Authors: Darshan Jain, Francis Reuben R, Harshith B A
-- Date: 2025–26
-- ==============================================================

CREATE DATABASE IF NOT EXISTS devpath_db;
USE devpath_db;

-- ==============================================================
-- STRONG ENTITIES
-- ==============================================================

-- --------------------------------------------------------------
-- Table 1: USERS
-- Core entity — all registered learners, mentors, and admins
-- --------------------------------------------------------------
CREATE TABLE users (
    user_id     INT PRIMARY KEY AUTO_INCREMENT,
    f_name      VARCHAR(50) NOT NULL,
    l_name      VARCHAR(50) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    role        ENUM('learner', 'mentor', 'admin') NOT NULL DEFAULT 'learner',
    joined_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sub_tier    ENUM('starter', 'pro', 'team') NOT NULL DEFAULT 'starter'
);

-- --------------------------------------------------------------
-- Table 2: COURSE
-- A structured programming learning track
-- --------------------------------------------------------------
CREATE TABLE course (
    course_id   INT PRIMARY KEY AUTO_INCREMENT,
    title       VARCHAR(150) NOT NULL,
    tech_stack  VARCHAR(200) NOT NULL,
    difficulty  ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------
-- Table 3: LESSON
-- An individual learning unit inside a course
-- course_id FK — lessons cannot exist without a course (total participation)
-- --------------------------------------------------------------
CREATE TABLE lesson (
    lesson_id   INT PRIMARY KEY AUTO_INCREMENT,
    course_id   INT NOT NULL,
    title       VARCHAR(150) NOT NULL,
    content     TEXT NOT NULL,
    lesson_no   INT NOT NULL CHECK (lesson_no > 0),
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    UNIQUE (course_id, lesson_no)
);

-- --------------------------------------------------------------
-- Table 4: TEAM
-- A collaborative group of learners (2–4 members max)
-- --------------------------------------------------------------
CREATE TABLE team (
    team_id     INT PRIMARY KEY AUTO_INCREMENT,
    team_name   VARCHAR(100) NOT NULL UNIQUE,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    max_members INT NOT NULL DEFAULT 4 CHECK (max_members BETWEEN 2 AND 4)
);

-- --------------------------------------------------------------
-- Table 5: BLUEPRINT
-- AI-generated project blueprint and tech recommendations
-- ai_gen is a DERIVED attribute — computed at query time (not stored)
-- tech_recs is multivalued — handled in BLUEPRINT_TECH table
-- --------------------------------------------------------------
CREATE TABLE blueprint (
    blueprint_id    INT PRIMARY KEY AUTO_INCREMENT,
    description     TEXT NOT NULL,
    difficulty_est  ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium',
    generated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------
-- Table 6: PROJECT
-- A product being built by a user (or team)
-- blueprint_id FK — 1:1, total on Project side
-- team_id FK    — optional (NULL if solo project)
-- user_id FK    — OWNS relationship (1:N, total on User side)
-- --------------------------------------------------------------
CREATE TABLE project (
    project_id      INT PRIMARY KEY AUTO_INCREMENT,
    user_id         INT NOT NULL,
    team_id         INT DEFAULT NULL,
    blueprint_id    INT NOT NULL UNIQUE,       -- 1:1 with BLUEPRINT
    proj_name       VARCHAR(150) NOT NULL,
    status          ENUM('planning', 'active', 'shipped') NOT NULL DEFAULT 'planning',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)      REFERENCES users(user_id)           ON DELETE CASCADE,
    FOREIGN KEY (team_id)      REFERENCES team(team_id)           ON DELETE SET NULL,
    FOREIGN KEY (blueprint_id) REFERENCES blueprint(blueprint_id) ON DELETE CASCADE
);

-- ==============================================================
-- WEAK ENTITIES
-- ==============================================================

-- --------------------------------------------------------------
-- Table 7: KANBAN_TASK (Weak Entity)
-- Composite PK = (project_id, task_name)
-- Identifying relationship: CONTAINS (PROJECT ↔ KANBAN_TASK)
-- SKILL_GATES: lesson_id FK links to the gating lesson
-- --------------------------------------------------------------
CREATE TABLE kanban_task (
    project_id  INT NOT NULL,
    task_name   VARCHAR(150) NOT NULL,
    lesson_id   INT DEFAULT NULL,           -- SKILL_GATES: unlock only after this lesson
    status      ENUM('locked', 'in_progress', 'done') NOT NULL DEFAULT 'locked',
    skill_req   VARCHAR(200) DEFAULT NULL,  -- Describes the required skill
    priority    ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, task_name),
    FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id)  REFERENCES lesson(lesson_id)   ON DELETE SET NULL
);

-- --------------------------------------------------------------
-- Table 8: SUBMISSION (Weak Entity)
-- Synthetic PK = submission_id
-- Identifying relationship: SUBMITS (USERS ↔ SUBMISSION)
-- --------------------------------------------------------------
CREATE TABLE submission (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id     INT NOT NULL,
    sub_date    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lesson_id   INT DEFAULT NULL,
    ai_score    INT CHECK (ai_score BETWEEN 0 AND 100),
    feedback    TEXT DEFAULT NULL,
    code_url    VARCHAR(255) DEFAULT NULL,
    UNIQUE (user_id, sub_date),
    FOREIGN KEY (user_id)   REFERENCES users(user_id)     ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lesson(lesson_id) ON DELETE SET NULL
);

-- ==============================================================
-- JUNCTION TABLES (M:N Relationships)
-- ==============================================================

-- --------------------------------------------------------------
-- Table 9: ENROLLMENT (M:N USER ↔ COURSE)
-- Relationship: ENROLLS_IN
-- Descriptive attribute: grade
-- --------------------------------------------------------------
CREATE TABLE enrollment (
    user_id     INT NOT NULL,
    course_id   INT NOT NULL,
    enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    grade       DECIMAL(4,1) DEFAULT NULL CHECK (grade BETWEEN 0 AND 100),
    progress    INT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id)  REFERENCES users(user_id)     ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);

-- --------------------------------------------------------------
-- Table 10: TEAM_MEMBER (M:N USER ↔ TEAM)
-- Relationship: JOINS
-- --------------------------------------------------------------
CREATE TABLE team_member (
    user_id     INT NOT NULL,
    team_id     INT NOT NULL,
    joined_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, team_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES team(team_id) ON DELETE CASCADE
);

-- ==============================================================
-- MULTIVALUED ATTRIBUTE TABLES
-- ==============================================================

-- --------------------------------------------------------------
-- Table 11: LESSON_TAG (Multivalued attr: LESSON.tags)
-- PK = (lesson_id, tag)
-- --------------------------------------------------------------
CREATE TABLE lesson_tag (
    lesson_id   INT NOT NULL,
    tag         VARCHAR(50) NOT NULL,
    PRIMARY KEY (lesson_id, tag),
    FOREIGN KEY (lesson_id) REFERENCES lesson(lesson_id) ON DELETE CASCADE
);

-- --------------------------------------------------------------
-- Table 12: BLUEPRINT_TECH (Multivalued attr: BLUEPRINT.tech_recs)
-- PK = (blueprint_id, tech)
-- --------------------------------------------------------------
CREATE TABLE blueprint_tech (
    blueprint_id    INT NOT NULL,
    tech            VARCHAR(100) NOT NULL,
    PRIMARY KEY (blueprint_id, tech),
    FOREIGN KEY (blueprint_id) REFERENCES blueprint(blueprint_id) ON DELETE CASCADE
);

-- --------------------------------------------------------------
-- Table 13: TEAM_ROLE (Multivalued attr: TEAM.roles)
-- PK = (team_id, role)
-- --------------------------------------------------------------
CREATE TABLE team_role (
    team_id     INT NOT NULL,
    user_id     INT NOT NULL,
    role        ENUM('lead', 'backend', 'frontend', 'devops', 'qa') NOT NULL,
    PRIMARY KEY (team_id, user_id),
    FOREIGN KEY (team_id) REFERENCES team(team_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
