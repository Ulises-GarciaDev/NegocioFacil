import { getDb } from "./db";
import type { ItemVenta } from "../context/VentaContext";

// Para el "Venta #0039" del encabezado
export async function siguienteNumeroVenta(): Promise<number> {
  const db = await getDb();
  const fila = await db.getFirstAsync<{ siguiente: number }>(
    "SELECT COALESCE(MAX(id), 0) + 1 AS siguiente FROM ventas"
  );
  return fila?.siguiente ?? 1;
}

// Guarda la venta, sus renglones y descuenta existencias: todo o nada
export async function registrarVenta(items: ItemVenta[]): Promise<number> {
  const db = await getDb();
  let ventaId = 0;

  await db.withTransactionAsync(async () => {
    const total =
      Math.round(items.reduce((suma, i) => suma + i.subtotal, 0) * 100) / 100;

    const resultado = await db.runAsync(
      "INSERT INTO ventas (total) VALUES (?)",
      [total]
    );
    ventaId = resultado.lastInsertRowId;

    for (const item of items) {
      // Solo descuenta si todavía alcanzan las existencias
      const descuento = await db.runAsync(
        "UPDATE productos SET existencias = ROUND(existencias - ?, 3) WHERE id = ? AND existencias >= ?",
        [item.cantidad, item.productoId, item.cantidad]
      );
      if (descuento.changes === 0) {
        throw new Error(`No hay existencias suficientes de ${item.nombre}`);
      }

      await db.runAsync(
        "INSERT INTO venta_items (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)",
        [ventaId, item.productoId, item.cantidad, item.precioUnitario, item.subtotal]
      );
    }
  });

  return ventaId;
}