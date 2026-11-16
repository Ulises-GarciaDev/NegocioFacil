import { getDb } from "./db";
import { configNegocios } from "../constants/negocios";
import type { TipoNegocio } from "../types/negocio";

export type Negocio = {
  id: number;
  tipo: TipoNegocio;
  nombre: string;
  propietario: string;
  direccion: string;
  telefono: string | null;
  moneda: string;
};

type DatosNegocio = {
  tipo: TipoNegocio;
  nombre: string;
  propietario: string;
  direccion: string;
  telefono: string;
};

export async function obtenerNegocio(): Promise<Negocio | null> {
  const db = await getDb();
  return await db.getFirstAsync<Negocio>("SELECT * FROM negocio WHERE id = 1");
}

export async function guardarNegocio(datos: DatosNegocio) {
  const db = await getDb();
  const config = configNegocios[datos.tipo];

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT OR REPLACE INTO negocio (id, tipo, nombre, propietario, direccion, telefono, moneda)
       VALUES (1, ?, ?, ?, ?, ?, 'MXN')`,
      [
        datos.tipo,
        datos.nombre,
        datos.propietario,
        datos.direccion,
        datos.telefono,
      ],
    );

    // Precarga los productos de ejemplo solo si todavía no hay ninguno
    const fila = await db.getFirstAsync<{ total: number }>(
      "SELECT COUNT(*) AS total FROM productos",
    );
    if (fila && fila.total === 0) {
      for (const p of config.productosEjemplo) {
        await db.runAsync(
          "INSERT INTO productos (nombre, categoria, precio, existencias, unidad) VALUES (?, ?, ?, ?, ?)",
          [
            p.nombre,
            p.categoria,
            p.precio,
            p.existencias,
            config.unidadDefault,
          ],
        );
      }
    }
  });
}
