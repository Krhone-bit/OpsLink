const { contextBridge, ipcRenderer } = require("electron");

// Información de versiones (opcional)
contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

// Dark mode
contextBridge.exposeInMainWorld("darkMode", {
  toggle: () => ipcRenderer.invoke("dark-mode:toggle"),
  system: () => ipcRenderer.invoke("dark-mode:system"),
});

// ⚠️ Unificar en UNA sola exposición electronAPI
contextBridge.exposeInMainWorld("electronAPI", {
  runProcess: (data) => ipcRenderer.invoke("run-process", data),
  backup: () => ipcRenderer.invoke("backup"),
  listBackups: () => ipcRenderer.invoke("list-backups"),
  onProcessLog: (cb) => {
    const listener = (_e, payload) => cb(payload);
    ipcRenderer.on("process-log", listener);
    // devolver función para desuscribir
    return () => ipcRenderer.removeListener("process-log", listener);
  },
});
