export class AppSidebar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <aside
            class="w-64 border-r border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark hidden lg:flex flex-col h-full">
            <div class="p-6">
                <h1 class="text-2xl font-bold text-primary flex items-center gap-2">
                    <span class="material-icons-round">confirmation_number</span>
                    Tickets SISI
                </h1>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">Management
                    Console</p>
            </div>
            <nav class="flex-1 px-4 space-y-1">
                <a class="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg font-medium cursor-pointer" id="nav-dashboard">
                    <span class="material-icons-round">dashboard</span> Dashboard
                </a>
                <a class="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    id="nav-uploads" href="#">
                    <span class="material-icons-round">cloud_upload</span> Uploads
                </a>
                <a class="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    id="nav-config">
                    <span class="material-icons-round">settings</span> EC2 Config
                </a>
            </nav>
        </aside>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Navigation Logic
        const navDashboard = this.querySelector('#nav-dashboard');
        const navConfig = this.querySelector('#nav-config');
        const navUploads = this.querySelector('#nav-uploads');

        const setActive = (activeEl) => {
            // Reset all
            [navDashboard, navConfig, navUploads].forEach(el => {
                el?.classList.remove('bg-primary/10', 'text-primary');
                el?.classList.add('text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
            });
            // Set active
            activeEl.classList.remove('text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
            activeEl.classList.add('bg-primary/10', 'text-primary');
        };

        navDashboard?.addEventListener('click', () => {
            setActive(navDashboard);
            this.dispatchEvent(new CustomEvent('navigate', {
                bubbles: true,
                composed: true,
                detail: { view: 'dashboard-view' }
            }));
        });

        navConfig?.addEventListener('click', () => {
            setActive(navConfig);
            this.dispatchEvent(new CustomEvent('navigate', {
                bubbles: true,
                composed: true,
                detail: { view: 'settings-view' }
            }));
        });

        navUploads?.addEventListener('click', () => {
            setActive(navUploads);
            this.dispatchEvent(new CustomEvent('navigate', {
                bubbles: true,
                composed: true,
                detail: { view: 'uploads-view' }
            }));
        });

        // Dark Mode Logic
        const btn = this.querySelector('#toggle-dark-mode');
        btn?.addEventListener('click', async () => {
            console.log('Dark mode clicked');
            if (window.darkMode) {
                const isDarkMode = await window.darkMode.toggle();
                document.documentElement.classList.toggle('dark', isDarkMode);
            } else {
                console.warn('Dark mode API not available');
                document.documentElement.classList.toggle('dark');
            }
        });
    }
}

customElements.define('app-sidebar', AppSidebar);
