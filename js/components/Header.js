export class AppHeader extends HTMLElement {
    connectedCallback() {
        const host = localStorage.getItem('selectedSSHHost');
        this.innerHTML = `
        <header
            class="h-16 border-b border-slate-200 dark:border-slate-800 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md flex items-center justify-between px-8">
            <div class="flex items-center gap-4">
                <h2 class="text-lg font-semibold">Carga de Turnos</h2>
                <span
                    class="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-tight">EC2
                    Online</span>
            </div>
            <div class="flex items-center gap-3">
                <span id="host-chip" class="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-tight">${host}</span>
                <button
                    id="toggle-dark-mode"
                    class="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <span class="material-icons-round text-xl">dark_mode</span>
                </button>
                <button
                    class="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <span class="material-icons-round text-xl">notifications</span>
                </button>
                <div
                    class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                    JD
                </div>
            </div>
        </header>
        `;
        this.setupEventListeners();

        // Restore theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            // Assuming default is light, we need to toggle native theme if it's not already dark
            // Note: window.darkMode.toggle() toggles based on current nativeTheme state.
            // Ideally we should have a set method, but toggle works if we know start state.
            // However, syncing nativeTheme with localStorage might be tricky if they differ.
            // For now, let's just ensure the class is present for CSS.
            // We can also trigger the native toggle if we want consistency with system UI.
            // Let's assume the user starts fresh or consistent.

            // Actually, verify native state or force it.
            // Since we don't have a 'set' method, we'll just toggle if it doesn't match?
            // Or better, just relying on CSS class for the renderer is enough for the UI look.
            // But valid nativeTheme is good for context menus etc.
            // Let's just set the icon correctly first.
            const btn = this.querySelector('#toggle-dark-mode');
            if (btn) btn.innerHTML = '<span class="material-icons-round text-xl">light_mode</span>'; /* if dark, show sun */
        }
    }

    setupEventListeners() {
        const btn = this.querySelector('#toggle-dark-mode');
        btn?.addEventListener('click', async () => {
            if (window.darkMode) {
                const isDarkMode = await window.darkMode.toggle();
                document.documentElement.classList.toggle('dark', isDarkMode);
                localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
                btn.innerHTML = `<span class="material-icons-round text-xl">${isDarkMode ? 'light_mode' : 'dark_mode'}</span>`;
            }
        });
    }
}

customElements.define('app-header', AppHeader);
