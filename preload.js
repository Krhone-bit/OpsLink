const { contextBridge, ipcRenderer, webUtils } = require("electron");

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
  backup: (host, rootPath, environmentPath, settingsModule) => ipcRenderer.invoke("backup", host, rootPath, environmentPath, settingsModule),
  listBackups: (host) => ipcRenderer.invoke("list-backups", host),
  deleteBackup: (fileName, host) => ipcRenderer.invoke("delete-backup", fileName, host),
  downloadBackup: (fileName, host) => ipcRenderer.invoke("download-backup", fileName, host),
  clearCache: (host, rootPath, environmentPath, settingsModule) => ipcRenderer.invoke("clear-cache", host, rootPath, environmentPath, settingsModule),
  readSshConfig: () => ipcRenderer.invoke("ssh-config:read"),
  testSshConnection: (host) => ipcRenderer.invoke("ssh:test", host),
  getDiskUsage: (host) => ipcRenderer.invoke("ssh:disk-usage", host),
  openAndReadExcel: (file, host) => ipcRenderer.invoke("excel:open-and-read", webUtils.getPathForFile(file), host),

  onProcessLog: (cb) => {
    const listener = (_e, payload) => cb(payload);
    ipcRenderer.on("process-log", listener);
    // devolver función para desuscribir
    return () => ipcRenderer.removeListener("process-log", listener);
  },
});
