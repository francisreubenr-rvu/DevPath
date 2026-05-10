CODE EXPLANATION FOR DEVFLOW PROJECT MANAGER

1. HTML (Presentable.html)
   - Structure: The layout is split into a sidebar (navigation) and a main content area using Flexbox.
   - Sections (Views): There are three main sections: Dashboard (Kanban), Products (Table), and Github (Grid).
   - Visibility Logic: Only one section is visible at a time. The active section has the class "active-view", while others have "hidden-view".
   - Modal: A hidden div (#taskModal) sits on top of the page for adding new tasks. It uses absolute positioning and a semi-transparent background.

2. CSS (Presentstyles.css)
   - Theme: A "Heritage" palette is used (Cream #Fdfbf7 background, Deep Green #2E5D4B buttons, Navy #2C3E50 headers) to look professional yet minimal.
   - Smoothness: The global selector (*) includes "transition: all 0.2s ease". This makes every interaction (hovering, clicking, moving items) feel smooth without writing complex animation code.
   - Kanban Grid: The board uses CSS Grid (grid-template-columns: repeat(3, 1fr)) to create three equal columns that resize automatically.
   - Animations: A simple @keyframes "fadeIn" animation is applied when switching views to make the content appear gently.

3. JAVASCRIPT (Presentscript.js)
   - Data Storage: The tasks are stored in a simple array of objects called 'tasks'. This serves as the database for the session.
   - Rendering:
     - renderBoard(): Loops through the 'tasks' array, filters them by status (todo, inprogress, done), and generates the HTML string for each card. It then injects this HTML into the columns.
     - renderStaticData(): Generates the HTML for the Product table and Github grid using static arrays.
   - Navigation:
     - switchView(viewId): Handles hiding all sections and revealing the one clicked. It also updates the active styling on the sidebar buttons.
   - Drag and Drop:
     - drag(): Saves the ID of the task being dragged and adds a visual class.
     - drop(): Gets the ID, finds the task in the array, updates its status to the new column, and re-renders the board.
   - Form Handling:
     - addTask(): Prevents the form from refreshing the page, creates a new task object with a unique ID (using Date.now()), pushes it to the array, and updates the screen.