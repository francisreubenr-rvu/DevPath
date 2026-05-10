/* DevFlow Project Manager Logic
    -----------------------------
    Handles: View switching, Drag & Drop API, Mock Data Generation, LocalStorage
*/

// --- State Management ---
// We check if data exists in LocalStorage, otherwise we load defaults
let appData = JSON.parse(localStorage.getItem('devflowData')) || {
    tasks: [
        { id: 't1', title: 'Design System Draft', status: 'todo', tag: 'Design' },
        { id: 't2', title: 'API Integration', status: 'inprogress', tag: 'Feature' },
        { id: 't3', title: 'Fix Login Bug', status: 'done', tag: 'Bug' }
    ]
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderBoard();
    renderProducts();
    renderGitHubTemplates();
});

// --- Navigation Logic ---
function switchView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(el => el.classList.add('hidden-view'));
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active-view'));
    
    // Show selected view
    const target = document.getElementById(viewId);
    target.classList.remove('hidden-view');
    target.classList.add('active-view');

    // Update Sidebar Active State
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    // Note: In a real app, you'd select the li based on the click event target
    event.target.classList.add('active');
}

// --- Kanban Board Logic (Drag & Drop) ---

function renderBoard() {
    // Clear current lists
    ['todo', 'inprogress', 'done'].forEach(status => {
        document.getElementById(`list-${status}`).innerHTML = '';
        document.getElementById(`count-${status}`).innerText = 0;
    });

    // Populate tasks
    appData.tasks.forEach(task => {
        const card = createCardElement(task);
        const container = document.getElementById(`list-${task.status}`);
        container.appendChild(card);
        
        // Update count
        const countSpan = document.getElementById(`count-${task.status}`);
        countSpan.innerText = parseInt(countSpan.innerText) + 1;
    });
}

function createCardElement(task) {
    const div = document.createElement('div');
    div.className = 'task-card';
    div.draggable = true;
    div.id = task.id;
    
    // HTML5 Drag API Events
    div.addEventListener('dragstart', drag);

    div.innerHTML = `
        <strong>${task.title}</strong>
        <div class="task-meta">
            <span>${task.tag}</span>
            <span>#${task.id}</span>
        </div>
    `;
    return div;
}

// Allow dropping into columns
function allowDrop(ev) {
    ev.preventDefault(); // Necessary to allow dropping
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const taskId = ev.dataTransfer.getData("text");
    // Find the closest column (in case dropped on a header or another card)
    const column = ev.target.closest('.column');
    const newStatus = column.id; // 'todo', 'inprogress', or 'done'

    // Update Data Model
    const taskIndex = appData.tasks.findIndex(t => t.id === taskId);
    if (taskIndex > -1) {
        appData.tasks[taskIndex].status = newStatus;
        saveData();
        renderBoard(); // Re-render to reflect changes
    }
}

// --- Modal & Form Logic ---
const modal = document.getElementById("taskModal");

function openModal() {
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

function addTask(e) {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const tag = document.getElementById('taskTag').value;

    const newTask = {
        id: 't' + Date.now(), // Simple unique ID
        title: title,
        status: 'todo', // Default to To Do
        tag: tag
    };

    appData.tasks.push(newTask);
    saveData();
    renderBoard();
    closeModal();
    document.getElementById('taskForm').reset();
}

// --- Product Variations Logic (Mock Data) ---
const products = [
    { name: 'ErgoChair Pro', sku: 'EC-001', origin: 'Vietnam Factory A', status: 'Active' },
    { name: 'ErgoChair Lite', sku: 'EC-002', origin: 'Vietnam Factory B', status: 'Draft' },
    { name: 'DeskMat Leather', sku: 'DM-L01', origin: 'India Hub', status: 'Active' },
    { name: 'DeskMat Felt', sku: 'DM-F01', origin: 'India Hub', status: 'Out of Stock' },
];

function renderProducts() {
    const tbody = document.getElementById('product-table-body');
    tbody.innerHTML = products.map(p => `
        <tr>
            <td><strong>${p.name}</strong></td>
            <td><code>${p.sku}</code></td>
            <td>${p.origin}</td>
            <td><span class="badge">${p.status}</span></td>
            <td><button style="border:none; background:none; cursor:pointer;">...</button></td>
        </tr>
    `).join('');
}

function filterProducts() {
    const input = document.getElementById('product-search').value.toLowerCase();
    const rows = document.getElementById('product-table-body').getElementsByTagName('tr');

    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(input) ? "" : "none";
    }
}

// --- GitHub Connector Logic (UI Only) ---
const repos = [
    { name: 'react-starter-kit', lang: 'JavaScript', color: '#f1e05a', stars: 120 },
    { name: 'python-flask-api', lang: 'Python', color: '#3572A5', stars: 85 },
    { name: 'static-site-hugo', lang: 'Go', color: '#00ADD8', stars: 240 },
    { name: 'node-express-mongo', lang: 'JavaScript', color: '#f1e05a', stars: 55 },
];

function renderGitHubTemplates() {
    const grid = document.getElementById('repo-grid');
    grid.innerHTML = repos.map(repo => `
        <div class="repo-card">
            <h3>${repo.name}</h3>
            <div class="repo-lang">
                <span class="circle" style="background:${repo.color}"></span>
                ${repo.lang}
            </div>
            <div style="margin-top:10px; font-size:0.8rem; color:#666;">
                ★ ${repo.stars} stars
            </div>
        </div>
    `).join('');
}

// --- Utility ---
function saveData() {
    localStorage.setItem('devflowData', JSON.stringify(appData));
}

// Close modal if clicking outside content
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}