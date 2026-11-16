import { createContext, useContext, useState, type ReactNode } from "react";

export type ItemVenta = {
  productoId: number;
  nombre: string;
  unidad: "kg" | "pieza";
  cantidad: number; // siempre en kg o piezas, nunca en gramos
  precioUnitario: number;
  subtotal: number;
};

type NuevoItem = Omit<ItemVenta, "subtotal">;

type VentaContextType = {
  items: ItemVenta[];
  total: number;
  agregarItem: (item: NuevoItem) => void;
  actualizarCantidad: (productoId: number, cantidad: number) => void;
  quitarItem: (productoId: number) => void;
  limpiarVenta: () => void;
};

const VentaContext = createContext<VentaContextType | null>(null);

const redondear = (n: number, decimales: number) => {
  const f = 10 ** decimales;
  return Math.round(n * f) / f;
};

export function VentaProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemVenta[]>([]);

  const agregarItem = (nuevo: NuevoItem) => {
    setItems((actual) => {
      const existente = actual.find((i) => i.productoId === nuevo.productoId);

      if (!existente) {
        return [
          ...actual,
          {
            ...nuevo,
            subtotal: redondear(nuevo.cantidad * nuevo.precioUnitario, 2),
          },
        ];
      }

      // Si el producto ya estaba en la venta, suma la cantidad
      const cantidad = redondear(existente.cantidad + nuevo.cantidad, 3);
      return actual.map((i) =>
        i.productoId === nuevo.productoId
          ? { ...i, cantidad, subtotal: redondear(cantidad * i.precioUnitario, 2) }
          : i
      );
    });
  };

  const actualizarCantidad = (productoId: number, cantidad: number) =>
    setItems((actual) =>
      actual.map((i) =>
        i.productoId === productoId
          ? { ...i, cantidad, subtotal: redondear(cantidad * i.precioUnitario, 2) }
          : i
      )
    );

  const quitarItem = (productoId: number) =>
    setItems((actual) => actual.filter((i) => i.productoId !== productoId));

  const limpiarVenta = () => setItems([]);

  const total = redondear(items.reduce((suma, i) => suma + i.subtotal, 0), 2);

  return (
    <VentaContext.Provider
      value={{ items, total, agregarItem, actualizarCantidad, quitarItem, limpiarVenta }}
    >
      {children}
    </VentaContext.Provider>
  );
}

export function useVenta() {
  const ctx = useContext(VentaContext);
  if (!ctx) throw new Error("useVenta debe usarse dentro de un VentaProvider");
  return ctx;
}