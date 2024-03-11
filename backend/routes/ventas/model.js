import { createClient } from '@libsql/client';
const urlMan = process.env.mode === 'production' ? process.env.DB_MAN_URL : 'file:./backend/local.db';


// Configuración de variables de entorno
const Token = process.env.DB_MAN_TOKEN;

// Crear cliente de base de datos
const client = createClient({
    authToken: Token,
    url: urlMan
});

// Inicializar modelo de base de datos para ventas

if (process.env.mode !== 'production') {
    await client.execute(`
    DROP TABLE IF EXISTS OrderProduct
    `);
    await client.execute(`
    DROP TABLE IF EXISTS OrderTable
    `);
}
// Crear tablas si no existen
await client.execute(`
    CREATE TABLE IF NOT EXISTS OrderTable (
        id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
        customerName TEXT NOT NULL,
        customerId INTEGER NOT NULL,
        email TEXT NOT NULL,
        shipping TEXT NOT NULL,
        status TEXT DEFAULT 'pending'
    )
`);

await client.execute(`
    CREATE TABLE IF NOT EXISTS OrderProduct (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER NOT NULL,
        productName TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (orderId) REFERENCES OrderTable(id)
    )
`);

// Exportar cliente de base de datos
export default client;