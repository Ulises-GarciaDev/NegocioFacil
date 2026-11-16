import * as SQLite from "expo-sqlite";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("gestion-negocios.db");
  }
  return dbPromise;
}

export async function initDb() {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS negocio (
      id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
      tipo TEXT NOT NULL,
      nombre TEXT NOT NULL,
      propietario TEXT NOT NULL,
      direccion TEXT NOT NULL,
      telefono TEXT,
      moneda TEXT NOT NULL DEFAULT 'MXN'
    );

    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      categoria TEXT NOT NULL DEFAULT 'General',
      precio REAL NOT NULL,
      existencias REAL NOT NULL DEFAULT 0,
      unidad TEXT NOT NULL DEFAULT 'kg',
      stock_minimo REAL NOT NULL DEFAULT 5
    );

    CREATE TABLE IF NOT EXISTS ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      total REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS venta_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venta_id INTEGER NOT NULL REFERENCES ventas(id),
      producto_id INTEGER NOT NULL REFERENCES productos(id),
      cantidad REAL NOT NULL,
      precio_unitario REAL NOT NULL,
      subtotal REAL NOT NULL
    );
  `);
}

// SOLO PARA PRUEBAS: borra todo para volver a ver el flujo desde Welcome
export async function reiniciarBase() {
  const db = await getDb();
  await db.execAsync(`
    DROP TABLE IF EXISTS venta_items;
    DROP TABLE IF EXISTS ventas;
    DROP TABLE IF EXISTS productos;
    DROP TABLE IF EXISTS negocio;
  `);
  await initDb();
}