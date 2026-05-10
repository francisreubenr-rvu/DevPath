let tasks = [
    { id: 't1', title: 'Design System', status: 'todo', tag: 'Design' },
    { id: 't2', title: 'API Integration', status: 'inprogress', tag: 'Dev' },
    { id: 't3', title: 'Client Feedback', status: 'done', tag: 'Urgent' }
];

document.addEventListener('DOMContentLoaded', () => { renderBoard(); renderStaticData(); });

function switchView(viewId) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active-view', 'hidden-view'));
    document.querySelectorAll('.view').forEach(el => el.classList.add('hidden-view'));
    const active = document.getElementById(viewId);
    active.classList.remove('hidden-view');
    active.classList.add('active-view');
    
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function renderBoard() {
    ['todo', 'inprogress', 'done'].forEach(status => {
        const filtered = tasks.filter(t => t.status === status);
        document.getElementById(`count-${status}`).innerText = filtered.length;
        
        const html = filtered.map(task => `
            <div class="task-card" draggable="true" id="${task.id}" 
                 ondragstart="drag(event)" ondragend="dragEnd(event)">
                <strong>${task.title}</strong>
                <small>${task.tag}</small>
            </div>
        `).join('');
        
        document.getElementById(`list-${status}`).innerHTML = html;
    });
}

function allowDrop(ev) { ev.preventDefault(); }
function drag(ev) { 
    ev.dataTransfer.setData("text", ev.target.id);
    ev.target.classList.add('dragging'); 
}
function dragEnd(ev) { ev.target.classList.remove('dragging'); }

function drop(ev) {
    ev.preventDefault();
    const taskId = ev.dataTransfer.getData("text");
    const column = ev.target.closest('.column');
    if (!column) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== column.id) {
        task.status = column.id;
        renderBoard();
    }
}

function openModal() { document.getElementById("taskModal").style.display = "flex"; }
function closeModal() { document.getElementById("taskModal").style.display = "none"; }

function addTask(e) {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    if(!title) return;

    tasks.push({
        id: 't' + Date.now(),
        title: title,
        status: 'todo',
        tag: document.getElementById('taskTag').value
    });
    
    renderBoard();
    closeModal();
    document.getElementById('taskForm').reset();
}

function renderStaticData() {
    const products = [
        { name: 'Leather Satchel', sku: 'L-01', origin: 'Italy' },
        { name: 'Canvas Tote', sku: 'C-09', origin: 'India' }
    ];
    document.getElementById('product-table-body').innerHTML = products.map(p => 
        `<tr><td>${p.name}</td><td>${p.sku}</td><td>${p.origin}</td></tr>`
    ).join('');

    const repos = [
        { name: 'Base-Kit', lang: 'HTML/CSS' },
        { name: 'Server-Node', lang: 'JavaScript' }
    ];
    document.getElementById('repo-grid').innerHTML = repos.map(r => 
        `<div class="repo-card"><h3>${r.name}</h3><p>${r.lang}</p></div>`
    ).join('');
}