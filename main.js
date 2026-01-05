// main.js
const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron/main");
const os = require("node:os");
const { spawn } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");
if (!app.isPackaged) {
  const devEnv = path.join(__dirname, ".env");
  if (fs.existsSync(devEnv)) {
    // Si usabas process.loadEnvFile:
    process.loadEnvFile(devEnv);
  }
}

let PROD = {};
try {
  // este archivo lo generas en CI antes del build
  PROD = require("./config/prod-config.js");
} catch {
  /* si no está, seguimos con process.env */
}

const appDir = process.env.APP_DIR || PROD.APP_DIR;
const activate = process.env.VENV_PY || PROD.VENV_PY;
const dsm = process.env.DJANGO_SETTINGS_MODULE || PROD.DJANGO_SETTINGS_MODULE;
const dbHost = process.env.DB_HOST || PROD.DB_HOST;
const dbUsername = process.env.DB_USERNAME || PROD.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD || PROD.DB_PASSWORD;
const dbName = process.env.DB_NAME || PROD.DB_NAME;
const venv = `source ${activate} && cd ${appDir} && export PYTHONPATH=${appDir} && export DJANGO_SETTINGS_MODULE=${dsm} && `;
const remoteHost = process.env.REMOTE_HOST || PROD.REMOTE_HOST;
const year = new Date().getFullYear();
const month = String(new Date().getMonth() + 1).padStart(2, "0");
const day = String(new Date().getDate()).padStart(2, "0");
const backupCommand = `PGPASSWORD=${dbPassword} pg_dump -h ${dbHost} -U ${dbUsername} -d ${dbName} --no-owner --no-privileges > ~/backup-${year}-${month}-${day}.sql`;

let mainWindow; // <-- referencia global

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");
};

