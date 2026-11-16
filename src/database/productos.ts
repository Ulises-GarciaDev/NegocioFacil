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

function validarProducto(p: NuevoProducto): NuevoProducto {
  if (typeof p.nombre !== "string" || !p.nombre.trim()) {
    throw new Error("El nombre del producto es obligatorio");
  }

  if (typeof p.categoria !== "string" || !p.categoria.trim()) {
    throw new Error("La categoría es obligatoria");
  }

  if (!Number.isFinite(p.precio) || p.precio <= 0) {
    throw new Error("El precio debe ser mayor a cero");
  }

  if (!Number.isFinite(p.existencias) || p.existencias < 0) {
    throw new Error("Las existencias no pueden ser negativas");
  }

  if (p.unidad !== "kg" && p.unidad !== "pieza") {
    throw new Error("Unidad de medida inválida");
  }

  if (p.unidad === "pieza" && !Number.isInteger(p.existencias)) {
    throw new Error("Las existencias por pieza deben ser enteras");
  }

  return {
    ...p,
    nombre: p.nombre.trim(),
    categoria: p.categoria.trim(),
  };
}

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
  const producto = validarProducto(p);
  const db = await getDb();

  await db.runAsync(
    `INSERT INTO productos
    (nombre, categoria, precio, existencias, unidad)
    VALUES (?, ?, ?, ?, ?)`,
    [
      producto.nombre,
      producto.categoria,
      producto.precio,
      producto.existencias,
      producto.unidad,
    ]
  );
}
export async function actualizarProducto(id: number, p: NuevoProducto) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Identificador de producto inválido");
  }

  const producto = validarProducto(p);
  const db = await getDb();

  const resultado = await db.runAsync(
    `UPDATE productos
    SET nombre = ?, categoria = ?, precio = ?, existencias = ?, unidad = ?
    WHERE id = ?`,
    [
      producto.nombre,
      producto.categoria,
      producto.precio,
      producto.existencias,
      producto.unidad,
      id,
    ]
  );

  if (resultado.changes === 0) {
    throw new Error("El producto no existe");
  }
}

export async function eliminarProducto(id: number) {
  const db = await getDb();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Identificador de producto inválido");
  }

  const producto = await db.getFirstAsync<{ id: number }>(
    "SELECT id FROM productos WHERE id = ?",
    [id]
  );

  if (!producto) {
    throw new Error("El producto no existe");
  }

  const ventasRelacionadas = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) AS total FROM venta_items WHERE producto_id = ?",
    [id]
  );

  if (ventasRelacionadas && ventasRelacionadas.total > 0) {
    throw new Error(
      "No puedes eliminar este producto porque tiene ventas registradas"
    );
  }

  await db.runAsync(
    "DELETE FROM productos WHERE id = ?",
    [id]
  );
}
