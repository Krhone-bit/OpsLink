const { spawn, execSync } = require("child_process");
const net = require("net");

async function tunnel(host, dbHost) {
    const LOCAL_TUNNEL_PORT = "54320";
    const DB_PORT = "5432";
    function buildSshArgs() {
        return [
            "-N",
            "-L", `${LOCAL_TUNNEL_PORT}:${dbHost}:${DB_PORT}`,
            "-o", "ExitOnForwardFailure=yes",
            "-o", "ServerAliveInterval=60",
            "-o", "ServerAliveCountMax=3",
            host,
        ];
    }

    function checkSshConfig() {

        try {
            execSync(`ssh -G ${host}`, { stdio: 'ignore' });
            console.log("✅ SSH configuration verified");
        } catch (err) {
            console.error("❌ SSH configuration not found for:", host);
            console.error("   Please check your ~/.ssh/config file");
            process.exit(1);
        }
    }

    function spawnSshTunnel() {
        const args = buildSshArgs();
        console.log("🔌 Starting SSH tunnel...");
        console.log(`   Tunnel: localhost:${LOCAL_TUNNEL_PORT} → ${host}:${DB_PORT}`);
        console.log(`   Via: ${host}`);

        const proc = spawn("ssh", args, {
            stdio: ["ignore", "pipe", "pipe"],
            env: process.env
        });

        proc.stderr.on("data", (d) => {
            const output = d.toString().trim();
            if (output && !output.includes("Warning: Permanently added")) {
                process.stderr.write(`[ssh] ${output}\n`);
            }
        });

        proc.on("exit", (code, sig) => {
            console.log(`🔌 SSH tunnel exited code=${code} signal=${sig}`);
        });

        return proc;
    }


    function waitPort(port, host = "127.0.0.1", timeoutMs = 30000, intervalMs = 500) {
        const start = Date.now();
        return new Promise((resolve, reject) => {
            (function tryConnect() {
                const s = net.createConnection({ port: Number(port), host }, () => {
                    s.destroy();
                    console.log(`✅ Port ${host}:${port} is ready`);
                    return resolve();
                });

                s.on("error", () => {
                    s.destroy();
                    if (Date.now() - start > timeoutMs) {
                        return reject(new Error(`Timeout waiting for ${host}:${port}`));
                    }
                    setTimeout(tryConnect, intervalMs);
                });
            })();
        });
    }

    console.log("🚀 Starting database tunnel setup...");

    const sshProc = spawnSshTunnel();

    const cleanup = () => {
        if (!sshProc.killed) {
            console.log("🧹 Cleaning up SSH tunnel...");
            sshProc.kill("SIGTERM");
        }
    };

    // Manejar cierre graceful
    process.on("SIGINT", () => {
        cleanup();
        process.exit();
    });
    process.on("SIGTERM", () => {
        cleanup();
        process.exit();
    });
    process.on("exit", cleanup);
    try {
        // Verificar configuración SSH
        checkSshConfig();
        // Esperar túnel
        await waitPort(LOCAL_TUNNEL_PORT, "127.0.0.1");

        return sshProc;

    } catch (err) {
        console.error("❌ Error during database tunnel setup:", err);
        process.exit(1);
    }
}

module.exports = tunnel;