ipcMain.handle("dark-mode:toggle", () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = "light";
  } else {
    nativeTheme.themeSource = "dark";
  }
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle("dark-mode:system", () => {
  nativeTheme.themeSource = "system";
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("archivo-nombre", (_event, fileName) => {
  console.log("Nombre del archivo recibido:", fileName);
});

// ---------- Logs a renderer ----------
function sendLog(type, data, webContents) {
  (webContents || mainWindow?.webContents)?.send("process-log", { type, data });
}

// ---------- Ejecutar comando con stream de logs ----------
function runWithLogs(cmd, args, opts = {}, webContents) {
  return new Promise((resolve, reject) => {
    sendLog("cmd", [cmd].concat(args || []).join(" "), webContents);

    const child = spawn(cmd, args, { shell: false, ...opts });
    child.stdout?.on("data", (chunk) =>
      sendLog("stdout", chunk.toString(), webContents)
    );
    child.stderr?.on("data", (chunk) =>
      sendLog("stderr", chunk.toString(), webContents)
    );
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${cmd} exited with code ${code}`))
    );
  });
}

// --- helper: ejecutar y CAPTURAR salida ---
function runCapture(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { shell: false, ...opts });
    let out = "",
      err = "";
    child.stdout?.on("data", (d) => (out += d.toString()));
    child.stderr?.on("data", (d) => (err += d.toString()));
    child.on("error", reject);
    child.on("close", (code) => {
      // aunque code != 0, si out tiene algo útil lo devolvemos
      if (code === 0 || out) resolve({ stdout: out, stderr: err, code });
      else reject(new Error(err || `${cmd} exited with code ${code}`));
    });
  });
}

function escapeShellArg(arg) {
  return `'${String(arg).replace(/'/g, `'\\''`)}'`;
}

// ---------- Handler principal ----------
ipcMain.handle("run-process", async (event, { fileName, operativo }) => {
  const wc = event.sender;
  if (!fileName)
    return { status: "error", message: "No se recibió el nombre de archivo" };

  // Normaliza y valida por seguridad (evita falsos negativos por mayúsculas/minúsculas)
  const upper = fileName.toUpperCase();
  if (!operativo && !upper.includes("TURNOS NO OPERATIVOS")) {
    return {
      status: "error",
      message:
        "El tipo de turno es No Operativo, pero el archivo no contiene 'TURNOS NO OPERATIVOS'",
    };
  }
  if (operativo && !upper.includes("TURNOS OPERATIVOS")) {
    return {
      status: "error",
      message:
        "El tipo de turno es Operativo, pero el archivo no contiene 'TURNOS OPERATIVOS'",
    };
  }

  const localPath = path.join(os.homedir(), "Downloads", fileName);
  sendLog("stdout", `Ruta local del archivo: ${localPath}`, wc);

  const remoteDirectory = "~/k2-backend/app";
  try {
    // 1) Subir archivo
    // const remoteDirOperativo = "~/k2-backend/app/files";
    // const remoteDir = operativo ? remoteDirOperativo : remoteDirNoOper;

    await runWithLogs("scp", [localPath, `${remoteHost}:${remoteDirectory}`], {}, wc);
    if (operativo) {
      sendLog("stdout", "Archivo subido correctamente (Operativo)", wc);
      await runWithLogs(
        "ssh",
        [
          "-T",
          remoteHost,
          "bash",
          "-lc",
          // habilita expansión de alias y carga .bashrc antes de usar 'venv'
          `"${venv} django-admin load_daily_turns --route=${escapeShellArg(
            fileName
          )}"`,
        ],
        {},
        wc
      );
    } else {
      sendLog("stdout", "Archivo subido correctamente (No Operativo)", wc);
      await runWithLogs(
        "ssh",
        [
          "-T",
          remoteHost,
          "bash",
          "-lc",
          `"${venv} django-admin load_daily_turns_absence --route=${escapeShellArg(
            fileName
          )}"`,
        ],
        {},
        wc
      );
    }

    sendLog("stdout", "Pipeline SSH completado", wc);

    return { status: "ok", uploaded: fileName, operativo };
  } catch (err) {
    console.error("Pipeline SSH falló:", err);
    sendLog("stderr", err?.message || String(err), wc);
    return { status: "error", message: err?.message ?? String(err) };
  } finally {
    if (operativo) {
      sendLog("stdout", "Limpieza de archivos .xlsx en remoto (Operativo)", wc);
      // Limpieza .xlsx (OPERATIVO)
      await runWithLogs(
        "ssh",
        [
          "-T", // no pidas TTY
          remoteHost,
          "bash",
          "-lc", // login shell no interactiva
          `"cd ${remoteDirectory} && rm ${escapeShellArg(fileName)}"`,
        ],
        {},
        wc
      );
    } else {
      sendLog(
        "stdout",
        "Limpieza de archivos .xlsx en remoto (No Operativo)",
        wc
      );
      // Limpieza .xlsx (NO OPERATIVO)
      await runWithLogs(
        "ssh",
        [
          "-T",
          remoteHost,
          "bash",
          "-lc",
          `"cd ${remoteDirectory} && rm ${escapeShellArg(fileName)}"`,
        ],
        {},
        wc
      );
    }
  }
});

// ---------- Backup opcional ----------
ipcMain.handle("backup", async (event) => {
  const wc = event.sender;
  try {
    await runWithLogs(
      "ssh",
      ["-T", remoteHost, "bash", "-lc", `"${backupCommand}"`],
      {},
      wc
    );
    return { status: "ok", message: "Backup realizado con éxito" };
  } catch (err) {
    sendLog("stderr", err?.message || String(err), wc);
    return { status: "error", message: err?.message ?? String(err) };
  }
});

// --- listar backups remotos ~/backups-*.sql ---
ipcMain.handle("list-backups", async () => {
  // Un (1) único string para bash -lc:
  const script = [
    "shopt -s nullglob",
    'for f in ~/backup-*.sql; do printf "%s\\n" "$(basename "$f")"; done',
  ].join("; ");

  try {
    const { stdout } = await runCapture("ssh", [
      "-T",
      remoteHost,
      "bash",
      "-lc",
      script, // <-- todo el script como UN solo argumento
    ]);

    // Limpia y filtra SOLO nombres válidos de backup
    const files = stdout
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((name) => /^backups?-\d{4}-\d{2}-\d{2}\.sql$/i.test(name));

    // Ordena por fecha descendente (más reciente primero)
    const toTs = (name) => {
      const m = name.match(/backups?-(\d{4}-\d{2}-\d{2})\.sql$/i);
      return m ? Date.parse(m[1]) || 0 : 0;
    };
    files.sort((a, b) => toTs(b) - toTs(a));

    return { status: "ok", files };
  } catch (err) {
    return { status: "error", message: err?.message || String(err), files: [] };
  }
});

// --- eliminar backup remoto ---
ipcMain.handle("delete-backup", async (_event, fileName) => {
  if (!fileName)
    return { status: "error", message: "No se especificó archivo" };

  const script = `"rm -f ~/${fileName}"`;
  try {
    await runWithLogs("ssh", ["-T", remoteHost, "bash", "-lc", script]);
    return { status: "ok", file: fileName };
  } catch (err) {
    return { status: "error", message: err?.message ?? String(err) };
  }
});

// --- Limpiar caché de la app ---
ipcMain.handle("clear-cache", async (_event) => {
  const script = `"${venv} django-admin shell -c 'from business_logic.redis import r; r.flushdb(asynchronous=True)'"`;
  try {
    await runWithLogs("ssh", ["-T", remoteHost, "bash", "-lc", script]);
    return { status: "ok", message: "Caché limpiada" };
  } catch (err) {
    return { status: "error", message: err?.message ?? String(err) };
  }
});
