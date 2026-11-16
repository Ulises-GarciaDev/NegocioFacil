import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { obtenerNegocio } from "../database/negocio";
import { obtenerProductos, type Producto } from "../database/productos";
import { siguienteNumeroVenta } from "../database/ventas";
import { useVenta } from "../context/VentaContext";

type UnidadVenta = "g" | "kg";

const redondear = (n: number, decimales: number) => {
  const f = 10 ** decimales;
  return Math.round(n * f) / f;
};

const dinero = (n: number) => "$" + n.toFixed(2);

function detalle(p: Producto) {
  const stock = p.unidad === "kg" ? `${p.existencias} kg` : `${p.existencias} pzas`;
  return `${p.categoria} · $${p.precio.toFixed(2)} / ${p.unidad} · ${stock}`;
}

type ChipProps = { texto: string; activo: boolean; onPress: () => void };

function Chip({ texto, activo, onPress }: ChipProps) {
  return (
    <Pressable
      style={[styles.chip, activo && styles.chipActivo]}
      onPress={onPress}
    >
      <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>
        {texto}
      </Text>
    </Pressable>
  );
}

export default function NewSaleScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { items, total, agregarItem,limpiarVenta } = useVenta();

  const [nombreNegocio, setNombreNegocio] = useState("");
  const [numeroVenta, setNumeroVenta] = useState(1);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null); // null = Todos
  const [cantidadTexto, setCantidadTexto] = useState("");
  const [unidadVenta, setUnidadVenta] = useState<UnidadVenta>("kg");
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      limpiarVenta();
      const negocio = await obtenerNegocio();
      if (negocio) setNombreNegocio(negocio.nombre);
      setNumeroVenta(await siguienteNumeroVenta());

      const lista = await obtenerProductos();
      setProductos(lista);
      if (lista.length > 0) setSeleccionadoId(lista[0].id);
    }
    cargar();
  }, []);

  const producto = productos.find((p) => p.id === seleccionadoId) ?? null;
  const categorias = Array.from(new Set(productos.map((p) => p.categoria)));

  const otros = productos.filter((p) => {
    if (p.id === seleccionadoId) return false;
    const coincide = p.nombre
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase());
    return coincide && (categoria === null || p.categoria === categoria);
  });

  // ---- Cálculos de la cantidad ----
  const esKg = producto?.unidad === "kg";
  const etiquetaUnidad = esKg ? "kg" : "pzas";
  const numero = Number(cantidadTexto.replace(",", "."));
  const numeroValido =
    cantidadTexto.trim() !== "" && !isNaN(numero) && numero > 0;

  // Todo se guarda en kg o piezas; los gramos se convierten aquí
  const cantidadBase =
    producto && numeroValido
      ? redondear(esKg && unidadVenta === "g" ? numero / 1000 : numero, 3)
      : 0;
  const subtotal = producto ? redondear(cantidadBase * producto.precio, 2) : 0;

  const enCarrito =
    items.find((i) => i.productoId === producto?.id)?.cantidad ?? 0;
  const disponible = producto
    ? redondear(producto.existencias - enCarrito, 3)
    : 0;

  function textoResumen() {
    if (!producto) return "";
    const pu = dinero(producto.precio);
    if (!numeroValido) return `${pu} / ${producto.unidad}`;
    if (esKg && unidadVenta === "g")
      return `${numero} g = ${cantidadBase} kg · ${pu}`;
    return `${numero} ${etiquetaUnidad} · ${pu} / ${producto.unidad}`;
  }

  const elegir = (p: Producto) => {
    setSeleccionadoId(p.id);
    setCantidadTexto("");
    setError("");
  };

  const agregar = () => {
    if (!producto) return;

    if (!numeroValido) {
      setError("Escribe una cantidad válida");
      return;
    }
    if (producto.unidad === "pieza" && !Number.isInteger(numero)) {
      setError("Las piezas deben ser un número entero");
      return;
    }
    if (cantidadBase > disponible) {
      setError(
        disponible <= 0
          ? "Este producto no tiene existencias"
          : `Solo quedan ${disponible} ${etiquetaUnidad} disponibles`
      );
      return;
    }

    agregarItem({
      productoId: producto.id,
      nombre: producto.nombre,
      unidad: producto.unidad,
      cantidad: cantidadBase,
      precioUnitario: producto.precio,
    });
    setCantidadTexto("");
    setError("");
    navigation.navigate("ResumenVenta");
    // Cuando hagamos la pantalla de resumen, aquí irá la navegación
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#647572" />
        </Pressable>
        <Text style={styles.titulo}>Nueva venta</Text>
      </View>
      <Text style={styles.subtitulo}>
        Venta #{String(numeroVenta).padStart(4, "0")}
        {nombreNegocio ? ` · ${nombreNegocio}` : ""}
      </Text>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.buscador}>
          <Ionicons name="search-outline" size={20} color="#647572" />
          <TextInput
            style={styles.buscadorInput}
            placeholder="Buscar producto"
            placeholderTextColor="#9CA3AF"
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <Chip
            texto="Todos"
            activo={categoria === null}
            onPress={() => setCategoria(null)}
          />
          {categorias.map((c) => (
            <Chip
              key={c}
              texto={c}
              activo={categoria === c}
              onPress={() => setCategoria(c)}
            />
          ))}
        </ScrollView>

        {producto ? (
          <>
            <View style={styles.cardSeleccion}>
              <Ionicons name="cube-outline" size={24} color="#647572" />
              <View style={styles.textos}>
                <Text style={styles.nombre}>{producto.nombre}</Text>
                <Text style={styles.detalle}>{detalle(producto)}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={22} color="#176B54" />
            </View>

            <View style={styles.cardCantidad}>
              <Text style={styles.cardTitulo}>Cantidad a vender</Text>

              <View style={styles.filaCantidad}>
                <TextInput
                  style={styles.inputCantidad}
                  value={cantidadTexto}
                  onChangeText={(t) => {
                    setCantidadTexto(t);
                    setError("");
                  }}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                />

                {esKg ? (
                  <View style={styles.toggle}>
                    {(["g", "kg"] as UnidadVenta[]).map((u) => (
                      <Pressable
                        key={u}
                        style={[
                          styles.toggleOpcion,
                          unidadVenta === u && styles.toggleActivo,
                        ]}
                        onPress={() => setUnidadVenta(u)}
                      >
                        <Text
                          style={[
                            styles.toggleTexto,
                            unidadVenta === u && styles.toggleTextoActivo,
                          ]}
                        >
                          {u}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <View style={styles.unidadFija}>
                    <Text style={styles.toggleTextoActivo}>pzas</Text>
                  </View>
                )}
              </View>

              <View style={styles.filaTotal}>
                <Text style={styles.resumen}>{textoResumen()}</Text>
                <Text style={styles.total}>{dinero(subtotal)}</Text>
              </View>

              {error !== "" && <Text style={styles.error}>{error}</Text>}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.boton,
                pressed && styles.botonPressed,
              ]}
              onPress={agregar}
            >
              <Text style={styles.botonTexto}>Agregar a la venta</Text>
            </Pressable>

            {items.length > 0 && (
              <Text style={styles.confirmacion}>
                ✓ En la venta: {items.length}{" "}
                {items.length === 1 ? "producto" : "productos"} · {dinero(total)}
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.vacio}>
            No hay productos. Registra uno desde el Catálogo.
          </Text>
        )}

        {otros.length > 0 && (
          <>
            <Text style={styles.seccion}>También en tu catálogo</Text>
            {otros.map((p) => (
              <Pressable
                key={p.id}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => elegir(p)}
              >
                <Ionicons name="cube-outline" size={24} color="#647572" />
                <View style={styles.textos}>
                  <Text style={styles.nombre}>{p.nombre}</Text>
                  <Text style={styles.detalle}>{detalle(p)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#647572" />
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#F5F7F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "800",
    color: "#172C2A",
  },
  subtitulo: {
    fontSize: 14,
    color: "#647572",
    marginTop: 8,
    marginHorizontal: 20,
  },
  scroll: {
    padding: 20,
    gap: 14,
  },
  buscador: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  buscadorInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#172C2A",
  },
  chips: {
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  chipActivo: {
    backgroundColor: "#E4F2EC",
    borderColor: "#E4F2EC",
  },
  chipTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#647572",
  },
  chipTextoActivo: {
    color: "#176B54",
  },
  cardSeleccion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#176B54",
    borderRadius: 14,
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },
  cardPressed: {
    backgroundColor: "#F0F4F2",
  },
  textos: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "700",
    color: "#172C2A",
  },
  detalle: {
    fontSize: 13,
    color: "#647572",
    marginTop: 4,
  },
  cardCantidad: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#172C2A",
  },
  filaCantidad: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
  },
  inputCantidad: {
    flex: 1,
    backgroundColor: "#F5F7F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 24,
    fontWeight: "700",
    color: "#172C2A",
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: "#F5F7F6",
    borderRadius: 10,
    padding: 4,
  },
  toggleOpcion: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  toggleActivo: {
    backgroundColor: "#E4F2EC",
  },
  toggleTexto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#647572",
  },
  toggleTextoActivo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#176B54",
  },
  unidadFija: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#E4F2EC",
  },
  filaTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  resumen: {
    flex: 1,
    fontSize: 13,
    color: "#647572",
  },
  total: {
    fontSize: 22,
    fontWeight: "800",
    color: "#176B54",
  },
  error: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 10,
  },
  boton: {
    backgroundColor: "#E4F2EC",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  botonPressed: {
    backgroundColor: "#D3E9DF",
  },
  botonTexto: {
    color: "#176B54",
    fontSize: 16,
    fontWeight: "700",
  },
  confirmacion: {
    fontSize: 14,
    fontWeight: "600",
    color: "#176B54",
    textAlign: "center",
  },
  seccion: {
    fontSize: 15,
    fontWeight: "700",
    color: "#172C2A",
    marginTop: 6,
  },
  vacio: {
    textAlign: "center",
    color: "#647572",
    marginTop: 40,
  },
});