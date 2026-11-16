import { getDb } from "./db";

export type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  existencias: number;
  unidad: "kg" | "pieza";
  stock_minimo: number;
};

type NuevoProducto = {
  nombre: string;
  categoria: string;
  precio: number;
  existencias: number;
  unidad: "kg" | "pieza";
};

export async function obtenerProductos(): Promise<Producto[]> {
  const db = await getDb();
  return await db.getAllAsync<Producto>(
    "SELECT * FROM productos ORDER BY nombre"
  );
}

export async function obtenerProducto(id: number): Promise<Producto | null> {
  const db = await getDb();
  return await db.getFirstAsync<Producto>(
    "SELECT * FROM productos WHERE id = ?",
    [id]
  );
}

export async function agregarProducto(p: NuevoProducto) {
  const db = await getDb();
  await db.runAsync(
    "INSERT INTO productos (nombre, categoria, precio, existencias, unidad) VALUES (?, ?, ?, ?, ?)",
    [p.nombre, p.categoria, p.precio, p.existencias, p.unidad]
  );
}

export async function actualizarProducto(id: number, p: NuevoProducto) {
  const db = await getDb();
  await db.runAsync(
    "UPDATE productos SET nombre = ?, categoria = ?, precio = ?, existencias = ?, unidad = ? WHERE id = ?",
    [p.nombre, p.categoria, p.precio, p.existencias, p.unidad, id]
  );
}

export async function eliminarProducto(id: number) {
  const db = await getDb();
  await db.runAsync("DELETE FROM productos WHERE id = ?", [id]);
}