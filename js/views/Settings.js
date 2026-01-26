import { showToast } from '../utils.js';

export class SettingsView extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="max-w-5xl mx-auto px-8 py-10">
            <header class="mb-10">
                <div class="flex items-center gap-2 text-primary font-semibold text-sm mb-2">
                    <span class="material-symbols-outlined text-sm">terminal</span>
                    <span>SSH Configuration</span>
                </div>
                <h2 class="text-4xl font-black text-[#121317] dark:text-white tracking-tight">SSH Config Integration
                </h2>
                <p class="mt-2 text-[#657086] dark:text-gray-400 text-lg">Manage EC2 connections using your local
                    <code class="bg-gray-200 dark:bg-gray-800 px-1 rounded text-primary">~/.ssh/config</code> file.
                </p>
            </header>
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                <section
                    class="md:col-span-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h3 class="text-lg font-bold flex items-center gap-2 uppercase tracking-wider text-xs text-gray-500">
                            <span class="material-symbols-outlined text-primary">list_alt</span>
                            Configured Hosts
                        </h3>
                        <div class="flex gap-2">
                            <button
                                class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-[#657086] dark:text-gray-300 transition-all">
                                <span class="material-symbols-outlined text-sm">refresh</span>
                                Recargar Configuración SSH
                            </button>
                            <button
                                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-xs font-bold text-primary transition-all">
                                <span class="material-symbols-outlined text-sm">open_in_new</span>
                                Abrir archivo .ssh/config
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="max-w-xl">
                            <label class="block mb-6">
                                <span class="text-[#121317] dark:text-gray-200 text-sm font-semibold mb-2 block">Seleccionar
                                    Host del SSH Config</span>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span class="material-symbols-outlined text-gray-400 text-xl">dns</span>
                                    </div>
                                    <select id="host-select"
                                        class="block w-full pl-11 h-14 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                                    </select>
                                </div>
                            </label>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <div class="space-y-1">
                                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Hostname
                                    (IP/Domain)</span>
                                <div class="flex items-center gap-2 text-[#121317] dark:text-white font-medium">
                                    <span class="material-symbols-outlined text-gray-400 text-lg">public</span>
                                    <span id="host-name"></span>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">User</span>
                                <div class="flex items-center gap-2 text-[#121317] dark:text-white font-medium">
                                    <span class="material-symbols-outlined text-gray-400 text-lg">person</span>
                                    <span id="user"></span>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Identity
                                    File</span>
                                <div class="flex items-center gap-2 text-[#121317] dark:text-white font-medium break-all">
                                    <span class="material-symbols-outlined text-gray-400 text-lg">key</span>
                                    <span id="identity-file"></span>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10 flex gap-3 max-w-2xl">
                            <span class="material-symbols-outlined text-primary">info</span>
                            <p class="text-sm text-primary leading-relaxed">The connection details are automatically
                                pulled from your SSH config. If you need to update them, please edit the
                                <code>.ssh/config</code> file directly.
                            </p>
                        </div>
                    </div>
                </section>
                <section
                    class="md:col-span-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                        <h3 class="text-lg font-bold flex items-center gap-2 uppercase tracking-wider text-xs text-gray-500">
                            <span class="material-symbols-outlined text-primary">folder_shared</span>
                            Remote Environment
                        </h3>
                    </div>
                    <div class="p-6">
                        <label class="block max-w-xl">
                            <span class="text-[#121317] dark:text-gray-200 text-sm font-semibold mb-2 block">Remote Project
                                Root Path</span>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span class="material-symbols-outlined text-gray-400 text-xl">folder</span>
                                </div>
                                <input
                                    class="block w-full pl-11 h-14 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    type="text" value="/var/www/app" id="root-path"/>
                            </div>
                        </label>
                        <label class="block max-w-xl mt-4">
                            <span class="text-[#121317] dark:text-gray-200 text-sm font-semibold mb-2 block">Virtual
                                Environment Path</span>
                            <div class="relative"> 
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span class="material-symbols-outlined text-gray-400 text-xl">folder</span>
                                </div>
                                <input
                                    class="block w-full pl-11 h-14 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    type="text" value="./.venv/bin/activate" id="environment-path"/>
                            </div>
                        </label>
                        <label class="block max-w-xl mt-4">
                            <span class="text-[#121317] dark:text-gray-200 text-sm font-semibold mb-2 block">Python
                                App Settings Module</span>
                            <div class="relative"> 
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span class="material-symbols-outlined text-gray-400 text-xl">folder</span>
                                </div>
                                <input
                                    class="block w-full pl-11 h-14 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    type="text" value="opslink.settings" id="settings-module"/>
                            </div>
                        </label>
                    </div>
                </section>
            </div>
            <div class="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div
                        class="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full border border-success/20">
                        <span class="material-symbols-outlined text-[18px]">check_circle</span>
                        <span class="text-sm font-bold">Connected Successfully</span>
                    </div>
                    <p class="text-xs text-[#657086] dark:text-gray-400 font-medium italic" id="last-connection">Last sync: Just now</p>
                </div>
                <div class="flex gap-4">
                    <button
                        class="px-6 py-3 rounded-lg text-sm font-bold text-[#657086] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        Discard Changes
                    </button>
                    <button
                        class="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                        <span class="material-symbols-outlined text-[20px]">bolt</span>
                        Test Connection
                    </button>
                </div>
            </div>
        </div>
        `;

        this.initLogic();
    }

    timeDifference(current, previous) {

        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;

        const diffTime = "Last sync: ";
        if (elapsed === 0) {
            return diffTime + "Just now";
        }
        else if (elapsed < msPerMinute) {
            return diffTime + Math.round(elapsed / 1000) + ' seconds ago';
        }

        else if (elapsed < msPerHour) {
            return diffTime + Math.round(elapsed / msPerMinute) + ' minutes ago';
        }

        else if (elapsed < msPerDay) {
            return diffTime + Math.round(elapsed / msPerHour) + ' hours ago';
        }

        else if (elapsed < msPerMonth) {
            return diffTime + 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
        }

        else if (elapsed < msPerYear) {
            return diffTime + 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
        }

        else {
            return diffTime + 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
        }
    }


    async initLogic() {
        try {
            const result = await window.electronAPI.readSshConfig();
            if (result.status === "ok") {
                const sshConfig = result.content;
                const sshConfigLines = sshConfig.split("\n");
                let currentHost = null;
                const hosts = new Map();
                for (const line of sshConfigLines) {
                    const sshConfigParsedLine = line.split(" ");
                    if (sshConfigParsedLine.length === 1) continue;
                    if (sshConfigParsedLine[0] === "Host") {
                        currentHost = sshConfigParsedLine[1];
                        hosts.set(currentHost, []);
                    }
                    else {
                        if (sshConfigParsedLine[2] === "ProxyCommand") {
                            hosts.get(currentHost).push({
                                key: sshConfigParsedLine[2],
                                value: sshConfigParsedLine.slice(3).join(" ")
                            });
                        }
                        else {
                            hosts.get(currentHost).push({
                                key: sshConfigParsedLine[2],
                                value: sshConfigParsedLine[3]
                            });
                        }
                    }
                }
                // binding hosts to select
                const select = document.querySelector("#host-select");
                hosts.keys().forEach((host) => {
                    const option = document.createElement("option");
                    option.value = host;
                    option.textContent = host;
                    select.appendChild(option);
                });
                select.addEventListener("change", (e) => {
                    const host = e.target.value;
                    const hostConfig = hosts.get(host);

                    // Save preference
                    localStorage.setItem('selectedSSHHost', host);

                    document.querySelector("#host-name").textContent = hostConfig.find(item => item.key === "HostName")?.value || 'N/A';
                    document.querySelector("#identity-file").textContent = hostConfig.find(item => item.key === "IdentityFile")?.value || 'N/A';
                    document.querySelector("#user").textContent = hostConfig.find(item => item.key === "User")?.value || 'N/A';
                    document.querySelector("#host-chip").textContent = host;
                });

                // Test Connection Button Logic
                const testBtn = this.querySelector('button.bg-primary'); // Using the class to select since ID is missing
                testBtn.addEventListener('click', async () => {
                    const host = select.value;
                    if (!host) {
                        showToast("Please select a host first", "error");
                        return;
                    }

                    // Visual feedback
                    const originalText = testBtn.innerHTML;
                    testBtn.disabled = true;
                    testBtn.innerHTML = `<span class="material-symbols-outlined animate-spin">refresh</span> Testing...`;

                    try {
                        const result = await window.electronAPI.testSshConnection(host);
                        if (result.status === 'ok') {
                            showToast("Connection Successful!", "success");
                            // Update UI indicator
                            const indicator = this.querySelector('.bg-success\\/10');
                            if (indicator) {
                                indicator.querySelector('span:nth-child(2)').textContent = "Connected Successfully";
                                indicator.classList.remove('hidden');
                                // guardar la fecha y hora de la conexion en localStorage
                                const now = new Date();
                                localStorage.setItem('lastConnection', now);
                                const diff = this.timeDifference(new Date(), now);
                                document.querySelector('#last-connection').textContent = diff;
                            }
                        } else {
                            showToast(`Connection Failed: ${result.message}`, "error");
                            // Update UI indicator (optional, maybe turn red)
                        }
                    } catch (error) {
                        showToast("An unexpected error occurred", "error");
                        console.error(error);
                    } finally {
                        testBtn.disabled = false;
                        testBtn.innerHTML = originalText;
                    }
                });

                // Restore preference
                const savedHost = localStorage.getItem('selectedSSHHost');
                if (savedHost && hosts.has(savedHost)) {
                    select.value = savedHost;
                    // Trigger update manually
                    const hostConfig = hosts.get(savedHost);
                    document.querySelector("#host-name").textContent = hostConfig.find(item => item.key === "HostName")?.value || 'N/A';
                    document.querySelector("#identity-file").textContent = hostConfig.find(item => item.key === "IdentityFile")?.value || 'N/A';
                    document.querySelector("#user").textContent = hostConfig.find(item => item.key === "User")?.value || 'N/A';
                } else if (hosts.size > 0) {
                    const firstHost = hosts.keys().next().value;
                    select.value = firstHost;
                    const hostConfig = hosts.get(firstHost);
                    document.querySelector("#host-name").textContent = hostConfig.find(item => item.key === "HostName")?.value || 'N/A';
                    document.querySelector("#identity-file").textContent = hostConfig.find(item => item.key === "IdentityFile")?.value || 'N/A';
                    document.querySelector("#user").textContent = hostConfig.find(item => item.key === "User")?.value || 'N/A';
                }
            } else {
                console.error("Error reading SSH config:", result.message);
                showToast(result.message, "error");
            }
            // logica cuando setea el root-path
            const rootPathInput = this.querySelector('#root-path');
            rootPathInput.addEventListener('input', () => {
                localStorage.setItem('rootPath', rootPathInput.value);
            });
            // logica cuando setea el environment-path
            const environmentPathInput = this.querySelector('#environment-path');
            environmentPathInput.addEventListener('input', () => {
                localStorage.setItem('environmentPath', environmentPathInput.value);
            });
            // logica cuando setea el settings-module
            const settingsModuleInput = this.querySelector('#settings-module');
            settingsModuleInput.addEventListener('input', () => {
                localStorage.setItem('settingsModule', settingsModuleInput.value);
            });
            // restaurar valores
            rootPathInput.value = localStorage.getItem('rootPath') || '/var/www/app';
            environmentPathInput.value = localStorage.getItem('environmentPath') || './.venv/bin/activate';
            settingsModuleInput.value = localStorage.getItem('settingsModule') || 'opslink.settings';
            // restaurar la fecha y hora de la conexion
            const lastConnection = localStorage.getItem('lastConnection');
            if (lastConnection) {
                const lastDate = new Date(lastConnection);
                const now = new Date();
                const diff = this.timeDifference(now, lastDate);
                document.querySelector('#last-connection').textContent = diff;
            }
        } catch (error) {
            console.error("Failed to read SSH config:", error);
        }
    }
}

customElements.define('settings-view', SettingsView);
