const { Client } = require("pg");

async function dbConnect(user, password, database) {
    const client = new Client({
        host: "127.0.0.1",
        port: 54320,
        user,
        password,
        database,
        connectionTimeoutMillis: 15000,
        // SSL CONFIGURACIÓN PARA RDS
        ssl: {
            rejectUnauthorized: false  // ← Esto ignora errores de certificado
        }
    })
    await client.connect();
    return client;
}

module.exports = dbConnect;