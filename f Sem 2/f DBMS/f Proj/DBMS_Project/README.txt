============================================================
CS1211 DATABASE MANAGEMENT SYSTEM — MINI PROJECT
Smart Hostel Management System
RV University, School of CSE, 2025-26
============================================================

PROJECT OVERVIEW
----------------
A fully normalized (BCNF) relational database system for managing
university hostel operations: room allocations, fee payments,
complaint tracking, visitor logs, and warden assignments.

ENTITIES (8):
  Block | Room | Student | Warden | Allocation
  FeePayment | Complaint | Visitor

TOOLS:
  DBMS      : MySQL 8.0
  IDE       : MySQL Workbench 8.0
  OS        : Ubuntu 22.04 / Windows 11

============================================================
FILE STRUCTURE
============================================================

DBMS_Mini_Project/
├── sql/
│   ├── 01_DDL.sql                    ← CREATE DATABASE & TABLES
│   ├── 02_DML.sql                    ← INSERT sample data
│   ├── 03_QUERIES.sql                ← 15 SELECT queries
│   └── 04_VIEWS_TRIGGERS_TRANSACTIONS.sql ← Views, Triggers, Txns
│
├── report/
│   └── DBMS_Mini_Project_Report.docx ← Full project report (8 chapters)
│
├── presentation/
│   └── DBMS_Presentation.pptx        ← 9-slide PPT for viva
│
├── screenshots/
│   └── query_outputs.txt             ← Sample query outputs (text)
│
└── README.txt                        ← This file

============================================================
HOW TO RUN (MySQL)
============================================================

1. Open MySQL Workbench (or MySQL CLI)
2. Execute files IN ORDER:
   a. 01_DDL.sql         -- Creates hostel_db and all 8 tables
   b. 02_DML.sql         -- Inserts sample data
   c. 03_QUERIES.sql     -- Run all 15 queries
   d. 04_VIEWS_TRIGGERS_TRANSACTIONS.sql -- Views, Triggers, Txns

IMPORTANT: Run each file completely before proceeding to the next.

============================================================
EVALUATION COVERAGE
============================================================

Component                              | Coverage
---------------------------------------|----------------------------------
Problem Relevance & Context (6 marks)  | Chapter 1 of report
Database Design & Modeling (8 marks)   | ER Diagram + 8 entities + BCNF
SQL Implementation (8 marks)           | DDL+DML+15 queries+views+triggers
Insight, Analysis & Originality (4)    | Chapter 6 analysis + unique views
Demo & Viva Voce (3 marks)             | 9-slide PPT with query code
Project Report (1 mark)                | Complete 8-chapter DOCX

Total: 30 marks
============================================================
