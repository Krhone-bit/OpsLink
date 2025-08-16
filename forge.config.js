// forge.config.js
module.exports = {
  packagerConfig: {
    // opcional: icono (Windows usa .ico)
    icon: "./assets/ssh-icon", // sin extensión; usa ./assets/icon.ico
  },
  rebuildConfig: {},
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "Krhone-bit",
          name: "OpsLink",
        },
        prerelease: false,
        draft: true,
      },
    },
  ],
  makers: [
    {
      name: "@electron-forge/maker-squirrel", // Instalador .exe para Windows
      config: {
        name: "tickets_ssh", // nombre interno (sin espacios)
        setupExe: "TicketsSSH-Setup.exe",
        setupIcon: "./assets/ssh-icon.ico", // opcional
      },
    },
    {
      name: "@electron-forge/maker-zip", // ZIP adicional (opcional)
      platforms: ["win32"],
    },
  ],
};
