import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { obtenerProductos } from "../database/productos";
import { useVenta, type ItemVenta } from "../context/VentaContext";

const redondear = (n: number, decimales: number) => {
  const f = 10 ** decimales;
  return Math.round(n * f) / f;
};

const dinero = (n: number) =>
  "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// Cuánto sube o baja con cada toque de + o −
const paso = (item: ItemVenta) => (item.unidad === "kg" ? 0.25 : 1);

// Menos de 1 kg se muestra en gramos; lo demás en kg o piezas
function textoCantidad(item: ItemVenta) {
  if (item.unidad === "pieza") return `${item.cantidad} pzas`;
  return item.cantidad < 1
    ? `${Math.round(item.cantidad * 1000)} g`
    : `${item.cantidad} kg`;
}

function textoDetalle(item: ItemVenta) {
  const unidad = item.unidad === "kg" ? "kg" : "pza";
  return `${textoCantidad(item)} × $${item.precioUnitario.toFixed(2)} / ${unidad}`;
}

export default function SaleSummaryScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { items, total, actualizarCantidad, quitarItem, limpiarVenta } =
    useVenta();

  const [stock, setStock] = useState<Record<number, number>>({});
  const [aviso, setAviso] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Lee las existencias actuales para no dejar subir más de lo que hay
  useEffect(() => {
    async function cargarStock() {
      const lista = await obtenerProductos();
      const mapa: Record<number, number> = {};
      lista.forEach((p) => {
        mapa[p.id] = p.existencias;
      });
      setStock(mapa);
    }
    cargarStock();
  }, []);

  const puedeRestar = (item: ItemVenta) =>
    redondear(item.cantidad - paso(item), 3) > 0;

  const restar = (item: ItemVenta) => {
    if (!puedeRestar(item)) return;
    setAviso("");
    actualizarCantidad(item.productoId, redondear(item.cantidad - paso(item), 3));
  };

  const sumar = (item: ItemVenta) => {
    const nueva = redondear(item.cantidad + paso(item), 3);
    const maximo = stock[item.productoId] ?? 0;
    if (nueva > maximo) {
      setAviso(`No hay más existencias de ${item.nombre}`);
      return;
    }
    setAviso("");
    actualizarCantidad(item.productoId, nueva);
  };

const continuar = () => {
  if (items.length === 0) return;
  navigation.navigate("ConfirmarVenta");
};

    const bloqueado = items.length === 0;
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#647572" />
        </Pressable>
        <Text style={styles.titulo}>Resumen</Text>
      </View>
      <Text style={styles.subtitulo}>
        {items.length} {items.length === 1 ? "producto" : "productos"} ·
        Importes en MXN
      </Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {items.length === 0 && (
          <Text style={styles.vacio}>No hay productos en la venta</Text>
        )}

        {items.map((item) => (
          <View key={item.productoId} style={styles.card}>
            <View style={styles.cardIzq}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.detalle}>{textoDetalle(item)}</Text>

              <View style={styles.filaControl}>
                <View style={styles.stepper}>
                  <Pressable
                    hitSlop={8}
                    onPress={() => restar(item)}
                    style={!puedeRestar(item) && styles.stepperApagado}
                  >
                    <Ionicons name="remove" size={18} color="#172C2A" />
                  </Pressable>
                  <Text style={styles.stepperTexto}>{textoCantidad(item)}</Text>
                  <Pressable hitSlop={8} onPress={() => sumar(item)}>
                    <Ionicons name="add" size={18} color="#172C2A" />
                  </Pressable>
                </View>

                <Pressable hitSlop={10} onPress={() => quitarItem(item.productoId)}>
                  <Ionicons name="trash-outline" size={20} color="#647572" />
                </Pressable>
              </View>
            </View>

            <Text style={styles.subtotal}>{dinero(item.subtotal)}</Text>
          </View>
        ))}

        {aviso !== "" && <Text style={styles.aviso}>{aviso}</Text>}

        <Pressable style={styles.agregarOtro} onPress={() => navigation.goBack()}>
          <Ionicons name="add" size={18} color="#176B54" />
          <Text style={styles.agregarOtroTexto}>Agregar otro producto</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.pie}>
        <View style={styles.filaTotales}>
          <Text style={styles.subLabel}>Subtotal</Text>
          <Text style={styles.subValor}>{dinero(total)}</Text>
        </View>
        <View style={styles.filaTotales}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValor}>{dinero(total)}</Text>
        </View>

        <Pressable
          disabled={bloqueado}
          style={({ pressed }) => [
            styles.boton,
            pressed && styles.botonPressed,
            bloqueado && styles.botonDeshabilitado,
          ]}
          onPress={continuar}
        >
          <Text style={styles.botonTexto}>Continuar al cobro</Text>
        </Pressable>
      </View>
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
    gap: 12,
  },
  vacio: {
    textAlign: "center",
    color: "#647572",
    marginTop: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  cardIzq: {
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
  filaControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 12,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    backgroundColor: "#F5F7F6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  stepperApagado: {
    opacity: 0.3,
  },
  stepperTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#172C2A",
    minWidth: 52,
    textAlign: "center",
  },
  subtotal: {
    fontSize: 18,
    fontWeight: "800",
    color: "#172C2A",
  },
  aviso: {
    color: "#92600A",
    fontSize: 13,
    textAlign: "center",
  },
  agregarOtro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
  },
  agregarOtroTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#176B54",
  },
  pie: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#F5F7F6",
  },
  filaTotales: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 14,
    color: "#647572",
  },
  subValor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#172C2A",
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "800",
    color: "#172C2A",
  },
  totalValor: {
    fontSize: 28,
    fontWeight: "800",
    color: "#172C2A",
  },
  boton: {
    backgroundColor: "#176B54",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  botonPressed: {
    backgroundColor: "#125240",
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});