export function showToast(message, kind = "error") {
    const container = document.getElementById("toastContainer");
    if (!container) {
        console.warn("Toast container not found");
        return alert(message);
    }

    const toast = document.createElement("div");
    // Tailwind styles for toast
    const baseClasses = "flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 border border-slate-200 dark:border-slate-700 animate-fade-in-up";
    toast.className = baseClasses;

    // Icon based on kind
    const iconSpan = document.createElement("div");
    if (kind === "success") {
        iconSpan.innerHTML = '<span class="material-icons-round text-green-500">check_circle</span>';
    } else {
        iconSpan.innerHTML = '<span class="material-icons-round text-red-500">error</span>';
    }

    const textSpan = document.createElement("div");
    textSpan.className = "ml-3 text-sm font-normal";
    textSpan.textContent = message;

    toast.appendChild(iconSpan);
    toast.appendChild(textSpan);

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}
