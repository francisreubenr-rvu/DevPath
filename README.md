# Brio — Project-Driven Programming Learning Platform

This repository contains the Database Management System (DBMS) project for the course CS1211 at RV University.

## Project Structure

- `01_DDL.sql`: Schema definition (13 tables).
- `02_DML.sql`: Seed data for testing.
- `03_QUERIES.sql`: 15 complex SQL queries.
- `04_VIEWS_TRIGGERS_TRANSACTIONS.sql`: Advanced database logic.
- `build_ppt.js`: Presentation generator.
- `build_report.js`: Report generator.
- `index.html`: Brio Project landing page.

## Interactive Dashboard (Rebuilt)

The core functionality has been moved to the `Brio_Project` directory, featuring a light-themed neobrutalist dashboard and a live Node.js backend.

1. **Database Setup:**
   ```bash
   mysql -u root < 01_DDL.sql
   mysql -u root < 02_DML.sql
   ```

2. **Run Interactive Website:**
   ```bash
   cd Brio_Project/website
   npm install
   node server.js
   ```
   Open `index.html` in your browser.

## Team
- Darshan Jain
- Francis Reuben R
- Harshith B A
