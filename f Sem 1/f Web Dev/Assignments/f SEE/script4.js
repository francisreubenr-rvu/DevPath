/**
 * DevManager - Core Logic
 * Handles navigation, state management, and basic local storage interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. STATE MANAGEMENT ---
    
    // Mock Data for "Dev Pathways"
    const pathwaysData = [
        {
            title: "MVP First (Lean Startup)",
            desc: "Focus on shipping the smallest version of the product with core value to test market assumptions.",
            time: "2-4 Weeks",
            bestFor: "Solo founders, Unproven markets"
        },
        {
            title: "Agile / Scrum Iterations",
            desc: "Broken down into 2-week sprints. Continuous feedback loop. High flexibility for changes.",
            time: "Ongoing",
            bestFor: "Medium teams, Complex features"
        },
        {
            title: "Waterfall (Specification First)",
            desc: "Complete design and documentation before coding begins. Linear progression.",
            time: "3-6 Months",
            bestFor: "Regulated industries, Outsourced dev"
        }
    ];

    // Mock Data for "Product Variations"
    const variationsData = [
        { id: "CFG-001", name: "SaaS Pro - Dashboard", origin: "Template Library", status: "Active", stack: "React/Node" },
        { id: "CFG-002", name: "SaaS Lite - Mobile", origin: "Client Request", status: "Draft", stack: "React Native" },
        { id: "CFG-003", name: "Enterprise On-Prem", origin: "Legacy Code", status: "Review", stack: "Java/Spring" },
        { id: "CFG-004", name: "API Gateway Only", origin: "Architecture Team", status: "Active", stack: "GoLang" },
    ];

    // Mock Data for "GitHub"
    const githubRepos = [
        { name: "react-starter-kit", stars: 120, lang: "JavaScript", updated: "2h ago" },
        { name: "nextjs-ecommerce", stars: 85, lang: "TypeScript", updated: "1d ago" },
        { name: "python-flask-api", stars: 45, lang: "Python", updated: "5d ago" }
    ];

    // --- 2. VIEW NAVIGATION LOGIC ---

    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            // Hide all sections
            sections.forEach(section => section.classList.add('hidden'));
            
            // Show target section
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // --- 3. DASHBOARD / KANBAN LOGIC ---

    // Load tasks from LocalStorage or use default empty arrays
    let tasks = JSON.parse(localStorage.getItem('devManagerTasks')) || [
        { id: 1, title: "Initialize Repo", tag: "Feature", status: "done" },
        { id: 2, title: "Design DB Schema", tag: "Research", status: "todo" }
    ];

    function renderTasks() {
        // Clear columns
        document.getElementById('todo-tasks').innerHTML = '';
        document.getElementById('progress-tasks').innerHTML = '';
        document.getElementById('done-tasks').innerHTML = '';

        // Reset counters
        const counts = { todo: 0, progress: 0, done: 0 };

        tasks.forEach(task => {
            const card = document.createElement('div');
            card.className = 'task-card';
            card.draggable = true;
            card.setAttribute('data-id', task.id);
            // Drag Start Event
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData("text/plain", task.id);
            });

            card.innerHTML = `
                <div class="task-title">${task.title}</div>
                <span class="task-tag">${task.tag}</span>
            `;

            // Append to correct column based on status property
            if(task.status === 'todo') {
                document.getElementById('todo-tasks').appendChild(card);
                counts.todo++;
            } else if (task.status === 'progress') {
                document.getElementById('progress-tasks').appendChild(card);
                counts.progress++;
            } else if (task.status === 'done') {
                document.getElementById('done-tasks').appendChild(card);
                counts.done++;
            }
        });

        // Update counters in UI
        document.querySelector('#col-todo .count').textContent = counts.todo;
        document.querySelector('#col-progress .count').textContent = counts.progress;
        document.querySelector('#col-done .count').textContent = counts.done;
    }

    // Modal Logic for Adding Tasks
    const modal = document.getElementById('task-modal');
    const addBtn = document.getElementById('add-task-btn');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.getElementById('new-task-form');

    addBtn.onclick = () => modal.classList.remove('hidden');
    closeBtn.onclick = () => modal.classList.add('hidden');
    
    // Close modal if clicking outside content
    window.onclick = (event) => {
        if (event.target == modal) modal.classList.add('hidden');
    }

    form.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const tag = document.getElementById('task-tag').value;

        const newTask = {
            id: Date.now(), // Simple unique ID
            title: title,
            tag: tag,
            status: "todo" // Default to To Do
        };

        tasks.push(newTask);
        saveAndRender();
        
        form.reset();
        modal.classList.add('hidden');
    };

    function saveAndRender() {
        localStorage.setItem('devManagerTasks', JSON.stringify(tasks));
        renderTasks();
    }

    // --- 4. DRAG AND DROP HANDLERS (Global) ---
    
    window.allowDrop = (ev) => {
        ev.preventDefault(); // Necessary to allow dropping
    };

    window.drop = (ev) => {
        ev.preventDefault();
        const taskId = ev.dataTransfer.getData("text/plain");
        
        // Find which column we dropped into (bubble up to find ID)
        const column = ev.target.closest('.kanban-column');
        
        if (column && taskId) {
            let newStatus = '';
            if (column.id === 'col-todo') newStatus = 'todo';
            if (column.id === 'col-progress') newStatus = 'progress';
            if (column.id === 'col-done') newStatus = 'done';

            // Update local data state
            const taskIndex = tasks.findIndex(t => t.id == taskId);
            if(taskIndex > -1) {
                tasks[taskIndex].status = newStatus;
                saveAndRender();
            }
        }
    };

    // --- 5. INITIALIZATION RENDERS ---

    // Render Pathways Cards
    const pathwaysContainer = document.getElementById('pathways-container');
    pathwaysData.forEach(p => {
        const card = document.createElement('div');
        card.className = 'pathway-card';
        card.innerHTML = `
            <h3>${p.title}</h3>
            <p><strong>Timeline:</strong> ${p.time}</p>
            <p>${p.desc}</p>
            <br>
            <p><small>Best for: ${p.bestFor}</small></p>
        `;
        pathwaysContainer.appendChild(card);
    });

    // Render Product Variations Table
    const tableBody = document.querySelector('#variations-table tbody');
    variationsData.forEach(v => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><code>${v.id}</code></td>
            <td>${v.name}</td>
            <td>${v.origin}</td>
            <td>${v.status}</td>
            <td>${v.stack}</td>
        `;
        tableBody.appendChild(row);
    });

    // Render Mock GitHub Repos
    const repoList = document.getElementById('repo-list');
    githubRepos.forEach(repo => {
        const item = document.createElement('div');
        // Reusing pathway-card style for simplicity, but could be distinct
        item.className = 'pathway-card'; 
        item.style.marginBottom = '10px';
        item.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <strong>${repo.name}</strong>
                <span>⭐ ${repo.stars}</span>
            </div>
            <p style="margin-top:5px; font-size:0.85rem; color:#666;">
                ${repo.lang} • Updated ${repo.updated}
            </p>
        `;
        repoList.appendChild(item);
    });

    // Initial Render
    renderTasks();
});