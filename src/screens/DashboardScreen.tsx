import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";


// ---- DATOS DE EJEMPLO (luego vendrán de SQLite) ----
const negocioNombre = "La Huerta";
const giro = "Verdulería";
const propietario = "María";
const ventasHoy = 3840;
const operacionesHoy = 38;
const totalProductos = 42;
const productosBajos = 3;
const ventasPorHora = [
  { hora: "9 h", monto: 300 },
  { hora: "10", monto: 520 },
  { hora: "11", monto: 410 },
  { hora: "12", monto: 780 },
  { hora: "13", monto: 640 },
  { hora: "14", monto: 910 },
  { hora: "15", monto: 700 },
];
// -----------------------------------------------------

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function fechaHoy() {
  const d = new Date();
  return `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

function formatoMoneda(n: number) {
  return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function DashboardScreen() {
    const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const maxMonto = Math.max(...ventasPorHora.map((v) => v.monto));

  return (
    <SafeAreaView style={styles.main} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View>
            <Text style={styles.etiqueta}>
              {giro.toUpperCase()} / {negocioNombre.toUpperCase()}
            </Text>
            <Text style={styles.saludo}>Hola, {propietario}</Text>
            <Text style={styles.fecha}>{fechaHoy()}</Text>
          </View>
          <Ionicons name="person-outline" size={26} color="#647572" />
        </View>

        {/* Ventas de hoy */}
        <View style={styles.cardVerde}>
          <Text style={styles.cardVerdeLabel}>Ventas de hoy</Text>
          <Text style={styles.cardVerdeMonto}>{formatoMoneda(ventasHoy)}</Text>
          <Text style={styles.cardVerdeNota}>MXN · Corte a las 18:00</Text>
        </View>

        {/* Operaciones y productos */}
        <View style={styles.fila}>
          <View style={styles.cardStat}>
            <Text style={styles.statLabel}>Operaciones</Text>
            <Text style={styles.statNumero}>{operacionesHoy}</Text>
          </View>
          <View style={styles.cardStat}>
            <Text style={styles.statLabel}>Productos</Text>
            <Text style={styles.statNumero}>{totalProductos}</Text>
          </View>
        </View>

        {/* Alerta de existencias bajas */}
        {productosBajos > 0 && (
          <View style={styles.alerta}>
            <Ionicons name="warning-outline" size={28} color="#92600A" />
            <View style={styles.alertaTextos}>
              <Text style={styles.alertaTitulo}>
                {productosBajos} productos con existencias bajas
              </Text>
              <Text style={styles.alertaSub}>Revisa y registra una entrada</Text>
            </View>
          </View>
        )}

        {/* Gráfica */}
        <View style={styles.cardGrafica}>
          <Text style={styles.graficaTitulo}>Ventas de hoy</Text>
          <Text style={styles.graficaSub}>MXN</Text>

          <View style={styles.barras}>
            {ventasPorHora.map((v, i) => {
              const esUltima = i === ventasPorHora.length - 1;
              return (
                <View key={v.hora} style={styles.barraColumna}>
                  <View
                    style={[
                      styles.barra,
                      { height: (v.monto / maxMonto) * 100 },
                      esUltima && styles.barraActiva,
                    ]}
                  />
                  <Text style={styles.barraHora}>{v.hora}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Botón */}
        <Pressable
          style={({ pressed }) => [styles.boton, pressed && styles.botonPressed]}
          onPress={() => navigation.navigate("NuevaVenta")}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.botonTexto}>Nueva venta</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#F5F7F6",
  },
  scroll: {
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  etiqueta: {
    fontSize: 12,
    fontWeight: "700",
    color: "#176B54",
  },
  saludo: {
    fontSize: 30,
    fontWeight: "800",
    color: "#172C2A",
    marginTop: 8,
  },
  fecha: {
    fontSize: 15,
    color: "#647572",
    marginTop: 4,
  },
  cardVerde: {
    backgroundColor: "#176B54",
    borderRadius: 20,
    padding: 20,
  },
  cardVerdeLabel: {
    fontSize: 15,
    color: "#fff",
  },
  cardVerdeMonto: {
    fontSize: 40,
    fontWeight: "800",
    color: "#fff",
    marginTop: 8,
  },
  cardVerdeNota: {
    fontSize: 12,
    color: "#C9E4DA",
    marginTop: 8,
  },
  fila: {
    flexDirection: "row",
    gap: 12,
  },
  cardStat: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  statLabel: {
    fontSize: 14,
    color: "#647572",
  },
  statNumero: {
    fontSize: 32,
    fontWeight: "800",
    color: "#172C2A",
    marginTop: 8,
  },
  alerta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FEF3DC",
    borderRadius: 14,
    padding: 16,
  },
  alertaTextos: {
    flex: 1,
  },
  alertaTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#92600A",
  },
  alertaSub: {
    fontSize: 13,
    color: "#92600A",
    marginTop: 2,
  },
  cardGrafica: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  graficaTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#172C2A",
  },
  graficaSub: {
    fontSize: 12,
    color: "#647572",
    marginTop: 4,
  },
  barras: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 130,
    marginTop: 16,
  },
  barraColumna: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  barra: {
    width: 28,
    backgroundColor: "#E4F2EC",
    borderRadius: 4,
  },
  barraActiva: {
    backgroundColor: "#176B54",
  },
  barraHora: {
    fontSize: 12,
    color: "#647572",
  },
  boton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#176B54",
    paddingVertical: 16,
    borderRadius: 12,
  },
  botonPressed: {
    backgroundColor: "#125240",
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});