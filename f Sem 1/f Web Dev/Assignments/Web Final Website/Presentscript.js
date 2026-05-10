let tasks = [], resources = [], currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('devflow_user')) {
        currentUser = JSON.parse(localStorage.getItem('devflow_user'));
        document.getElementById('auth-page').style.display = 'none';
        loadData();
    }
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('theme-icon').className = 'bi bi-sun me-3';
    }
    renderResources();
});

function toggleAuth(type) {
    const isLogin = type === 'login';
    document.getElementById('login-form').style.display = isLogin ? 'block' : 'none';
    document.getElementById('signup-form').style.display = isLogin ? 'none' : 'block';
    document.getElementById('login-tab').classList.toggle('active', isLogin);
    document.getElementById('signup-tab').classList.toggle('active', !isLogin);
}

function handleAuth(e, type) {
    e.preventDefault();
    const db = JSON.parse(localStorage.getItem('devflow_users') || '[]');
    
    if (type === 'login') {
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-pass').value;
        const user = db.find(u => u.email === email && u.pass === pass);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('devflow_user', JSON.stringify(user));
            completeLogin();
        } else {
            showToast('Invalid Email or Password', 'danger');
        }
    } else {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const pass = document.getElementById('signup-pass').value;
        
        if(db.some(u => u.email === email)) return showToast('User already exists', 'danger');
        
        const newUser = { name, email, pass };
        db.push(newUser);
        localStorage.setItem('devflow_users', JSON.stringify(db));
        currentUser = newUser;
        localStorage.setItem('devflow_user', JSON.stringify(newUser));
        completeLogin();
    }
}

function completeLogin() {
    document.getElementById('auth-page').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('auth-page').style.display = 'none';
        loadData();
    }, 300);
    showToast('Welcome to the Workspace', 'success');
}

function handleLogout() {
    localStorage.removeItem('devflow_user');
    location.reload();
}

function loadData() {
    tasks = JSON.parse(localStorage.getItem('devflow_tasks') || '[]');
    resources = JSON.parse(localStorage.getItem('devflow_resources') || JSON.stringify([
        { id: 'r1', name: 'Leather Raw Material', source: 'Kanpur, UP', status: 'In Stock' },
        { id: 'r2', name: 'Silk Fabrics', source: 'Mysore, Karnataka', status: 'Ordered' }
    ]));
    renderBoard();
    renderResources();
}

