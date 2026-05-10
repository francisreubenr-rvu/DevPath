-- ==============================================================
-- CS1211 DATABASE MANAGEMENT SYSTEM
-- Smart Hostel Management System
-- File: 01_DDL.sql  |  Data Definition Language
-- ==============================================================

CREATE DATABASE IF NOT EXISTS hostel_db;
USE hostel_db;

-- --------------------------------------------------------------
-- Table 1: BLOCK
-- Stores hostel block information
-- --------------------------------------------------------------
CREATE TABLE block (
    block_id    INT PRIMARY KEY AUTO_INCREMENT,
    block_name  VARCHAR(50) NOT NULL UNIQUE,
    block_type  ENUM('boys', 'girls') NOT NULL,
    total_rooms INT NOT NULL CHECK (total_rooms > 0),
    location    VARCHAR(100)
);

-- --------------------------------------------------------------
-- Table 2: ROOM
-- Stores individual room details; references block
-- --------------------------------------------------------------
CREATE TABLE room (
    room_id      INT PRIMARY KEY AUTO_INCREMENT,
    block_id     INT NOT NULL,
    room_number  VARCHAR(10) NOT NULL,
    floor        INT NOT NULL CHECK (floor >= 0),
    capacity     INT NOT NULL CHECK (capacity BETWEEN 1 AND 4),
    room_type    ENUM('single', 'double', 'triple') NOT NULL,
    ac_available BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (block_id) REFERENCES block(block_id) ON DELETE CASCADE,
    UNIQUE (block_id, room_number)
);

-- --------------------------------------------------------------
-- Table 3: STUDENT
-- Core student entity
-- --------------------------------------------------------------
CREATE TABLE student (
    student_id  INT PRIMARY KEY AUTO_INCREMENT,
    usn         VARCHAR(20) NOT NULL UNIQUE,
    full_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    phone       VARCHAR(15) NOT NULL,
    program     VARCHAR(50) NOT NULL,
    semester    INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    joined_date DATE NOT NULL
);

-- --------------------------------------------------------------
-- Table 4: WARDEN
-- Warden assigned to each block
-- --------------------------------------------------------------
CREATE TABLE warden (
    warden_id  INT PRIMARY KEY AUTO_INCREMENT,
    full_name  VARCHAR(100) NOT NULL,
    email      VARCHAR(100) NOT NULL UNIQUE,
    phone      VARCHAR(15) NOT NULL,
    block_id   INT NOT NULL UNIQUE,
    FOREIGN KEY (block_id) REFERENCES block(block_id) ON DELETE CASCADE
);

-- --------------------------------------------------------------
-- Table 5: ALLOCATION
-- Maps students to rooms; enforces capacity via trigger
-- --------------------------------------------------------------
CREATE TABLE allocation (
    alloc_id    INT PRIMARY KEY AUTO_INCREMENT,
    student_id  INT NOT NULL,
    room_id     INT NOT NULL,
    alloc_date  DATE NOT NULL,
    vacate_date DATE,
    status      ENUM('active', 'vacated') NOT NULL DEFAULT 'active',
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES room(room_id) ON DELETE CASCADE,
    UNIQUE (student_id, status)   -- A student can have only one active allocation
);

-- --------------------------------------------------------------
-- Table 6: FEE_PAYMENT
-- Tracks hostel fee payments per semester per student
-- --------------------------------------------------------------
CREATE TABLE fee_payment (
    payment_id   INT PRIMARY KEY AUTO_INCREMENT,
    student_id   INT NOT NULL,
    semester     INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    amount       DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    due_date     DATE NOT NULL,
    payment_date DATE,
    mode         ENUM('online', 'cash', 'upi') DEFAULT NULL,
    status       ENUM('paid', 'pending', 'overdue') NOT NULL DEFAULT 'pending',
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    UNIQUE (student_id, semester)
);

-- --------------------------------------------------------------
-- Table 7: COMPLAINT
-- Student complaints linked to room and student
-- --------------------------------------------------------------
CREATE TABLE complaint (
    complaint_id  INT PRIMARY KEY AUTO_INCREMENT,
    student_id    INT NOT NULL,
    room_id       INT NOT NULL,
    category      ENUM('maintenance', 'hygiene', 'security', 'noise', 'other') NOT NULL,
    description   TEXT NOT NULL,
    priority      ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status        ENUM('open', 'in_progress', 'resolved') NOT NULL DEFAULT 'open',
    filed_date    DATE NOT NULL,
    resolved_date DATE,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES room(room_id) ON DELETE CASCADE
);

-- --------------------------------------------------------------
-- Table 8: VISITOR
-- Visitor log for each student
-- --------------------------------------------------------------
CREATE TABLE visitor (
    visitor_id      INT PRIMARY KEY AUTO_INCREMENT,
    student_id      INT NOT NULL,
    visitor_name    VARCHAR(100) NOT NULL,
    relationship    VARCHAR(50) NOT NULL,
    phone           VARCHAR(15) NOT NULL,
    visit_date      DATE NOT NULL,
    check_in_time   TIME NOT NULL,
    check_out_time  TIME,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE
);
