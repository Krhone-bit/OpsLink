import { showToast } from '../utils.js';

export class DashboardView extends HTMLElement {
    constructor() {
        super();
        this.selectedFileName = null;
        this.unsubscribeLogs = null;
    }

    connectedCallback() {
        this.innerHTML = `
        <div class="flex-1 overflow-y-auto p-8 space-y-8 h-full">
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div class="xl:col-span-2 space-y-6">
                    <div
                        class="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3
                            class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">
                            Subir Archivo Excel</h3>
                        <div id="dropzone"
                            class="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all hover:border-primary group bg-slate-50 dark:bg-slate-900/50 cursor-pointer">
                            <span
                                class="material-icons-round text-5xl text-slate-400 group-hover:text-primary transition-colors mb-4">upload_file</span>
                            <p id="fileName" class="text-slate-600 dark:text-slate-300 mb-1">Arrastra tu archivo <span
                                    class="font-bold">.xlsx</span> aquí</p>
                            <p class="text-sm text-slate-400 dark:text-slate-500">o haz clic para seleccionar desde tu
                                equipo</p>
                            <input type="file" id="fileInput" class="hidden" accept=".xlsx" />
                        </div>
                        <div class="mt-6 flex flex-wrap items-center justify-between gap-4">
                            <div class="flex items-center gap-4">
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input id="tipoTurno" checked="" class="sr-only peer" type="checkbox" value="" />
                                    <div
                                        class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500">
                                    </div>
                                    <span
                                        class="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide switch-label">Operativo</span>
                                </label>
                            </div>
                            <div class="flex gap-3">
                                <button
                                    id="runProcess"
                                    class="px-6 py-2.5 bg-primary hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2">
                                    <span class="material-icons-round text-lg">play_arrow</span>
                                    Cargar Turno
                                </button>
                                <button
                                    id="clearCache"
                                    class="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[20px]">delete_sweep</span>
                                    Limpiar Caché
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- Excel Preview Section -->
                    <div id="excelPreview" class="hidden bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Vista Previa del Excel
                            </h3>
                            <span class="text-xs text-slate-400" id="previewRowInfo"></span>
                        </div>
                        <div class="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                            <div class="overflow-x-auto max-h-[300px]">
                                <table class="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                    <thead class="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400 sticky top-0 md:text-xs">
                                        <tr id="previewHeader"></tr>
                                    </thead>
                                    <tbody id="previewBody" class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                        <div class="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
                                <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
                                <span
                                    class="ml-2 text-xs font-mono text-slate-500 uppercase tracking-widest">ec2-instance-logs</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <button class="text-slate-500 hover:text-red-500" id="clearLogs">
                                    <span class="material-icons-round text-sm">delete_sweep</span>
                                </button>
                                <button class="text-slate-500 hover:text-slate-300" id="copyLogs">
                                    <span class="material-icons-round text-sm">content_copy</span>
                                </button>
                            </div>
                        </div>
                        <div id="terminal" class="p-6 h-[400px] overflow-y-auto font-mono text-sm leading-relaxed terminal-scroll">
                            <!-- Logs injected here -->
                        </div>
                    </div>
                </div>
                <div class="space-y-6">
                    <div
                        class="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between mb-6">
                            <h3
                                class="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Backups Disponibles</h3>
                            <span class="material-icons-round text-slate-400">storage</span>
                        </div>
                        <div id="backupChips" class="space-y-3 mb-6">
                            <!-- Backups injected here -->
                        </div>
                        <button
                            id="backup"
                            class="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary text-primary font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                            <i class="material-icons-round text-lg">backup</i>
                            Generar Backup
                        </button>
                    </div>
                    <div
                        class="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3
                            class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">
                            Estado del Sistema</h3>
                        <div class="space-y-4">
                            <div>
                                <div class="flex justify-between text-xs mb-1">
                                    <span class="text-slate-500">Espacio en Disco</span>
                                    <span id="disk-usage-text" class="font-bold text-slate-700 dark:text-slate-300">--%</span>
                                </div>
                                <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div id="disk-usage-bar" class="bg-primary h-full" style="width: 0%"></div>
                                </div>
                            </div>
                            <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div class="flex justify-between text-sm py-2">
                                    <span class="text-slate-500">Uptime</span>
                                    <span class="font-medium">12d 04h 22m</span>
                                </div>
                                <div class="flex justify-between text-sm py-2">
                                    <span class="text-slate-500">Último Proceso</span>
                                    <span class="font-medium text-green-500">Exitoso</span>
                                </div>
                                <div class="flex justify-between text-sm py-2">
                                    <span class="text-slate-500">Versión App</span>
                                    <span class="font-mono text-xs">v2.4.1-stable</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        this.initLogic();
    }

    disconnectedCallback() {
        if (this.unsubscribeLogs) this.unsubscribeLogs();
    }

    initLogic() {
        // Dropzone & File Input
        const dz = this.querySelector("#dropzone");
        const input = this.querySelector("#fileInput");
        const fileNameEl = this.querySelector("#fileName");

        const setFile = (file) => {
            if (!file) return;
            this.selectedFileName = file.name;
            if (fileNameEl) fileNameEl.textContent = `Archivo: ${file.name}`;
            if (dz) dz.classList.add("border-primary");
        };

        // Drag events
        ["dragenter", "dragover"].forEach((evt) =>
            dz?.addEventListener(evt, (e) => {
                e.preventDefault();
                dz.classList.add("border-primary", "bg-slate-100", "dark:bg-slate-800");
            })
        );
        ["dragleave", "drop"].forEach((evt) =>
            dz?.addEventListener(evt, (e) => {
                e.preventDefault();
                dz.classList.remove("border-primary", "bg-slate-100", "dark:bg-slate-800");
            })
        );
        dz?.addEventListener("drop", (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            setFile(file);
        });
        dz?.addEventListener("click", () => input?.click());
        input?.addEventListener("change", async (e) => {
            const file = e.target.files?.[0];
            const host = localStorage.getItem('selectedSSHHost');
            if (file) {
                setFile(file);
                try {
                    // Pass the file object, preload will handle path extraction
                    const result = await window.electronAPI.openAndReadExcel(file, host);
                    if (result.status === 'ok') {
                        this.renderPreview(result.data);
                    } else {
                        console.error(result.message);
                        showToast(result.message || "Error al leer el archivo Excel", "error");
                    }
                } catch (error) {
                    console.error(error);
                    showToast("Error inesperado al leer el Excel", "error");
                }
            }
        });

        // Checkbox Label
        const chk = this.querySelector("#tipoTurno");
        const lbl = this.querySelector(".switch-label");
        if (chk && lbl) {
            chk.addEventListener("change", () => {
                lbl.textContent = chk.checked ? "Operativo" : "No Operativo";
            });
        }

        // Run Process Button
        const submitBtn = this.querySelector("#runProcess");
        submitBtn?.addEventListener("click", async () => await this.handleProcess(submitBtn));

        // Backup & Clear Cache
        this.querySelector("#backup")?.addEventListener("click", (e) => this.handleBackup(e.currentTarget));
        this.querySelector("#clearCache")?.addEventListener("click", (e) => this.handleClearCache(e.currentTarget));

        // Copy Logs
        this.querySelector("#copyLogs")?.addEventListener("click", () => {
            const terminal = this.querySelector("#terminal");
            if (terminal) {
                const text = terminal.innerText; // Use innerText to preserve newlines
                navigator.clipboard.writeText(text).then(() => {
                    showToast("Logs copiados al portapapeles", "success");
                }).catch(err => {
                    console.error("Failed to copy logs:", err);
                    showToast("Error al copiar logs", "error");
                });
            }
        });

        // Clear Logs
        this.querySelector("#clearLogs")?.addEventListener("click", () => {
            const terminal = this.querySelector("#terminal");
            if (terminal) terminal.innerHTML = "";
        });

        // Initial Load
        this.loadBackups();
        this.setupLogs();
        this.updateSystemStatus();
    }

    async updateSystemStatus() {
        const host = localStorage.getItem('selectedSSHHost');
        const diskUsageText = this.querySelector('#disk-usage-text');
        const diskUsageBar = this.querySelector('#disk-usage-bar');

        if (!host) {
            if (diskUsageText) diskUsageText.textContent = "N/A";
            return;
        }

        try {
            const result = await window.electronAPI.getDiskUsage(host);
            if (result.status === 'ok') {
                const usage = result.usage; // e.g., "45%"
                if (diskUsageText) diskUsageText.textContent = usage;
                if (diskUsageBar) diskUsageBar.style.width = usage;
            } else {
                console.warn("Failed to get disk usage:", result.message);
                if (diskUsageText) diskUsageText.textContent = "Error";
            }
        } catch (error) {
            console.error(error);
        }
    }

    async handleProcess(btn) {
        if (!this.selectedFileName) {
            showToast("Por favor selecciona un archivo .xlsx", "error");
            return;
        }

        btn.disabled = true;
        const originalText = btn.innerHTML;
        btn.textContent = "Procesando...";
        this.querySelector("#terminal").innerHTML = "";

        const tipoOperativo = this.querySelector("#tipoTurno")?.checked ?? true;

        // Retrieve settings from localStorage
        const host = localStorage.getItem('selectedSSHHost');
        const rootPath = localStorage.getItem('rootPath');
        const environmentPath = localStorage.getItem('environmentPath');
        const settingsModule = localStorage.getItem('settingsModule');

        if (!host || !rootPath || !environmentPath || !settingsModule) {
            showToast("Missing SSH or Project Settings", "error");
            btn.disabled = false;
            btn.innerHTML = originalText;
            return;
        }

        try {
            const resp = await window.electronAPI.runProcess({
                fileName: this.selectedFileName,
                operativo: tipoOperativo,
                host,
                rootPath,
                environmentPath,
                settingsModule
            });

            if (resp?.status === "error") {
                showToast(resp.message, "error");
            } else {
                showToast("Proceso completado con éxito", "success");
            }
        } catch (err) {
            showToast(err?.message || "Error desconocido", "error");
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    async handleBackup(btn) {
        btn.disabled = true;
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span class="material-symbols-outlined animate-spin">refresh</span> Generando...`;

        const host = localStorage.getItem('selectedSSHHost');
        const rootPath = localStorage.getItem('rootPath');
        const environmentPath = localStorage.getItem('environmentPath');
        const settingsModule = localStorage.getItem('settingsModule');
        if (!host || !rootPath || !environmentPath || !settingsModule) {
            showToast("Missing SSH or Project Settings", "error");
            btn.disabled = false;
            btn.innerHTML = originalText;
            return;
        }

        try {
            const resp = await window.electronAPI.backup(host, rootPath, environmentPath, settingsModule);
            if (resp?.status === "error") {
                showToast(resp.message, "error");
            } else {
                showToast("Backup realizado ✅", "success");
                this.loadBackups();
            }
        } catch (err) {
            showToast(err?.message, "error");
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    async handleClearCache(btn) {
        btn.disabled = true;
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span class="material-symbols-outlined animate-spin">refresh</span> Limpiando...`;

        const host = localStorage.getItem('selectedSSHHost');
        const rootPath = localStorage.getItem('rootPath');
        const environmentPath = localStorage.getItem('environmentPath');
        const settingsModule = localStorage.getItem('settingsModule');
        if (!host || !rootPath || !environmentPath || !settingsModule) {
            showToast("No SSH host or root path or environment path or settings module selected", "error");
            btn.disabled = false;
            btn.innerHTML = originalText;
            return;
        }

        try {
            const resp = await window.electronAPI.clearCache(host, rootPath, environmentPath, settingsModule);
            if (resp?.status === "error") showToast(resp.message, "error");
            else showToast("Caché limpiada", "success");
        } catch (err) {
            showToast(err?.message, "error");
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }


    async loadBackups() {
        const chipsEl = this.querySelector("#backupChips");
        if (!chipsEl) return;

        chipsEl.innerHTML = '<div class="text-slate-500 italic p-2 text-sm">Cargando...</div>';
        try {
            const host = localStorage.getItem('selectedSSHHost');
            if (!host) {
                chipsEl.innerHTML = '<div class="text-sm text-slate-400 p-2">Sin backups</div>';
                return;
            }
            const resp = await window.electronAPI.listBackups(host);
            chipsEl.innerHTML = "";
            if (resp.status !== "ok" || !resp.files.length) {
                chipsEl.innerHTML = '<div class="text-sm text-slate-400 p-2">Sin backups</div>';
                return;
            }

            resp.files.forEach(name => {
                const div = document.createElement("div");
                div.className = "group flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800";

                div.innerHTML = `
                    <div class="flex items-center gap-3">
                        <span class="material-icons-round text-blue-500 text-sm">description</span>
                        <span class="text-sm font-medium text-slate-700 dark:text-slate-300">${name}</span>
                    </div>
                `;

                const actionsDiv = document.createElement("div");
                actionsDiv.className = "flex items-center gap-2";

                // Delete button
                const delBtn = document.createElement("button");
                delBtn.className = "p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity";
                delBtn.innerHTML = '<span class="material-icons-round text-base">close</span>';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.showDeleteModal(name, host);
                };

                // Download button
                const downloadBtn = document.createElement("button");
                downloadBtn.className = "p-1 text-slate-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity";
                downloadBtn.innerHTML = '<span class="material-icons-round text-base">download</span>';
                downloadBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.downloadBackup(name, host);
                };

                actionsDiv.appendChild(delBtn);
                actionsDiv.appendChild(downloadBtn);
                div.appendChild(actionsDiv);
                chipsEl.appendChild(div);
            });
        } catch (e) {
            chipsEl.innerHTML = '<div class="text-red-500 text-sm p-2">Error al listar</div>';
        }
    }

    showDeleteModal(fileName, host) {
        // Create modal container
        const modalContainer = document.createElement("div");
        modalContainer.className = "fixed inset-0 z-50 flex items-center justify-center bg-gray-400/50 backdrop-blur-[2px] p-4";
        modalContainer.innerHTML = `
            <div class="relative w-full max-w-[480px] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                <div class="p-8 flex flex-col items-center text-center">
                    <div class="mb-5">
                        <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                            <span class="material-symbols-outlined text-red-500 text-4xl">delete_forever</span>
                        </div>
                    </div>
                    <h2 class="text-slate-800 tracking-tight text-2xl font-bold mb-3">
                        ¿Estás seguro de que deseas eliminar el backup?
                    </h2>
                    <div class="w-full bg-gray-50 border border-gray-200 rounded-lg py-4 px-6 mb-6">
                        <div class="flex items-center justify-center gap-2">
                            <span class="material-symbols-outlined text-gray-400 text-xl">description</span>
                            <span class="text-slate-700 text-lg font-mono font-semibold break-all">${fileName}</span>
                        </div>
                    </div>
                    <p class="text-gray-500 text-sm font-normal leading-relaxed mb-8 max-w-sm">
                        Esta acción es irreversible y eliminará permanentemente el archivo seleccionado de la instancia remota.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-3 w-full">
                        <button id="cancelDelete"
                            class="flex-1 h-11 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 font-semibold text-sm transition-all hover:bg-gray-200 active:scale-[0.98] focus:outline-none">
                            Cancelar
                        </button>
                        <button id="confirmDelete"
                            class="flex-1 h-11 flex items-center justify-center rounded-lg bg-red-500 text-white font-bold text-sm tracking-wide transition-all hover:brightness-110 shadow-lg shadow-red-500/20 active:scale-[0.98] focus:outline-none">
                            Eliminar
                        </button>
                    </div>
                </div>
                <div class="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center">
                    <span class="text-[10px] text-gray-400 uppercase font-mono tracking-widest">Action: Delete</span>
                    <div class="flex items-center gap-1.5">
                        <div class="w-2 h-2 rounded-full bg-green-500/40 animate-pulse"></div>
                        <span class="text-[10px] text-gray-400 uppercase font-mono tracking-widest">Host: ${host}</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalContainer);

        // Event listeners
        const cancelBtn = modalContainer.querySelector("#cancelDelete");
        const confirmBtn = modalContainer.querySelector("#confirmDelete");

        const closeModal = () => {
            modalContainer.remove();
        };

        cancelBtn.addEventListener("click", closeModal);

        confirmBtn.addEventListener("click", async () => {
            // Visual feedback on button
            confirmBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-sm mr-2">refresh</span> Eliminando...`;
            confirmBtn.disabled = true;

            try {
                const res = await window.electronAPI.deleteBackup(fileName, host);
                if (res.status === 'ok') {
                    showToast("Backup eliminado", "success");
                    this.loadBackups();
                } else {
                    showToast(res.message, "error");
                }
            } catch (error) {
                showToast(error.message, "error");
            } finally {
                closeModal();
            }
        });

        // Close on click outside
        modalContainer.addEventListener("click", (e) => {
            if (e.target === modalContainer) closeModal();
        });
    }

    async downloadBackup(fileName, host) {
        try {
            showToast("Descargando backup...", "info");
            const res = await window.electronAPI.downloadBackup(fileName, host);
            if (res.status === 'ok') {
                showToast(`Descarga completada: ${fileName}`, "success");
            } else {
                showToast(res.message || "Error en la descarga", "error");
            }
        } catch (e) {
            console.error(e);
            showToast("Error al intentar descargar", "error");
        }
    }

    setupLogs() {
        const termEl = this.querySelector("#terminal");
        if (this.unsubscribeLogs) this.unsubscribeLogs();

        this.unsubscribeLogs = window.electronAPI.onProcessLog(({ type, data }) => {
            if (!termEl) return;

            // Handle carriage returns for progress bars (rsync/scp)
            // We split by newline to handle separate lines
            const lines = String(data).split("\n");

            lines.forEach((line, index) => {
                // If it's the last item and empty (due to trailing newline), skip unless it's the only item
                if (index === lines.length - 1 && !line && lines.length > 1) return;

                // Handle \r within the line (take the last segment)
                const segments = line.split('\r');
                const cleanLine = segments[segments.length - 1];

                if (!cleanLine.trim()) return;

                let colorClass = "text-slate-300"; // Default color

                // Coloring based on content
                const lowerLine = cleanLine.toLowerCase();

                let displayText = cleanLine;
                if (type === "cmd") {
                    colorClass = "text-green-400 font-bold";
                    displayText = `$ ${cleanLine}`;
                } else if (lowerLine.includes("error") || lowerLine.includes("exception") || lowerLine.includes("fail") || lowerLine.includes("fatal")) {
                    colorClass = "text-red-400";
                } else if (lowerLine.includes("warn") || lowerLine.includes("warning")) {
                    colorClass = "text-yellow-400";
                } else if (lowerLine.includes("info") || lowerLine.includes("debug")) {
                    colorClass = "text-blue-400";
                } else if (type === "stderr") {
                    colorClass = "text-yellow-200/80";
                }

                // Check if we should update the last line (for progress percentages)
                const isProgress = /\d+%/.test(cleanLine);
                const lastChild = termEl.lastElementChild;
                const lastText = lastChild?.textContent || "";

                // If the last line was a progress line and this one is too, replace it
                // Or if the current chunk has multiple \r segments, it implies update
                if (isProgress && lastChild && /\d+%/.test(lastText) && type !== "cmd") {
                    lastChild.textContent = displayText;
                    lastChild.className = `flex gap-2 ${colorClass} mb-1 whitespace-pre-wrap break-all`;
                } else {
                    const div = document.createElement("div");
                    div.className = `flex gap-2 ${colorClass} mb-1 whitespace-pre-wrap break-all`;
                    div.textContent = displayText;
                    termEl.appendChild(div);
                }
            });

            termEl.scrollTop = termEl.scrollHeight;
        });
    }

    renderPreview(data) {
        const previewEl = this.querySelector("#excelPreview");
        const headerEl = this.querySelector("#previewHeader");
        const bodyEl = this.querySelector("#previewBody");
        const infoEl = this.querySelector("#previewRowInfo");

        if (!data || !Array.isArray(data) || data.length === 0) {
            if (previewEl) previewEl.classList.add("hidden");
            return;
        }

        if (previewEl) previewEl.classList.remove("hidden");
        if (infoEl) infoEl.textContent = `${data.length} filas encontradas`;

        // Clear previous
        if (headerEl) headerEl.innerHTML = "";
        if (bodyEl) bodyEl.innerHTML = "";

        // Get headers from first row
        const headers = Object.keys(data[0]);

        // Render Headers
        headers.forEach(header => {
            const th = document.createElement("th");
            th.className = "px-6 py-3 whitespace-nowrap font-bold tracking-wider";
            th.textContent = header;
            headerEl?.appendChild(th);
        });

        // Render first 10 rows
        const rowsToShow = data.slice(0, 10);
        rowsToShow.forEach(row => {
            const tr = document.createElement("tr");
            tr.className = "hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors";

            headers.forEach(header => {
                const td = document.createElement("td");
                td.className = "px-6 py-4 whitespace-nowrap font-mono text-xs";
                td.textContent = row[header] ?? "";
                tr.appendChild(td);
            });
            bodyEl?.appendChild(tr);
        });

        if (data.length > 10) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = headers.length;
            td.className = "px-6 py-2 text-center text-xs text-slate-400 italic bg-slate-50/50 dark:bg-slate-800/50";
            td.textContent = `... y ${data.length - 10} filas más ...`;
            tr.appendChild(td);
            bodyEl?.appendChild(tr);
        }
    }
}

customElements.define('dashboard-view', DashboardView);
