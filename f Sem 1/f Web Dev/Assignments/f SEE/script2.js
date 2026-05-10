// ============================================
        // DATA STRUCTURES - Mock Data
        // ============================================
        
        // Initial project data (will be loaded from localStorage if available)
        let projects = [
            {
                id: 1,
                name: "Mobile App Redesign",
                description: "Complete overhaul of the mobile application UI/UX with focus on user engagement and accessibility.",
                status: "active",
                tasks: 12,
                team: 5,
                created: "2024-12-01"
            },
            {
                id: 2,
                name: "API Documentation",
                description: "Create comprehensive documentation for REST API endpoints and integration guides.",
                status: "review",
                tasks: 8,
                team: 3,
                created: "2024-12-05"
            },
            {
                id: 3,
                name: "Dashboard Analytics",
                description: "Build real-time analytics dashboard for tracking user behavior and system metrics.",
                status: "planning",
                tasks: 15,
                team: 4,
                created: "2024-12-10"
            }
        ];

        // Product variations mock data
        const productVariations = [
            {
                id: 1,
                name: "Wireless Mouse Pro",
                sku: "WMP-001",
                category: "electronics",
                variations: 3,
                source: "Supplier A",
                status: "Active",
                details: {
                    colors: ["Black", "White", "Gray"],
                    price: "$29.99",
                    stock: 450,
                    lastUpdated: "2024-12-10"
                }
            },
            {
                id: 2,
                name: "Ergonomic Office Chair",
                sku: "EOC-202",
                category: "furniture",
                variations: 5,
                source: "Manufacturer B",
                status: "Active",
                details: {
                    colors: ["Black", "Gray", "Navy", "Burgundy", "Olive"],
                    price: "$299.99",
                    stock: 87,
                    lastUpdated: "2024-12-12"
                }
            },
            {
                id: 3,
                name: "Cotton T-Shirt Basic",
                sku: "CTB-150",
                category: "clothing",
                variations: 12,
                source: "Textile Factory C",
                status: "Low Stock",
                details: {
                    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
                    colors: ["White", "Black"],
                    price: "$19.99",
                    stock: 23,
                    lastUpdated: "2024-12-14"
                }
            },
            {
                id: 4,
                name: "USB-C Hub 7-Port",
                sku: "UCH-789",
                category: "electronics",
                variations: 2,
                source: "Tech Distributor D",
                status: "Active",
                details: {
                    colors: ["Space Gray", "Silver"],
                    price: "$49.99",
                    stock: 310,
                    lastUpdated: "2024-12-13"
                }
            },
            {
                id: 5,
                name: "Standing Desk Adjustable",
                sku: "SDA-404",
                category: "furniture",
                variations: 4,
                source: "Manufacturer B",
                status: "Pre-Order",
                details: {
                    sizes: ["Small (48\")", "Medium (60\")", "Large (72\")"],
                    colors: ["Walnut", "White Oak"],
                    price: "$599.99",
                    stock: 0,
                    lastUpdated: "2024-12-11"
                }
            }
        ];

        // GitHub templates mock data
        const githubTemplates = [
            {
                id: 1,
                name: "React SPA Starter",
                description: "Full-featured React single-page application with routing, state management, and API integration examples.",
                icon: "⚛️",
                stars: 1243,
                language: "JavaScript"
            },
            {
                id: 2,
                name: "REST API Boilerplate",
                description: "Node.js Express API with authentication, database models, and comprehensive testing setup.",
                icon: "🚀",
                stars: 856,
                language: "Node.js"
            },
            {
                id: 3,
                name: "Dashboard Template",
                description: "Admin dashboard template with charts, tables, and responsive layout components.",
                icon: "📊",
                stars: 2104,
                language: "HTML/CSS"
            },
            {
                id: 4,
                name: "E-commerce Backend",
                description: "Complete e-commerce backend with payment processing, inventory management, and order tracking.",
                icon: "🛒",
                stars: 621,
                language: "Python"
            },
            {
                id: 5,
                name: "Mobile App Template",
                description: "React Native template with navigation, authentication, and common mobile patterns implemented.",
                icon: "📱",
                stars: 934,
                language: "React Native"
            },
            {
                id: 6,
                name: "Microservices Starter",
                description: "Microservices architecture template with Docker, API gateway, and service discovery.",
                icon: "🔧",
                stars: 445,
                language: "Go"
            }
        ];

        // ============================================
        // INITIALIZATION - Load Data and Setup
        // ============================================
        
        document.addEventListener('DOMContentLoaded', function() {
            // Load projects from localStorage if available
            loadProjectsFromStorage();
            
            // Render initial data
            renderProjects();
            renderVariations();
            renderTemplates();
            
            // Setup event listeners
            setupEventListeners();
        });

        // Load projects from localStorage
        function loadProjectsFromStorage() {
            const storedProjects = localStorage.getItem('projectManagerProjects');
            if (storedProjects) {
                projects = JSON.parse(storedProjects);
            }
        }

        // Save projects to localStorage
        function saveProjectsToStorage() {
            localStorage.setItem('projectManagerProjects', JSON.stringify(projects));
        }

        // ============================================
        // RENDER FUNCTIONS - Display Data
        // ============================================
        
        // Render project cards in the dashboard
        function renderProjects() {
            const grid = document.getElementById('projectsGrid');
            
            if (projects.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📋</div>
                        <p>No projects yet. Create your first project to get started!</p>
                    </div>
                `;
                return;
            }
            
            grid.innerHTML = projects.map(project => `
                <div class="project-card" draggable="true" data-id="${project.id}">
                    <div class="project-card-header">
                        <div>
                            <h3 class="project-title">${project.name}</h3>
                        </div>
                        <span class="project-status status-${project.status}">${project.status}</span>
                    </div>
                    <p class="project-description">${project.description}</p>
                    <div class="project-meta">
                        <div class="meta-item">
                            <span>✓</span>
                            <span>${project.tasks} tasks</span>
                        </div>
                        <div class="meta-item">
                            <span>👥</span>
                            <span>${project.team} members</span>
                        </div>
                        <div class="meta-item">
                            <span>📅</span>
                            <span>${project.created}</span>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Setup drag and drop for project cards
            setupDragAndDrop();
        }

        // Render product variations table
        function renderVariations(filterText = '', filterCategory = '') {
            const tbody = document.getElementById('variationsTableBody');
            
            // Filter variations based on search and category
            let filtered = productVariations;
            
            if (filterText) {
                filtered = filtered.filter(v => 
                    v.name.toLowerCase().includes(filterText.toLowerCase()) ||
                    v.sku.toLowerCase().includes(filterText.toLowerCase()) ||
                    v.category.toLowerCase().includes(filterText.toLowerCase())
                );
            }
            
            if (filterCategory) {
                filtered = filtered.filter(v => v.category === filterCategory);
            }
            
            tbody.innerHTML = filtered.map((variation, index) => `
                <tr>
                    <td>
                        <button class="expand-btn" onclick="toggleVariationDetails(${index})">+</button>
                    </td>
                    <td><strong>${variation.name}</strong></td>
                    <td><span class="badge">${variation.sku}</span></td>
                    <td>${variation.category}</td>
                    <td>${variation.variations} options</td>
                    <td>${variation.source}</td>
                    <td>${variation.status}</td>
                </tr>
                <tr>
                    <td colspan="7" style="padding: 0;">
                        <div class="variation-details" id="details-${index}">
                            <div class="detail-row">
                                <div class="detail-label">Colors/Sizes:</div>
                                <div>${variation.details.colors?.join(', ') || variation.details.sizes?.join(', ') || 'N/A'}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Price:</div>
                                <div>${variation.details.price}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Stock Level:</div>
                                <div>${variation.details.stock} units</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Last Updated:</div>
                                <div>${variation.details.lastUpdated}</div>
                            </div>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        // Toggle variation details visibility
        function toggleVariationDetails(index) {
            const details = document.getElementById(`details-${index}`);
            details.classList.toggle('expanded');
            
            // Update button text
            const btn = event.target;
            btn.textContent = details.classList.contains('expanded') ? '−' : '+';
        }

        // Render GitHub template cards
        function renderTemplates() {
            const grid = document.getElementById('templatesGrid');
            
            grid.innerHTML = githubTemplates.map(template => `
                <div class="template-card">
                    <div class="template-icon">${template.icon}</div>
                    <h3 class="template-name">${template.name}</h3>
                    <p class="template-description">${template.description}</p>
                    <div class="template-meta">
                        <span>⭐ ${template.stars}</span>
                        <span>${template.language}</span>
                    </div>
                </div>
            `).join('');
        }

        // ============================================
        // EVENT LISTENERS - User Interactions
        // ============================================
        
        function setupEventListeners() {
            // Tab switching
            document.querySelectorAll('.tab-item').forEach(tab => {
                tab.addEventListener('click', function() {
                    switchTab(this.dataset.tab);
                });
            });
            
            // Sidebar navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', function() {
                    if (this.dataset.view) {
                        // Update active state
                        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Switch to corresponding tab
                        switchTab(this.dataset.view);
                    }
                });
            });
            
            // Modal controls
            document.getElementById('createProjectBtn').addEventListener('click', openModal);
            document.getElementById('closeModalBtn').addEventListener('click', closeModal);
            document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
            document.getElementById('submitProjectBtn').addEventListener('click', createProject);
            
            // Close modal when clicking outside
            document.getElementById('projectModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal();
                }
            });
            
            // Filter variations
            document.getElementById('variationFilter').addEventListener('input', function() {
                const category = document.getElementById('categoryFilter').value;
                renderVariations(this.value, category);
            });
            
            document.getElementById('categoryFilter').addEventListener('change', function() {
                const text = document.getElementById('variationFilter').value;
                renderVariations(text, this.value);
            });
        }

        // ============================================
        // TAB SWITCHING - Navigation Between Views
        // ============================================
        
        function switchTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab-item').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            const selectedContent = document.getElementById(`${tabName}-tab`);
            if (selectedContent) {
                selectedContent.classList.add('active');
            }
            
            // Activate corresponding tab
            const selectedTab = document.querySelector(`.tab-item[data-tab="${tabName}"]`);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
        }

        // ============================================
        // MODAL FUNCTIONS - Project Creation
        // ============================================
        
        function openModal() {
            document.getElementById('projectModal').classList.add('active');
            // Reset form
            document.getElementById('projectForm').reset();
            // Hide all errors
            document.querySelectorAll('.form-error').forEach(error => {
                error.classList.remove('visible');
            });
        }

        function closeModal() {
            document.getElementById('projectModal').classList.remove('active');
        }

        // Form validation
        function validateForm() {
            let isValid = true;
            
            // Validate project name
            const name = document.getElementById('projectName').value.trim();
            const nameError = document.getElementById('nameError');
            if (!name) {
                nameError.classList.add('visible');
                isValid = false;
            } else {
                nameError.classList.remove('visible');
            }
            
            // Validate status
            const status = document.getElementById('projectStatus').value;
            const statusError = document.getElementById('statusError');
            if (!status) {
                statusError.classList.add('visible');
                isValid = false;
            } else {
                statusError.classList.remove('visible');
            }
            
            return isValid;
        }

        // Create new project
        function createProject() {
            if (!validateForm()) {
                return;
            }
            
            // Get form values
            const name = document.getElementById('projectName').value.trim();
            const description = document.getElementById('projectDescription').value.trim() || 'No description provided.';
            const status = document.getElementById('projectStatus').value;
            const tasks = parseInt(document.getElementById('projectTasks').value) || 0;
            
            // Create new project object
            const newProject = {
                id: Date.now(), // Simple ID generation
                name: name,
                description: description,
                status: status,
                tasks: tasks,
                team: Math.floor(Math.random() * 5) + 2, // Random team size for demo
                created: new Date().toISOString().split('T')[0]
            };
            
            // Add to projects array
            projects.unshift(newProject); // Add to beginning of array
            
            // Save to localStorage
            saveProjectsToStorage();
            
            // Re-render projects
            renderProjects();
            
            // Close modal
            closeModal();
        }

        // ============================================
        // DRAG AND DROP - Project Card Reordering
        // ============================================
        
        let draggedElement = null;

        function setupDragAndDrop() {
            const cards = document.querySelectorAll('.project-card');
            
            cards.forEach(card => {
                card.addEventListener('dragstart', handleDragStart);
                card.addEventListener('dragend', handleDragEnd);
                card.addEventListener('dragover', handleDragOver);
                card.addEventListener('drop', handleDrop);
            });
        }

        function handleDragStart(e) {
            draggedElement = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
        }

        function handleDragEnd(e) {
            this.classList.remove('dragging');
        }

        function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'move';
            return false;
        }

        function handleDrop(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            
            if (draggedElement !== this) {
                // Get the IDs
                const draggedId = parseInt(draggedElement.dataset.id);
                const targetId = parseInt(this.dataset.id);
                
                // Find indices in projects array
                const draggedIndex = projects.findIndex(p => p.id === draggedId);
                const targetIndex = projects.findIndex(p => p.id === targetId);
                
                // Swap positions
                const temp = projects[draggedIndex];
                projects[draggedIndex] = projects[targetIndex];
                projects[targetIndex] = temp;
                
                // Save and re-render
                saveProjectsToStorage();
                renderProjects();
            }
            
            return false;
        } 