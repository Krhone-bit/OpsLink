export class UploadsView extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="flex-1 flex flex-col min-h-0">
            <div
                class="px-8 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <span class="material-symbols-outlined text-green-600 dark:text-green-400">description</span>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h3 class="font-bold text-slate-900 dark:text-white">turnos_marzo_2026.xlsx</h3>
                            <span
                                class="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">Procesado</span>
                        </div>
                        <p class="text-xs text-slate-500">Auto-enfocado en Marzo 2026 según datos del archivo</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <button
                        class="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        Descartar
                    </button>
                    <button
                        class="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2">
                        <span class="material-icons-round text-lg">save</span>
                        Guardar Cambios
                    </button>
                </div>
            </div>
            <div class="flex-1 overflow-hidden flex flex-col xl:flex-row">
                <div class="flex-1 overflow-y-auto excel-grid bg-slate-50 dark:bg-slate-950 p-6 space-y-8">
                    <section>
                        <div class="flex items-end justify-between mb-4">
                            <div class="flex flex-col gap-1">
                                <h3
                                    class="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 uppercase tracking-wide">
                                    <span class="material-symbols-outlined text-xl text-primary">calendar_today</span>
                                    Vista Mensual de Turnos
                                </h3>
                                <div class="flex items-center gap-3 mt-1">
                                    <span
                                        class="text-xs font-semibold text-primary px-2 py-0.5 bg-primary/5 rounded border border-primary/20">Usuario:
                                        García, Alejandro</span>
                                </div>
                            </div>
                            <div
                                class="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider">
                                <div class="flex items-center gap-1.5 border-r border-slate-100 dark:border-slate-800 pr-3">
                                    <span class="material-symbols-outlined shift-icon text-slate-400">wb_sunny</span>
                                    <span class="text-slate-400">Día</span>
                                    <span class="material-symbols-outlined shift-icon text-slate-400 ml-1">dark_mode</span>
                                    <span class="text-slate-400">Noche</span>
                                </div>
                                <div class="flex items-center gap-1.5 ml-1">
                                    <span class="w-2 h-2 rounded-full bg-indigo-600"></span>
                                    <span class="text-slate-600 dark:text-slate-400">Existente</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                                    <span class="text-slate-600 dark:text-slate-400">Propuesto</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-red-500"></span>
                                    <span class="text-slate-600 dark:text-slate-400">Conflicto</span>
                                </div>
                            </div>
                        </div>
                        <div
                            class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                            <div
                                class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                                <div class="flex items-center gap-4">
                                    <div class="flex items-center gap-3">
                                        <h4 class="text-xl font-bold text-slate-900 dark:text-white">Marzo 2026</h4>
                                        <div
                                            class="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full border border-blue-100 dark:border-blue-800 autofocus-badge">
                                            <span
                                                class="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">auto_awesome</span>
                                            <span
                                                class="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-tighter">Mes
                                                detectado automáticamente</span>
                                        </div>
                                    </div>
                                    <div
                                        class="flex gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-1">
                                        <button class="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                                            title="Mes Anterior">
                                            <span
                                                class="material-icons-round text-base text-slate-400 hover:text-slate-600">chevron_left</span>
                                        </button>
                                        <button class="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                                            title="Mes Siguiente">
                                            <span
                                                class="material-icons-round text-base text-slate-400 hover:text-slate-600">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                                <button
                                    class="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase hover:text-primary transition-colors">Volver
                                    a Hoy</button>
                            </div>
                            <div
                                class="calendar-month-grid border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                <div
                                    class="p-2 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest border-r border-slate-200 dark:border-slate-800">
                                    Lun</div>
                                <div
                                    class="p-2 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest border-r border-slate-200 dark:border-slate-800">
                                    Mar</div>
                                <div
                                    class="p-2 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest border-r border-slate-200 dark:border-slate-800">
                                    Mié</div>
                                <div
                                    class="p-2 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest border-r border-slate-200 dark:border-slate-800">
                                    Jue</div>
                                <div
                                    class="p-2 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest border-r border-slate-200 dark:border-slate-800">
                                    Vie</div>
                                <div
                                    class="p-2 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest border-r border-slate-200 dark:border-slate-800">
                                    Sáb</div>
                                <div class="p-2 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                    Dom</div>
                            </div>
                            <div class="calendar-month-grid divide-x divide-y divide-slate-100 dark:divide-slate-800">
                                <div class="calendar-day-cell p-2 bg-slate-50/40 dark:bg-slate-900/40 opacity-40 flex flex-col">
                                    <span class="text-xs font-semibold text-slate-400">23 Feb</span>
                                </div>
                                <div class="calendar-day-cell p-2 bg-slate-50/40 dark:bg-slate-900/40 opacity-40 flex flex-col">
                                    <span class="text-xs font-semibold text-slate-400">24</span>
                                </div>
                                <div class="calendar-day-cell p-2 bg-slate-50/40 dark:bg-slate-900/40 opacity-40 flex flex-col">
                                    <span class="text-xs font-semibold text-slate-400">25</span>
                                </div>
                                <div class="calendar-day-cell p-2 bg-slate-50/40 dark:bg-slate-900/40 opacity-40 flex flex-col">
                                    <span class="text-xs font-semibold text-slate-400">26</span>
                                </div>
                                <div class="calendar-day-cell p-2 bg-slate-50/40 dark:bg-slate-900/40 opacity-40 flex flex-col">
                                    <span class="text-xs font-semibold text-slate-400">27</span>
                                </div>
                                <div class="calendar-day-cell p-2 bg-slate-50/40 dark:bg-slate-900/40 opacity-40 flex flex-col">
                                    <span class="text-xs font-semibold text-slate-400">28</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">1</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-existente"
                                            title="Existente - Día">wb_sunny</span>
                                    </div>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">2</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-existente"
                                            title="Existente - Noche">dark_mode</span>
                                        <span class="material-symbols-outlined shift-icon indicator-nuevo"
                                            title="Propuesto - Día">wb_sunny</span>
                                    </div>
                                </div>
                                <div
                                    class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col ring-2 ring-inset ring-red-500/30 bg-red-50/10">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">3</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-conflicto"
                                            title="Conflicto">dark_mode</span>
                                    </div>
                                    <span class="absolute top-2 right-2 material-icons-round text-red-500 text-xs">report</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">4</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">5</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-nuevo"
                                            title="Propuesto - Día">wb_sunny</span>
                                    </div>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">6</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-existente"
                                            title="Existente - Noche">dark_mode</span>
                                    </div>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">7</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">8</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-existente"
                                            title="Existente - Día">wb_sunny</span>
                                    </div>
                                </div>
                                <div
                                    class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col bg-primary/5 ring-1 ring-inset ring-primary/20">
                                    <span class="text-xs font-bold text-primary">9</span>
                                    <span class="text-[10px] text-primary/60 font-medium">Seleccionado</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-existente"
                                            title="Existente - Día">wb_sunny</span>
                                        <span class="material-symbols-outlined shift-icon indicator-conflicto"
                                            title="Conflicto - Día">wb_sunny</span>
                                    </div>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">10</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">11</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-nuevo"
                                            title="Propuesto - Noche">dark_mode</span>
                                    </div>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">12</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-existente"
                                            title="Existente - Noche">dark_mode</span>
                                    </div>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">13</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">14</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">15</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-existente"
                                            title="Existente - Noche">dark_mode</span>
                                    </div>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">16</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">17</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-existente"
                                            title="Existente - Día">wb_sunny</span>
                                    </div>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">18</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">19</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-existente"
                                            title="Existente - Noche">dark_mode</span>
                                    </div>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">20</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">21</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">22</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-existente"
                                            title="Existente - Día">wb_sunny</span>
                                    </div>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">23</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">24</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-existente"
                                            title="Existente - Noche">dark_mode</span>
                                    </div>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">25</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">26</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-existente"
                                            title="Existente - Día">wb_sunny</span>
                                    </div>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">27</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">28</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">29</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-existente"
                                            title="Existente - Noche">dark_mode</span>
                                    </div>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">30</span>
                                </div>
                                <div class="calendar-day-cell p-2 group cursor-pointer relative flex flex-col">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">31</span>
                                    <div class="mt-auto flex flex-wrap gap-1">
                                        <span class="material-symbols-outlined shift-icon indicator-existente"
                                            title="Existente - Día">wb_sunny</span>
                                    </div>
                                </div>
                                <div class="calendar-day-cell p-2 bg-slate-50/40 dark:bg-slate-900/40 opacity-40 flex flex-col">
                                    <span class="text-xs font-semibold text-slate-400">1 Abr</span>
                                </div>
                                <div class="calendar-day-cell p-2 bg-slate-50/40 dark:bg-slate-900/40 opacity-40 flex flex-col">
                                    <span class="text-xs font-semibold text-slate-400">2</span>
                                </div>
                                <div class="calendar-day-cell p-2 bg-slate-50/40 dark:bg-slate-900/40 opacity-40 flex flex-col">
                                    <span class="text-xs font-semibold text-slate-400">3</span>
                                </div>
                                <div class="calendar-day-cell p-2 bg-slate-50/40 dark:bg-slate-900/40 opacity-40 flex flex-col">
                                    <span class="text-xs font-semibold text-slate-400">4</span>
                                </div>
                                <div class="calendar-day-cell p-2 bg-slate-50/40 dark:bg-slate-900/40 opacity-40 flex flex-col">
                                    <span class="text-xs font-semibold text-slate-400">5</span>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div class="flex items-center justify-between mb-4">
                            <h3
                                class="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 uppercase tracking-wide">
                                <span class="material-symbols-outlined text-xl">list_alt</span>
                                Registros de Marzo 2026 con Observaciones
                            </h3>
                        </div>
                        <div
                            class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <table class="w-full border-collapse spreadsheet-table text-sm text-left">
                                <thead>
                                    <tr class="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                                        <th
                                            class="w-12 p-2 border-r border-b border-slate-200 dark:border-slate-700 text-center bg-slate-100 dark:bg-slate-800">
                                            #</th>
                                        <th
                                            class="px-4 py-2 border-r border-b border-slate-200 dark:border-slate-700 min-w-[100px]">
                                            ID</th>
                                        <th
                                            class="px-4 py-2 border-r border-b border-slate-200 dark:border-slate-700 min-w-[200px]">
                                            Nombre</th>
                                        <th
                                            class="px-4 py-2 border-r border-b border-slate-200 dark:border-slate-700 min-w-[120px]">
                                            Fecha</th>
                                        <th
                                            class="px-4 py-2 border-r border-b border-slate-200 dark:border-slate-700 min-w-[100px]">
                                            Estado</th>
                                        <th class="px-4 py-2 border-b border-slate-200 dark:border-slate-700 min-w-[150px]">
                                            Supervisor</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                    <tr
                                        class="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 bg-amber-50/20 dark:bg-amber-900/10">
                                        <td
                                            class="p-2 border-r border-slate-200 dark:border-slate-700 text-center bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-xs">
                                            9</td>
                                        <td
                                            class="px-4 py-2.5 border-r border-slate-100 dark:border-slate-800 font-mono text-xs flex items-center justify-between">
                                            TK-00922
                                            <div
                                                class="flex items-center gap-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                                <span class="material-icons-round text-xs">warning</span>
                                                COLISIÓN
                                            </div>
                                        </td>
                                        <td class="px-4 py-2.5 border-r border-slate-100 dark:border-slate-800 font-medium">
                                            García, Alejandro</td>
                                        <td class="px-4 py-2.5 border-r border-slate-100 dark:border-slate-800">
                                            09/03/2026</td>
                                        <td class="px-4 py-2.5 border-r border-slate-100 dark:border-slate-800">
                                            <span
                                                class="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded text-xs font-bold uppercase tracking-tighter">Duplicado</span>
                                        </td>
                                        <td class="px-4 py-2.5">Rodríguez, María</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
                <aside
                    class="w-full xl:w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 flex flex-col">
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Detalle del Día</h4>
                            <p class="text-lg font-bold text-slate-800 dark:text-slate-100">09 de Marzo, 2026</p>
                        </div>
                        <span
                            class="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold rounded">1
                            CONFLICTO</span>
                    </div>
                    <div class="space-y-4 flex-1">
                        <div class="detail-card border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-r-lg">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">Turno
                                    Existente</span>
                                <span class="text-[10px] font-medium text-slate-500 uppercase tracking-tight">DB
                                    Records</span>
                            </div>
                            <div class="flex items-center gap-2 mb-2">
                                <span
                                    class="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-lg">wb_sunny</span>
                                <p class="text-sm font-bold text-slate-700 dark:text-slate-200">Turno Día</p>
                            </div>
                            <p class="text-sm font-semibold">Guardia 24h (Lunes)</p>
                            <p class="text-xs text-slate-500 mt-1">Area: Infraestructura • Supervisor: M. Rodríguez</p>
                        </div>
                        <div class="detail-card border-red-500 bg-red-50/50 dark:bg-red-900/10 p-4 rounded-r-lg">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-bold text-red-700 dark:text-red-300 uppercase">Carga
                                    Excel</span>
                                <span
                                    class="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-900/40 px-1 rounded">
                                    <span class="material-icons-round text-[12px]">block</span> ERROR LÓGICO
                                </span>
                            </div>
                            <div class="flex items-center gap-2 mb-2">
                                <span class="material-symbols-outlined text-red-600 dark:text-red-400 text-lg">wb_sunny</span>
                                <p class="text-sm font-bold text-slate-700 dark:text-slate-200">Turno Día</p>
                            </div>
                            <p class="text-sm font-semibold">Turno Mañana (08:00 - 16:00)</p>
                            <p class="text-xs text-slate-500 mt-1 italic leading-relaxed">Conflicto insalvable: El
                                usuario ya posee una guardia de 24h asignada para esta fecha.</p>
                            <div class="mt-4 flex gap-2">
                                <button
                                    class="flex-1 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold hover:bg-slate-50 transition-colors">IGNORAR
                                    NUEVO</button>
                                <button
                                    class="flex-1 py-1.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700 transition-colors shadow-sm">REMPLAZAR
                                    TODO</button>
                            </div>
                        </div>
                        <div
                            class="detail-card border-amber-500 bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-r-lg opacity-60">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Propuesta
                                    Pendiente</span>
                            </div>
                            <div class="flex items-center gap-2 mb-2">
                                <span
                                    class="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg">dark_mode</span>
                                <p class="text-sm font-bold text-slate-700 dark:text-slate-200">Turno Noche</p>
                            </div>
                            <p class="text-sm font-semibold">Soporte Remoto (22:00 - 06:00)</p>
                        </div>
                    </div>
                    <div class="pt-6 border-t border-slate-200 dark:border-slate-800">
                        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Análisis de la Carga
                        </h4>
                        <div class="space-y-3">
                            <div
                                class="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                                <span class="material-icons-round text-blue-500 text-lg">auto_fix_high</span>
                                <div>
                                    <p class="text-xs font-bold text-blue-800 dark:text-blue-300">Auto-ajuste de
                                        Calendario</p>
                                    <p class="text-[10px] text-blue-700/70 dark:text-blue-400/70 mt-0.5">Se han
                                        detectado 31 filas para el periodo Marzo 2026.</p>
                                </div>
                            </div>
                            <div
                                class="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <span class="material-icons-round text-amber-500 text-lg">psychology</span>
                                <div>
                                    <p class="text-xs font-bold text-amber-800 dark:text-amber-300">Validación de Turnos
                                    </p>
                                    <p class="text-[10px] text-amber-700/70 dark:text-amber-400/70 mt-0.5">2 colisiones
                                        requieren intervención manual.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pt-4 space-y-2">
                        <button
                            class="w-full flex items-center justify-between p-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors">
                            Descargar Reporte del Mes
                            <span class="material-icons-round text-base">file_download</span>
                        </button>
                    </div>
                </aside>
            </div>
        </div>
        `;

        this.initLogic();
    }

    initLogic() {
        console.log('initLogic');
    }

}

customElements.define('uploads-view', UploadsView);
