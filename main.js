// main.js
const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron/main");
const os = require("node:os");
const { spawn, execSync } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");
const dayjs = require("dayjs");
const net = require("node:net");
const pg = require("pg");
const fsPromises = require("node:fs/promises");
const XLSX = require("xlsx");
const tunnel = require("./dbTunnel");
const dbConnect = require("./dbConect.js");
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

let mainWindow; // <-- referencia global

const createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.maximize();
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
ipcMain.handle("run-process", async (event, { fileName, operativo, host, rootPath, environmentPath, settingsModule }) => {
  const wc = event.sender;
  if (!fileName)
    return { status: "error", message: "No se recibió el nombre de archivo" };

  if (!host || !rootPath || !environmentPath || !settingsModule) {
    return { status: "error", message: "Faltan configuraciones SSH o de proyecto." };
  }

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

  try {
    // 1) Subir archivo
    sendLog("stdout", `Subiendo ${fileName} a ${host}:${rootPath}/...`, wc);
    await runWithLogs("scp", [localPath, `${host}:${rootPath}/`], {}, wc);

    // Construir el prefijo del comando remoto
    const remoteCmdPrefix = `cd ${rootPath} && source ${environmentPath} && export PYTHONPATH=${rootPath} && export DJANGO_SETTINGS_MODULE=${settingsModule} && `;

    if (operativo) {
      sendLog("stdout", "Archivo subido correctamente (Operativo)", wc);
      await runWithLogs(
        "ssh",
        [
          "-T",
          host,
          "bash",
          "-lc",
          `"${remoteCmdPrefix} django-admin load_daily_turns --route=${escapeShellArg(
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
          host,
          "bash",
          "-lc",
          `"${remoteCmdPrefix} django-admin load_daily_turns_absence --route=${escapeShellArg(
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
    // Limpieza de archivos .xlsx en remoto
    const cleanupCommand = `cd ${rootPath} && rm ${escapeShellArg(fileName)}`;
    if (operativo) {
      sendLog("stdout", "Limpieza de archivos .xlsx en remoto (Operativo)", wc);
    } else {
      sendLog("stdout", "Limpieza de archivos .xlsx en remoto (No Operativo)", wc);
    }
    await runWithLogs(
      "ssh",
      [
        "-T", // no pidas TTY
        host,
        "bash",
        "-lc", // login shell no interactiva
        `"${cleanupCommand}"`,
      ],
      {},
      wc
    );
  }
});

// ---------- Backup opcional ----------
ipcMain.handle("backup", async (event, host, rootPath, environmentPath, settingsModule) => {
  const remoteHost = host;
  const remoteRootPath = rootPath;
  const remoteEnvironmentPath = environmentPath;
  const remoteSettingsModule = settingsModule;
  const backupCommand = `PGPASSWORD=${dbPassword} pg_dump -h ${dbHost} -U ${dbUsername} -d ${dbName} --no-owner --no-privileges > ~/backup-${year}-${month}-${day}.sql`;

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
ipcMain.handle("list-backups", async (event, host) => {
  console.log(`Listar backups para host: ${host}`);
  if (!host) return { status: "error", message: "No host selected" };
  const wc = event.sender;
  // Un (1) único string para bash -lc:
  const script = [
    "shopt -s nullglob",
    'for f in ~/backup-*.sql; do printf "%s\\n" "$(basename "$f")"; done',
  ].join("; ");

  try {
    const { stdout } = await runCapture("ssh", [
      "-T",
      host,
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
ipcMain.handle("delete-backup", async (event, fileName, host) => {
  const wc = event.sender;
  if (!fileName)
    return { status: "error", message: "No se especificó archivo" };

  const script = `"rm -f ~/${fileName}"`;
  try {
    await runWithLogs("ssh", ["-T", host, "bash", "-lc", script]);
    return { status: "ok", file: fileName };
  } catch (err) {
    return { status: "error", message: err?.message ?? String(err) };
  }
});

// --- descargar backup ---
// --- descargar backup ---
ipcMain.handle("download-backup", async (event, fileName, host) => {
  const wc = event.sender;
  if (!fileName)
    return { status: "error", message: "No se especificó archivo" };

  // Crear una carpeta backups en Downloads si no existe
  const filePath = path.join(os.homedir(), "Downloads", "backups");
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }

  try {
    // Attempt to use rsync for progress bar support
    let useRsync = false;
    try {
      await runCapture("which", ["rsync"]);
      useRsync = true;
    } catch (e) {
      useRsync = false;
    }

    if (useRsync) {
      // rsync -avP -e "ssh" host:~/file local/
      // Note: rsync needs to run in a shell for some expansions, but here we can pass direct args
      await runWithLogs("rsync", ["-avP", "-e", "ssh", `${host}:~/${fileName}`, filePath], {}, wc);
    } else {
      // Fallback to SCP (might not show progress bar if not TTY)
      await runWithLogs("scp", [`${host}:~/${fileName}`, filePath], {}, wc);
    }

    return { status: "ok", file: fileName };
  } catch (err) {
    return { status: "error", message: err?.message ?? String(err) };
  }
});

// --- limpiar cache (ej: Redis) ---
ipcMain.handle("clear-cache", async (event, host, rootPath, environmentPath, settingsModule) => {
  const wc = event.sender;
  if (!host) return { status: "error", message: "No host selected" };
  // Ajusta según tu necesidad real
  // Ejemplo: ssh -T EC2-PROD-Private 'bash -lc "source /home/ec2-user/k2-backend/app/.venv/bin/activate && cd /home/ec2-user/k2-backend/app && export PYTHONPATH=/home/ec2-user/k2-backend/app && export DJANGO_SETTINGS_MODULE=dao.core.settings && django-admin shell -c \"from business_logic.redis import r; r.flushdb(asynchronous=True)\""'
  const remoteCmdPrefix = `source ${environmentPath} && cd ${rootPath} && export PYTHONPATH=${rootPath} && export DJANGO_SETTINGS_MODULE=${settingsModule} && `;
  const script = `"${remoteCmdPrefix} django-admin shell -c 'from business_logic.redis import r; r.flushdb(asynchronous=True)'"`;
  try {
    await runWithLogs("ssh", ["-T", host, "bash", "-lc", script], {}, wc);
    return { status: "ok" };
  } catch (err) {
    return { status: "error", message: err?.message || String(err) };
  }
});

// --- leer ~/.ssh/config ---
ipcMain.handle("ssh-config:read", async () => {
  try {
    const sshConfigPath = path.join(os.homedir(), ".ssh", "config");
    // Verificar si existe
    try {
      await fsPromises.access(sshConfigPath, fs.constants.R_OK);
    } catch {
      return { status: "error", message: "No se encontró el archivo de configuración SSH (~/.ssh/config)" };
    }

    const content = await fsPromises.readFile(sshConfigPath, "utf8");
    return { status: "ok", content };
  } catch (err) {
    return { status: "error", message: err?.message ?? String(err) };
  }
});

// --- probar conexión ssh ---
ipcMain.handle("ssh:test", async (_event, host) => {
  if (!host) return { status: "error", message: "No host selected" };
  // ssh -T <host> "echo ok"
  try {
    // Timeout de 10s para evitar que se cuelgue
    const child = spawn("ssh", ["-T", host, "echo ok"], { timeout: 10000 });

    return new Promise((resolve) => {
      let errData = "";
      child.stderr.on("data", (d) => errData += d.toString());

      child.on("close", (code) => {
        if (code === 0) {
          resolve({ status: "ok", message: "Conexión exitosa" });
        } else {
          resolve({ status: "error", message: `Fallo conexión (code ${code}): ${errData}` });
        }
      });
      child.on("error", (err) => {
        resolve({ status: "error", message: err.message });
      });
    });
  } catch (err) {
    return { status: "error", message: err.message };
  }
});

// --- obtener espacio en disco ---
ipcMain.handle("ssh:disk-usage", async (_event, host) => {
  if (!host) return { status: "error", message: "No host selected" };
  // df -h / | tail -1 | awk '{print $5}'
  try {
    const child = spawn("ssh", [host, "df -h / | tail -1 | awk '{print $5}'"]);

    return new Promise((resolve) => {
      let output = "";
      let errData = "";

      child.stdout.on("data", (d) => output += d.toString());
      child.stderr.on("data", (d) => errData += d.toString());

      child.on("close", (code) => {
        if (code === 0) {
          console.log(`Disk usage: ${output.trim()}`);
          resolve({ status: "ok", usage: output.trim() });
        } else {
          resolve({ status: "error", message: `Error obtaining disk usage: ${errData}` });
        }
      });
      child.on("error", (err) => resolve({ status: "error", message: err.message }));
    });
  } catch (err) {
    return { status: "error", message: err.message };
  }
})

// --- abrir y leer excel ---
ipcMain.handle("excel:open-and-read", async (_event, file, host) => {
  try {
    console.log("excel:open-and-read");
    console.log(file);
    const workbook = XLSX.readFile(file, { cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    const data_ = data.map((item) => {
      // aqui llega yyyy/mm/dd con dayjs leer fecha inicio con ese formato
      item["Fecha Inicio"] = dayjs(item["Fecha Inicio"]).format("YYYY-MM-DD");
      return item;
    })
    console.log("***************");
    const dataFromDb = await getDataFromDb(host)
    console.log(dataFromDb)
    console.log("***************");
    return { status: "ok", data: data_ };
  } catch (err) {
    console.error("Error in excel:open-and-read:", err);
    return { status: "error", message: err.message };
  }
})


async function getDataFromDb(host) {
  const sshProc = await tunnel(host, dbHost);

  const client = await dbConnect(dbUsername, dbPassword, dbName);

  // Verificar conexión
  const result = await client.query(`
    SELECT 
      now() as time, 
      current_database() as database,
      current_user as user,
      version() as version
  `);

  console.log("✅ Database connection successful!");
  // console.log(`   Time: ${result.rows[0].time}`);
  // console.log(`   Database: ${result.rows[0].database}`);
  // console.log(`   User: ${result.rows[0].user}`);
  // console.log(`   PostgreSQL: ${result.rows[0].version.split(',')[0]}`);
  client.end();
  sshProc.kill();
  return result.rows[0];
  // const result_users = await client.query(`
  //   SELECT begin_turn_datetime, end_turn_datetime, turn_type, dynamic_turn_status, dynamic_turn_work_status
  //   FROM hng_dynamic_turn 
  //   where begin_turn_datetime::date = current_date
  //   order by begin_turn_datetime asc
  // `);
  // console.log(result_users.rows.map(row => ({
  //   begin_turn_datetime: dayjs(row.begin_turn_datetime).format('YYYY-MM-DD HH:mm:ss'),
  //   end_turn_datetime: dayjs(row.end_turn_datetime).format('YYYY-MM-DD HH:mm:ss'),
  //   turn_type: row.turn_type,
  //   dynamic_turn_status: row.dynamic_turn_status,
  //   dynamic_turn_work_status: row.dynamic_turn_work_status
  // })));

}