function generatePathways() {
    const idea = document.getElementById('ideaInput').value;
    if(!idea) return showToast("Enter a product idea first!", "danger");

    const timeframe = document.getElementById('timeframeInput').value;
    const paths = [
        {
            title: "THE RAPID PROTOTYPE",
            desc: `Ideal for a ${timeframe}-month timeline. Focuses on MVP.`,
            stack: "React + Firebase",
            tasks: ["Setup Repo", "Design Wireframes", "Auth (OTP)", "Integrate UPI", "Build MVP", "Deploy"]
        },
        {
            title: "THE SCALABLE FOUNDATION",
            desc: "Built for scaling across Karnataka.",
            stack: "MERN / AWS",
            tasks: ["DB Schema", "Docker & CI/CD", "Design System", "Backend APIs", "Payment Gateway", "Beta Launch"]
        }
    ];

    document.getElementById('pathway-cards').innerHTML = paths.map((p, i) => `
        <div class="col-md-6 mb-4">
            <div class="card h-100 pathway-card" onclick="selectPath(${i})">
                <div class="card-body text-center p-5">
                    <div class="icon-circle mb-4"><i class="bi bi-rocket-takeoff-fill"></i></div>
                    <h3 class="fw-bold mb-3">${p.title}</h3>
                    <p class="text-muted mb-4">${p.desc}</p>
                    <span class="badge bg-light text-dark border p-2">${p.stack}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    window.genPaths = paths;
    document.getElementById('pathways-result').style.display = 'block';
}

function selectPath(i) {
    if(!confirm("Overwrite current board?")) return;
    tasks = window.genPaths[i].tasks.map((t, idx) => ({ id: 't'+Date.now()+idx, title: t, status: 'todo', tag: 'Roadmap' }));
    localStorage.setItem('devflow_tasks', JSON.stringify(tasks));
    renderBoard();
    switchView('dashboard-view');
}

function renderBoard() {
    ['todo', 'inprogress', 'done'].forEach(s => {
        const filtered = tasks.filter(t => t.status === s);
        document.getElementById(`count-${s}`).innerText = filtered.length;
        document.getElementById(`list-${s}`).innerHTML = filtered.map(t => `
            <div class="task-card" draggable="true" data-id="${t.id}" ondragstart="drag(event)">
                <div class="d-flex justify-content-between"><strong>${t.title}</strong><i class="bi bi-trash text-danger" onclick="delItem('${t.id}', 'task')"></i></div>
                <small class="badge bg-light text-dark border mt-2">${t.tag}</small>
            </div>`).join('');
    });
}

function renderResources() {
    document.getElementById('inventory-table-body').innerHTML = resources.map(r => `
        <tr>
            <td class="fw-bold">${r.name}</td><td>${r.source}</td>
            <td><span class="badge bg-light text-dark border">${r.status}</span></td>
            <td class="text-end"><i class="bi bi-trash text-danger" onclick="delItem('${r.id}', 'res')"></i></td>
        </tr>`).join('');
}

function addTask(e) {
    e.preventDefault();
    tasks.push({
        id: 't'+Date.now(),
        title: document.getElementById('taskTitle').value,
        status: document.getElementById('taskStatus').value,
        tag: document.getElementById('taskTag').value
    });
    localStorage.setItem('devflow_tasks', JSON.stringify(tasks));
    renderBoard(); closeModal(); e.target.reset();
}

function addResource(e) {
    e.preventDefault();
    resources.push({
        id: 'r'+Date.now(),
        name: document.getElementById('resName').value,
        source: document.getElementById('resSource').value,
        status: document.getElementById('resStatus').value
    });
    localStorage.setItem('devflow_resources', JSON.stringify(resources));
    renderResources(); closeModal(); e.target.reset();
}

function delItem(id, type) {
    if(type === 'task') {
        tasks = tasks.filter(t => t.id !== id);
        localStorage.setItem('devflow_tasks', JSON.stringify(tasks));
        renderBoard();
    } else {
        resources = resources.filter(r => r.id !== id);
        localStorage.setItem('devflow_resources', JSON.stringify(resources));
        renderResources();
    }
}

function drag(ev) { ev.dataTransfer.setData("text", ev.target.getAttribute('data-id')); }
function allowDrop(ev) { ev.preventDefault(); }
function drop(ev) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text");
    const col = ev.target.closest('.column');
    if (!col) return;
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.status = col.id.replace('col-', '');
        localStorage.setItem('devflow_tasks', JSON.stringify(tasks));
        renderBoard();
    }
}

function switchView(id) {
    document.querySelectorAll('.view').forEach(e => e.classList.add('hidden-view'));
    document.querySelectorAll('.view').forEach(e => e.classList.remove('active-view'));
    document.getElementById(id).classList.remove('hidden-view');
    document.getElementById(id).classList.add('active-view');
}

function openModal(type) {
    document.getElementById("mainModal").style.display = "flex";
    document.getElementById("modalTitle").innerText = type === 'task' ? "NEW TASK" : "NEW RESOURCE";
    document.getElementById("taskForm").style.display = type === 'task' ? "block" : "none";
    document.getElementById("resourceForm").style.display = type === 'resource' ? "block" : "none";
}

function closeModal() { document.getElementById("mainModal").style.display = "none"; }

function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('theme-icon').className = isDark ? 'bi bi-moon me-3' : 'bi bi-sun me-3';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

function showToast(msg, type) {
    const div = document.createElement('div');
    div.className = `toast align-items-center text-white bg-${type} border-0 show position-fixed bottom-0 end-0 m-3`;
    div.innerHTML = `<div class="d-flex"><div class="toast-body">${msg}</div></div>`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}