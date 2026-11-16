
import { getDb } from "./db";
import type { ItemVenta } from "../context/VentaContext";

const redondear = (n: number, decimales: number) => {
  const factor = 10 ** decimales;
  return Math.round(n * factor) / factor;
};

// Para mostrar el número de la siguiente venta
export async function siguienteNumeroVenta(): Promise<number> {
  const db = await getDb();

  const fila = await db.getFirstAsync<{ siguiente: number }>(
    "SELECT COALESCE(MAX(id), 0) + 1 AS siguiente FROM ventas"
  );

  return fila?.siguiente ?? 1;
}

// Valida y registra la venta completa

export async function registrarVenta(
  items: ItemVenta[]
): Promise<number> {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("La venta debe contener al menos un producto");
  }

  const itemsValidados = items.map((item) => {
    if (!Number.isInteger(item.productoId) || item.productoId <= 0) {
      throw new Error("Identificador de producto inválido");
    }

    if (!Number.isFinite(item.cantidad) || item.cantidad <= 0) {
      throw new Error(`Cantidad inválida para ${item.nombre}`);
    }

    if (item.unidad !== "kg" && item.unidad !== "pieza") {
      throw new Error("Unidad de medida inválida");
    }

    if (item.unidad === "pieza" && !Number.isInteger(item.cantidad)) {
      throw new Error("Las piezas deben ser cantidades enteras");
    }

    if (
      !Number.isFinite(item.precioUnitario) ||
      item.precioUnitario <= 0
    ) {
      throw new Error(`Precio inválido para ${item.nombre}`);
    }

    return item;
  });

  const db = await getDb();
  let ventaId = 0;

  await db.withTransactionAsync(async () => {
    const productosVerificados = [];

    for (const item of itemsValidados) {
      const producto = await db.getFirstAsync<{
        id: number;
        nombre: string;
        precio: number;
        existencias: number;
        unidad: "kg" | "pieza";
      }>(
        `SELECT id, nombre, precio, existencias, unidad
         FROM productos
         WHERE id = ?`,
        [item.productoId]
      );

      if (!producto) {
        throw new Error(`El producto ${item.nombre} ya no existe`);
      }

      if (producto.unidad !== item.unidad) {
        throw new Error(`La unidad de ${producto.nombre} ha cambiado`);
      }

      if (producto.precio !== item.precioUnitario) {
        throw new Error(`El precio de ${producto.nombre} ha cambiado. Actualiza el carrito`);
      }

      if (producto.existencias < item.cantidad) {
        throw new Error(`No hay existencias suficientes de ${producto.nombre}`);
      }

      productosVerificados.push({
        item,
        nombre: producto.nombre,
        subtotal: redondear(
          item.cantidad * producto.precio,
          2
        ),
      });
    }

    const total = redondear(
      productosVerificados.reduce(
        (suma, producto) => suma + producto.subtotal,
        0
      ),
      2
    );

    const resultado = await db.runAsync(
      "INSERT INTO ventas (total) VALUES (?)",
      [total]
    );

    ventaId = resultado.lastInsertRowId;

    for (const producto of productosVerificados) {
      const { item, nombre, subtotal } = producto;

      const descuento = await db.runAsync(
        `UPDATE productos
         SET existencias = ROUND(existencias - ?, 3)
         WHERE id = ? AND existencias >= ?`,
        [item.cantidad, item.productoId, item.cantidad]
      );

      if (descuento.changes === 0) {
        throw new Error(
          `No hay existencias suficientes de ${nombre}`
        );
      }

      await db.runAsync(
        `INSERT INTO venta_items
        (venta_id, producto_id, cantidad, precio_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)`,
        [
          ventaId,
          item.productoId,
          item.cantidad,
          item.precioUnitario,
          subtotal,
        ]
      );
    }
  });

  return ventaId;
}

