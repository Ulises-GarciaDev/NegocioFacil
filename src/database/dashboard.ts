
import { getDb } from "./db";

type DatosNegocio = {
  nombre: string;
  tipo: string;
  propietario: string;
  moneda: string;
};

type ResumenSQL = {
  ventasHoy: number;
  operacionesHoy: number;
  totalProductos: number;
  productosBajos: number;
};

type VentaPorHoraSQL = {
  hora: number;
  monto: number;
};

export async function obtenerResumenDashboard() {
  const db = await getDb();

  // 1. Información del negocio
  const negocio = await db.getFirstAsync<DatosNegocio>(
    `SELECT nombre, tipo, propietario, moneda
     FROM negocio
     WHERE id = 1`
  );

  // 2. Resumen de ventas del día
  const resumen = await db.getFirstAsync<ResumenSQL>(
    `SELECT
       COALESCE(SUM(total), 0) AS ventasHoy,
       COUNT(*) AS operacionesHoy
     FROM ventas
     WHERE date(fecha) = date('now', 'localtime')`
  );

  // 3. Cantidad total de productos y productos con stock bajo
  const inventario = await db.getFirstAsync<{
    totalProductos: number;
    productosBajos: number;
  }>(
    `SELECT
       COUNT(*) AS totalProductos,
       COALESCE(
         SUM(CASE WHEN existencias <= stock_minimo THEN 1 ELSE 0 END),
         0
       ) AS productosBajos
     FROM productos`
  );

  // 4. Ventas agrupadas por hora
  const ventasPorHoraSQL = await db.getAllAsync<VentaPorHoraSQL>(
    `SELECT
       CAST(strftime('%H', fecha) AS INTEGER) AS hora,
       SUM(total) AS monto
     FROM ventas
     WHERE date(fecha) = date('now', 'localtime')
     GROUP BY strftime('%H', fecha)
     ORDER BY hora`
  );

  return {
    negocio: negocio ?? null,

    ventasHoy: resumen?.ventasHoy ?? 0,
    operacionesHoy: resumen?.operacionesHoy ?? 0,

    totalProductos: inventario?.totalProductos ?? 0,
    productosBajos: inventario?.productosBajos ?? 0,

    ventasPorHora: ventasPorHoraSQL.map((venta) => ({
      hora: `${String(venta.hora).padStart(2, "0")} h`,
      monto: venta.monto,
    })),
  };
}
