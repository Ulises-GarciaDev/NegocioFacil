import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { registrarVenta } from "../database/ventas";
import { useVenta } from "../context/VentaContext";

const redondear = (n: number, decimales: number) => {
  const f = 10 ** decimales;
  return Math.round(n * f) / f;
};

const dinero = (n: number) =>
  "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function ConfirmSaleScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { items, total, limpiarVenta } = useVenta();

  // Arranca con el total exacto: si pagan justo, no hay que escribir nada
  const [recibidoTexto, setRecibidoTexto] = useState(total.toFixed(2));
  const [guardando, setGuardando] = useState(false);

  const recibido = Number(recibidoTexto.replace(",", "."));
  const recibidoValido =
    recibidoTexto.trim() !== "" && !isNaN(recibido) && recibido >= total;
  const cambio = recibidoValido ? redondear(recibido - total, 2) : 0;
  const bloqueado = items.length === 0 || !recibidoValido || guardando;

  const confirmar = async () => {
    if (bloqueado) return;
    setGuardando(true);
    try {
      await registrarVenta(items);
      navigation.replace("VentaRegistrada", { total });
      limpiarVenta();
    } catch (e) {
      console.error("No se pudo registrar la venta", e);
      Alert.alert(
        "No se pudo registrar la venta",
        e instanceof Error ? e.message : "Intenta de nuevo"
      );
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#647572" />
        </Pressable>
        <Text style={styles.titulo}>Confirmar venta</Text>
      </View>
      <Text style={styles.subtitulo}>Revisa el importe antes de registrar.</Text>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cardTotal}>
          <Text style={styles.label}>Total a cobrar</Text>
          <Text style={styles.totalGrande}>{dinero(total)}</Text>
          <Text style={styles.nota}>
            MXN · {items.length} {items.length === 1 ? "producto" : "productos"}
          </Text>
          <View style={styles.linea} />
          <Text style={styles.metodo}>Pago en efectivo</Text>
        </View>

        <View>
          <Text style={styles.label}>Recibido · MXN</Text>
          <View style={[styles.caja, !recibidoValido && styles.cajaError]}>
            <Text style={styles.signo}>$</Text>
            <TextInput
              style={styles.input}
              value={recibidoTexto}
              onChangeText={setRecibidoTexto}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          {!recibidoValido && (
            <Text style={styles.error}>El monto recibido no cubre el total</Text>
          )}
        </View>

        <View>
          <Text style={styles.label}>Cambio · MXN</Text>
          <View style={[styles.caja, styles.cajaLectura]}>
            <Text style={styles.signo}>{dinero(cambio)}</Text>
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoTexto}>
            Al confirmar se registra el ingreso y se descuentan las existencias.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.pie}>
        <Pressable
          disabled={bloqueado}
          style={({ pressed }) => [
            styles.boton,
            pressed && styles.botonPressed,
            bloqueado && styles.botonDeshabilitado,
          ]}
          onPress={confirmar}
        >
          <Text style={styles.botonTexto}>
            Confirmar venta · {dinero(total)}
          </Text>
        </Pressable>

        <Pressable style={styles.enlace} onPress={() => navigation.goBack()}>
          <Text style={styles.enlaceTexto}>Volver al resumen</Text>
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
    gap: 16,
  },
  cardTotal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  label: {
    fontSize: 14,
    color: "#647572",
    marginBottom: 8,
  },
  totalGrande: {
    fontSize: 40,
    fontWeight: "800",
    color: "#172C2A",
  },
  nota: {
    fontSize: 13,
    color: "#647572",
    marginTop: 4,
  },
  linea: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  metodo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#172C2A",
  },
  caja: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  cajaError: {
    borderColor: "#DC2626",
  },
  cajaLectura: {
    paddingVertical: 16,
  },
  signo: {
    fontSize: 16,
    color: "#172C2A",
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#172C2A",
  },
  error: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 6,
  },
  info: {
    backgroundColor: "#E4F2EC",
    borderRadius: 12,
    padding: 14,
  },
  infoTexto: {
    fontSize: 13,
    color: "#176B54",
  },
  pie: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
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
  botonDeshabilitado: {
    opacity: 0.5,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  enlace: {
    alignItems: "center",
    paddingVertical: 14,
  },
  enlaceTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#176B54",
  },
});