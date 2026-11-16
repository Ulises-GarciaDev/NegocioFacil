import type { TipoNegocio } from "../types/negocio";

export type ProductoEjemplo = {
  nombre: string;
  categoria: string;
  precio: number;
  existencias: number;
};

type ConfigNegocio = {
  nombre: string;
  unidadDefault: "kg" | "pieza";
  categorias: string[];
  productosEjemplo: ProductoEjemplo[];
};

export const configNegocios: Record<TipoNegocio, ConfigNegocio> = {
  verduleria: {
    nombre: "Verdulería",
    unidadDefault: "kg",
    categorias: ["Verduras", "Frutas", "Tubérculos", "Hierbas"],
    productosEjemplo: [
      { nombre: "Jitomate saladet", categoria: "Verduras", precio: 28, existencias: 18 },
      { nombre: "Cebolla blanca", categoria: "Verduras", precio: 22, existencias: 35 },
      { nombre: "Papa blanca", categoria: "Tubérculos", precio: 24, existencias: 32 },
      { nombre: "Zanahoria", categoria: "Verduras", precio: 18, existencias: 30 },
      { nombre: "Limón sin semilla", categoria: "Frutas", precio: 32, existencias: 25 },
      { nombre: "Aguacate Hass", categoria: "Frutas", precio: 60, existencias: 18 },
      { nombre: "Plátano", categoria: "Frutas", precio: 24, existencias: 3 },
      { nombre: "Manzana", categoria: "Frutas", precio: 42, existencias: 22 },
      { nombre: "Chile serrano", categoria: "Verduras", precio: 38, existencias: 4 },
      { nombre: "Cilantro", categoria: "Hierbas", precio: 8, existencias: 2 },
    ],
  },
  carniceria: {
    nombre: "Carnicería",
    unidadDefault: "kg",
    categorias: ["Res", "Pollo", "Cerdo", "Embutidos"],
    productosEjemplo: [
      { nombre: "Bistec de res", categoria: "Res", precio: 180, existencias: 15 },
      { nombre: "Carne molida", categoria: "Res", precio: 140, existencias: 12 },
      { nombre: "Costilla de res", categoria: "Res", precio: 165, existencias: 8 },
      { nombre: "Pechuga de pollo", categoria: "Pollo", precio: 110, existencias: 20 },
      { nombre: "Pierna de pollo", categoria: "Pollo", precio: 85, existencias: 18 },
      { nombre: "Chuleta de cerdo", categoria: "Cerdo", precio: 125, existencias: 10 },
      { nombre: "Longaniza", categoria: "Embutidos", precio: 130, existencias: 3 },
      { nombre: "Chorizo", categoria: "Embutidos", precio: 120, existencias: 4 },
      { nombre: "Tocino", categoria: "Embutidos", precio: 190, existencias: 2 },
    ],
  },
  abarrotes: {
    nombre: "Abarrotes",
    unidadDefault: "pieza",
    categorias: ["Bebidas", "Lácteos", "Botanas", "Despensa", "Panadería", "Enlatados"],
    productosEjemplo: [
      { nombre: "Refresco 600 ml", categoria: "Bebidas", precio: 18, existencias: 48 },
      { nombre: "Leche 1 L", categoria: "Lácteos", precio: 28, existencias: 36 },
      { nombre: "Galletas", categoria: "Botanas", precio: 15, existencias: 30 },
      { nombre: "Aceite 1 L", categoria: "Despensa", precio: 45, existencias: 20 },
      { nombre: "Arroz 1 kg", categoria: "Despensa", precio: 32, existencias: 25 },
      { nombre: "Frijol 1 kg", categoria: "Despensa", precio: 38, existencias: 22 },
      { nombre: "Pan de caja", categoria: "Panadería", precio: 42, existencias: 23 },
      { nombre: "Huevo 12 pzas", categoria: "Lácteos", precio: 65, existencias: 23 },
      { nombre: "Atún en lata", categoria: "Enlatados", precio: 22, existencias: 20 },
    ],
  },
};