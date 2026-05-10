# Project Instructions

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: MySQL 8.x
- **Frontend**: Vanilla JavaScript, HTML5, CSS3 (Custom Design System)
- **Auth**: JWT, bcrypt
- **Libraries**: `mysql2/promise`, `jsonwebtoken`, `bcrypt`, `docx`, `pptxgenjs`

## Code Style
- **File Naming**: 
  - SQL: `XX_FILENAME.sql` (e.g., `01_DDL.sql`)
  - JS: snake_case or kebab-case
- **Database**: 
  - Tables: snake_case (e.g., `kanban_task`)
  - Columns: snake_case
- **CSS**: kebab-case for variables and classes
- **JS**: camelCase for variables/functions

## Testing
- No test suite detected. 
- Use manual verification or project scripts.

## Build & Run
- **Dev (Backend)**: `cd website && npm run dev` (uses nodemon)
- **Start (Backend)**: `cd website && npm start`
- **Frontend**: Served statically by Express from `website/`
- **Database**: Execute `sql/` files in order (01, 02, 03, 04) to set up and populate `brio_db`.

## Project Structure
- `website/`: Core application (Server + Client)
- `sql/`: Database schema, data, and logic
- `tools/`: Utility scripts (e.g., PDF ingestion)
- `docs/`: Documentation and specs
- `f Sem 1/`, `f Sem 2/`: Academic context and resources

## Conventions
- **Error Handling**: Standard Express try/catch with 500 status and JSON response: `{ "error": "message" }`.
- **Database Logic**: Heavy use of SQL Views for dashboards, Triggers for automation (task unlocking), and Transactions for atomic operations.
- **Styling**: Retro-futuristic theme tokens in `styles.css`.
