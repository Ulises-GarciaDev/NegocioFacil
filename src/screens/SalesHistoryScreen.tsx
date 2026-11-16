
import { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import {
  obtenerHistorialVentas,
  obtenerDetalleVenta,
  type VentaHistorial,
  type DetalleVenta,
} from "../database/ventas";

const dinero = (n: number) =>
  "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function formatoFecha(fecha: string) {
  const [dia, hora] = fecha.split(" ");
  const [anio, mes, numeroDia] = dia.split("-").map(Number);
  const [horas, minutos] = hora.split(":");

  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];

  return `${numeroDia} de ${meses[mes - 1]} de ${anio} · ${horas}:${minutos}`;
}

function formatoCantidad(item: DetalleVenta) {
  if (item.unidad === "pieza") {
    return `${item.cantidad} pzas`;
  }

  return item.cantidad < 1
    ? `${Math.round(item.cantidad * 1000)} g`
    : `${item.cantidad} kg`;
}

export default function SalesHistoryScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [ventas, setVentas] = useState<VentaHistorial[]>([]);
  const [detalles, setDetalles] = useState<Record<number, DetalleVenta[]>>({});
  const [ventaExpandida, setVentaExpandida] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoDetalle, setCargandoDetalle] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      let activo = true;

      async function cargarHistorial() {
        try {
          setCargando(true);
          const resultado = await obtenerHistorialVentas();

          if (activo) {
            setVentas(resultado);
          }
        } catch (error) {
          console.error("Error al cargar el historial:", error);
          if (activo) {
            Alert.alert("Error", "No se pudo cargar el historial de ventas.");
          }
        } finally {
          if (activo) setCargando(false);
        }
      }

      cargarHistorial();

      return () => {
        activo = false;
      };
    }, [])
  );

  async function alternarDetalle(ventaId: number) {
    if (ventaExpandida === ventaId) {
      setVentaExpandida(null);
      return;
    }

    setVentaExpandida(ventaId);

    if (detalles[ventaId]) return;

    try {
      setCargandoDetalle(ventaId);
      const resultado = await obtenerDetalleVenta(ventaId);

      setDetalles((actuales) => ({
        ...actuales,
        [ventaId]: resultado,
      }));
    } catch (error) {
      console.error("Error al cargar el detalle:", error);
      Alert.alert("Error", "No se pudo cargar el detalle de esta venta.");
      setVentaExpandida(null);
    } finally {
      setCargandoDetalle(null);
    }
  }

  return (
    <SafeAreaView style={styles.main} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={26} color="#647572" />
        </Pressable>

        <View style={styles.headerTextos}>
          <Text style={styles.titulo}>Historial de ventas</Text>
          <Text style={styles.subtitulo}>
            Consulta las operaciones de tu negocio
          </Text>
        </View>
      </View>

      {cargando ? (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color="#176B54" />
          <Text style={styles.mensaje}>Cargando ventas...</Text>
        </View>
      ) : ventas.length === 0 ? (
        <View style={styles.centrado}>
          <Ionicons name="receipt-outline" size={48} color="#AAB7B2" />
          <Text style={styles.vacioTitulo}>Todavía no hay ventas</Text>
          <Text style={styles.mensaje}>
            Cuando registres una venta, aparecerá aquí.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.lista}>
          <Text style={styles.totalRegistros}>
            {ventas.length} {ventas.length === 1 ? "venta registrada" : "ventas registradas"}
          </Text>

          {ventas.map((venta) => {
            const expandida = ventaExpandida === venta.id;

            return (
              <View key={venta.id} style={styles.card}>
                <Pressable
                  style={styles.cardPrincipal}
                  onPress={() => alternarDetalle(venta.id)}
                >
                  <View style={styles.iconoVenta}>
                    <Ionicons name="receipt-outline" size={22} color="#176B54" />
                  </View>

                  <View style={styles.infoVenta}>
                    <Text style={styles.numeroVenta}>
                      Venta #{String(venta.id).padStart(4, "0")}
                    </Text>
                    <Text style={styles.fecha}>
                      {formatoFecha(venta.fecha)}
                    </Text>
                    <Text style={styles.productos}>
                      {venta.cantidadProductos}{" "}
                      {venta.cantidadProductos === 1 ? "producto" : "productos"}
                    </Text>
                  </View>

                  <View style={styles.totalVenta}>
                    <Text style={styles.monto}>{dinero(venta.total)}</Text>
                    <Ionicons
                      name={expandida ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#647572"
                    />
                  </View>
                </Pressable>

                {expandida && (
                  <View style={styles.detalle}>
                    <View style={styles.separador} />

                    {cargandoDetalle === venta.id ? (
                      <ActivityIndicator color="#176B54" />
                    ) : (
                      (detalles[venta.id] ?? []).map((item) => (
                        <View key={item.id} style={styles.filaDetalle}>
                          <View style={styles.detalleInfo}>
                            <Text style={styles.nombreProducto}>
                              {item.nombre ?? "Producto no disponible"}
                            </Text>
                            <Text style={styles.detalleSecundario}>
                              {formatoCantidad(item)} × {dinero(item.precio_unitario)}
                            </Text>
                          </View>
                          <Text style={styles.subtotal}>
                            {dinero(item.subtotal)}
                          </Text>
                        </View>
                      ))
                    )}

                    <View style={styles.separador} />

                    <View style={styles.filaTotal}>
                      <Text style={styles.totalLabel}>Total de la venta</Text>
                      <Text style={styles.totalFinal}>{dinero(venta.total)}</Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
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
    gap: 14,
    padding: 20,
  },
  headerTextos: {
    flex: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "800",
    color: "#172C2A",
  },
  subtitulo: {
    fontSize: 13,
    color: "#647572",
    marginTop: 4,
  },
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  totalRegistros: {
    color: "#647572",
    fontSize: 14,
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  cardPrincipal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconoVenta: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EAF4EF",
    alignItems: "center",
    justifyContent: "center",
  },
  infoVenta: {
    flex: 1,
  },
  numeroVenta: {
    fontSize: 16,
    fontWeight: "700",
    color: "#172C2A",
  },
  fecha: {
    fontSize: 12,
    color: "#647572",
    marginTop: 4,
  },
  productos: {
    fontSize: 12,
    color: "#647572",
    marginTop: 3,
  },
  totalVenta: {
    alignItems: "flex-end",
    gap: 8,
  },
  monto: {
    fontSize: 16,
    fontWeight: "800",
    color: "#176B54",
  },
  detalle: {
    marginTop: 14,
  },
  separador: {
    height: 1,
    backgroundColor: "#E8EDEA",
    marginVertical: 12,
  },
  filaDetalle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 7,
  },
  detalleInfo: {
    flex: 1,
  },
  nombreProducto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#172C2A",
  },
  detalleSecundario: {
    fontSize: 12,
    color: "#647572",
    marginTop: 3,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#172C2A",
  },
  filaTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#647572",
  },
  totalFinal: {
    fontSize: 18,
    fontWeight: "800",
    color: "#176B54",
  },
  centrado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  vacioTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#172C2A",
    marginTop: 14,
  },
  mensaje: {
    color: "#647572",
    textAlign: "center",
    marginTop: 8,
  },
});
