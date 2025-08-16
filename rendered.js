const form = document.getElementById("excelForm");
const dz = document.getElementById("dropzone");
const input = document.getElementById("fileInput");
const fileNameEl = document.getElementById("fileName");
const backupBtn = document.getElementById("backup");
const termEl = document.getElementById("terminal");
const submitBtn = document.querySelector(".success-btn");
const chipsEl = document.getElementById("backupChips");

let selectedFileName = null;

// Dark mode toggles (si existen)
document
  .getElementById("toggle-dark-mode")
  ?.addEventListener("click", async () => {
    const isDarkMode = await window.darkMode.toggle();
    const el = document.getElementById("theme-source");
    if (el) el.textContent = isDarkMode ? "Dark" : "Light";
  });

document
  .getElementById("reset-to-system")
  ?.addEventListener("click", async () => {
    await window.darkMode.system();
    const el = document.getElementById("theme-source");
    if (el) el.textContent = "System";
  });

function setFile(file) {
  if (!file) return;
  selectedFileName = file.name;
  if (fileNameEl) fileNameEl.textContent = `Archivo: ${file.name}`;
}

// Drag & drop
["dragenter", "dragover"].forEach((evt) =>
  dz?.addEventListener(evt, (e) => {
    e.preventDefault();
    dz.classList.add("dragover");
  })
);

["dragleave", "drop"].forEach((evt) =>
  dz?.addEventListener(evt, (e) => {
    e.preventDefault();
    dz.classList.remove("dragover");
  })
);

dz?.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files?.[0];
  setFile(file);
});

input?.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  setFile(file);
});

// Botón de backup (si existe)
backupBtn?.addEventListener("click", async (e) => {
  e.preventDefault(); // por si está dentro de un form

  // deshabilitar y feedback
  backupBtn.disabled = true;
  backupBtn.setAttribute("aria-busy", "true");
  const originalText = backupBtn.textContent;
  backupBtn.textContent = "Generando...";

  try {
    const resp = await window.electronAPI.backup(); // ¡espera la promesa!
    if (resp?.status === "error") {
      showToast(resp.message);
    } else {
      showToast("Backup realizado con éxito ✅", "success");
    }
  } catch (err) {
    showToast(err?.message || "Error desconocido");
  } finally {
    // restaurar estado
    backupBtn.disabled = false;
    backupBtn.removeAttribute("aria-busy");
    backupBtn.textContent = originalText;
  }
});

function appendLog(text, stream = "stdout") {
  if (!termEl) return;
  const lines = String(text).replace(/\r/g, "\n").split("\n");
  for (const line of lines) {
    if (!line) continue;
    const div = document.createElement("div");
    div.className = stream;
    div.textContent = line;
    termEl.appendChild(div);
  }
  termEl.scrollTop = termEl.scrollHeight;
}

// Suscripción a logs
const unsubscribeLogs = window.electronAPI.onProcessLog(({ type, data }) => {
  if (type === "cmd") appendLog(`$ ${data}`, "cmd");
  if (type === "stdout") appendLog(data, "stdout");
  if (type === "stderr") appendLog(data, "stderr");
});

// Toast simple
function showToast(message, kind = "error") {
  const container = document.getElementById("toastContainer");
  if (!container) return alert(message);
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  if (kind === "success") toast.style.backgroundColor = "#16a34a";
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Submit del formulario
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (termEl) termEl.textContent = ""; // limpiar terminal

  const tipoOperativo = document.getElementById("tipoTurno")?.checked ?? true;

  if (!selectedFileName) {
    showToast(
      "Por favor selecciona un archivo .xlsx antes de ejecutar el proceso"
    );
    return;
  }

  // evitar múltiples clics
  const originalText = submitBtn?.textContent;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Procesando...";
  }

  try {
    const resp = await window.electronAPI.runProcess({
      fileName: selectedFileName,
      operativo: tipoOperativo,
    });

    if (resp?.status === "error") {
      showToast(resp.message);
      return;
    }
    showToast("Proceso completado con éxito ✅", "success");
  } catch (err) {
    showToast(err?.message || "Error desconocido");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText ?? "Cargar Turno";
    }
  }
});

async function loadBackups() {
  if (!chipsEl) return;
  chipsEl.innerHTML = '<div class="chip loading">Cargando…</div>';

  try {
    const resp = await window.electronAPI.listBackups();
    chipsEl.innerHTML = "";

    if (resp.status !== "ok" || resp.files.length === 0) {
      chipsEl.innerHTML = '<div class="chip empty">Sin backups</div>';
      return;
    }

    for (const name of resp.files) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = name;

      chip.addEventListener("click", async () => {
        try {
          await navigator.clipboard?.writeText(name);
          showToast("Nombre de backup copiado ✅", "success");
        } catch {
          showToast(name, "success"); // fallback: mostramos el nombre
        }
      });

      chipsEl.appendChild(chip);
    }
  } catch (e) {
    chipsEl.innerHTML = '<div class="chip error">Error al listar</div>';
    showToast(e?.message || "Error al listar backups");
  }
}

// Llama al cargar la página (o cuando quieras refrescar)
document.addEventListener("DOMContentLoaded", loadBackups);
