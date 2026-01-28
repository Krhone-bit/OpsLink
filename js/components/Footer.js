export class AppFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer
            class="h-10 border-t border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark flex items-center justify-between px-8 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            <div class="flex items-center gap-4">
                <span>© 2026 Tickets SISI</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500"></span> API:
                    Connected</span>
            </div>
            <div class="flex items-center gap-4">
                <a class="hover:text-primary" href="#">Docs</a>
                <a class="hover:text-primary" href="#">Support</a>
            </div>
        </footer>
        `;
    }
}

customElements.define('app-footer', AppFooter);
