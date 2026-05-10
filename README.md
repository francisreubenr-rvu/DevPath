# brio. — The Unified Learning Platform

This repository contains the Database Management System (DBMS) project for the course CS1211 at RV University.

## Project Structure

- `sql/`: Contains the complete MySQL database schema, seed data, curated queries, and triggers.
  - `01_DDL.sql`: Schema definition (13 tables, Expanded User Profile fields).
  - `02_DML.sql`: Seed data including curated Reddit/GitHub markdown learning content and bcrypt hashed passwords.
  - `03_QUERIES.sql`: 15 complex SQL queries.
  - `04_VIEWS_TRIGGERS_TRANSACTIONS.sql`: Advanced database logic.
- `website/`: Contains the unified Full-Stack Web Application.
  - `index.html`: The Vanilla JS Single Page Application featuring the Brio Neobrutalist design, JWT Auth Modal, and a 3-Tab Interface (Learning Platform, DBMS Showcase, System Viz).
  - `server.js`: The Express backend handling JWT Authentication, API endpoints, Profile updates, and live MySQL query execution.

## Getting Started

1. **Database Setup:**
   Ensure MySQL is running, then load the database files:
   ```bash
   mysql -u root < sql/01_DDL.sql
   mysql -u root < sql/02_DML.sql
   mysql -u root < sql/03_QUERIES.sql
   mysql -u root < sql/04_VIEWS_TRIGGERS_TRANSACTIONS.sql
   ```

2. **Run Interactive Full-Stack Application:**
   ```bash
   cd website
   npm install
   node server.js
   ```
   Open `http://localhost:3000` in your browser.
   *Demo Login Credentials: `james.wilson@devpath.io` / `password123`*

## Features
- **Real JWT Authentication:** Secure login using bcrypt and jsonwebtoken.
- **Customizable Profiles:** Update bio and GitHub links saved directly to the database.
- **Curated Learning:** Real Markdown content integrated from GitHub guidelines and Reddit.
- **3-in-1 Dashboard:** Manage your Kanban board, execute live SQL queries, and watch an animated system architecture flow all in one place.

## Team
- Francis Reuben R
- Darshan Jain
- Harshith B A
