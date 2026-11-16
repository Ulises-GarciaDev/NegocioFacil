import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";

const MESES = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

const dinero = (n: number) =>
  "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function formatoFecha(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()} · ${hh}:${mm} · Efectivo`;
}

export default function SaleDoneScreen({
  route,
}: NativeStackScreenProps<RootStackParamList, "VentaRegistrada">) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { total } = route.params;

  // La función dentro de useState se ejecuta solo una vez, así la hora no cambia
  const [fecha] = useState(() => new Date());

  const irAlInicio = () =>
    navigation.reset({ index: 0, routes: [{ name: "Main" }] });

  const otraVenta = () =>
    navigation.reset({
      index: 1,
      routes: [{ name: "Main" }, { name: "NuevaVenta" }],
    });

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <Pressable onPress={irAlInicio}>
          <Ionicons name="arrow-back" size={26} color="#647572" />
        </Pressable>
        <Text style={styles.titulo}>Venta registrada</Text>
      </View>
      <Text style={styles.subtitulo}>Operación completada.</Text>

      <View style={styles.centro}>
        <View style={styles.circulo}>
          <Ionicons name="checkmark" size={40} color="#176B54" />
        </View>
        <Text style={styles.titulo2}>¡Venta registrada!</Text>
        <Text style={styles.texto}>El pago y tus existencias están al día.</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total cobrado</Text>
          <Text style={styles.cardTotal}>{dinero(total)} MXN</Text>
          <View style={styles.linea} />
          <Text style={styles.fecha}>{formatoFecha(fecha)}</Text>
        </View>
      </View>

      <View style={styles.pie}>
        <Pressable
          style={({ pressed }) => [styles.boton, pressed && styles.botonPressed]}
          onPress={otraVenta}
        >
          <Text style={styles.botonTexto}>Realizar otra venta</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.botonClaro,
            pressed && styles.botonClaroPressed,
          ]}
          onPress={irAlInicio}
        >
          <Text style={styles.botonClaroTexto}>Volver al inicio</Text>
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
  centro: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  circulo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#E4F2EC",
    alignItems: "center",
    justifyContent: "center",
  },
  titulo2: {
    fontSize: 26,
    fontWeight: "800",
    color: "#172C2A",
    marginTop: 24,
  },
  texto: {
    fontSize: 14,
    color: "#647572",
    marginTop: 8,
    textAlign: "center",
  },
  card: {
    alignSelf: "stretch",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 32,
  },
  cardLabel: {
    fontSize: 14,
    color: "#647572",
  },
  cardTotal: {
    fontSize: 30,
    fontWeight: "800",
    color: "#172C2A",
    marginTop: 8,
  },
  linea: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 14,
  },
  fecha: {
    fontSize: 13,
    color: "#647572",
  },
  pie: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  boton: {
    backgroundColor: "#176B54",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  botonPressed: {
    backgroundColor: "#125240",
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  botonClaro: {
    backgroundColor: "#E4F2EC",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  botonClaroPressed: {
    backgroundColor: "#D3E9DF",
  },
  botonClaroTexto: {
    color: "#176B54",
    fontSize: 16,
    fontWeight: "700",
  },
});