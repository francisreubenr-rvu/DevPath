let tasks = [
    { id: 't1', title: 'Design System', status: 'todo', tag: 'Design' },
    { id: 't2', title: 'API Integration', status: 'inprogress', tag: 'Feature' },
    { id: 't3', title: 'Fix Login Bug', status: 'done', tag: 'Bug' }
];

document.addEventListener('DOMContentLoaded', () => {
    renderBoard();
    renderProducts();
    renderRepos();
});

function switchView(viewId) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active-view', 'hidden-view'));
    document.querySelectorAll('.view').forEach(el => el.classList.add('hidden-view'));
    document.getElementById(viewId).classList.remove('hidden-view');
    document.getElementById(viewId).classList.add('active-view');
}

function renderBoard() {
    ['todo', 'inprogress', 'done'].forEach(status => {
        const list = document.getElementById(`list-${status}`);
        list.innerHTML = '';
        const filtered = tasks.filter(t => t.status === status);
        document.getElementById(`count-${status}`).innerText = filtered.length;
        
        filtered.forEach(task => {
            list.innerHTML += `
                <div class="task-card" draggable="true" id="${task.id}" ondragstart="drag(event)">
                    <strong>${task.title}</strong>
                    <div class="task-meta"><span>${task.tag}</span></div>
                </div>`;
        });
    });
}

function allowDrop(ev) { ev.preventDefault(); }
function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }

function drop(ev) {
    ev.preventDefault();
    const taskId = ev.dataTransfer.getData("text");
    const newStatus = ev.target.closest('.column').id;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = newStatus;
        renderBoard();
    }
}

function openModal() { document.getElementById("taskModal").style.display = "flex"; }
function closeModal() { document.getElementById("taskModal").style.display = "none"; }

function addTask(e) {
    e.preventDefault();
    tasks.push({
        id: 't' + Math.random(),
        title: document.getElementById('taskTitle').value,
        status: 'todo',
        tag: document.getElementById('taskTag').value
    });
    renderBoard();
    closeModal();
    document.getElementById('taskForm').reset();
}

function renderProducts() {
    const products = [
        { name: 'Chair Pro', sku: 'C-01', origin: 'Vietnam' },
        { name: 'Desk Mat', sku: 'D-02', origin: 'India' }
    ];
    document.getElementById('product-table-body').innerHTML = products.map(p => 
        `<tr><td>${p.name}</td><td>${p.sku}</td><td>${p.origin}</td></tr>`
    ).join('');
}

function renderRepos() {
    const repos = [
        { name: 'react-kit', lang: 'JS' },
        { name: 'flask-api', lang: 'Python' }
    ];
    document.getElementById('repo-grid').innerHTML = repos.map(r => 
        `<div class="repo-card"><h3>${r.name}</h3><p>${r.lang}</p></div>`
    ).join('');
}