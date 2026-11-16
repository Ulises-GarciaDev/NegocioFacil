import { useState } from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type Opcion = { valor: string; texto: string };

type Props = {
  label: string;
  valor: string;
  opciones: Opcion[];
  onChange: (valor: string) => void;
  error?: string;
};

export default function Selector({ label, valor, opciones, onChange, error }: Props) {
  const [abierto, setAbierto] = useState(false);
  const seleccionada = opciones.find((o) => o.valor === valor);

  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={[styles.caja, error && styles.cajaError]}
        onPress={() => setAbierto(true)}
      >
        <Text style={seleccionada ? styles.texto : styles.placeholder}>
          {seleccionada ? seleccionada.texto : "Selecciona una opción"}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#647572" />
      </Pressable>
      {error && <Text style={styles.errorTexto}>{error}</Text>}

      <Modal
        visible={abierto}
        transparent
        animationType="fade"
        onRequestClose={() => setAbierto(false)}
      >
        <Pressable style={styles.fondo} onPress={() => setAbierto(false)}>
          <View style={styles.hoja}>
            <Text style={styles.hojaTitulo}>{label}</Text>
            {opciones.map((o) => (
              <Pressable
                key={o.valor}
                style={styles.opcion}
                onPress={() => {
                  onChange(o.valor);
                  setAbierto(false);
                }}
              >
                <Text style={[styles.opcionTexto, o.valor === valor && styles.opcionActiva]}>
                  {o.texto}
                </Text>
                {o.valor === valor && (
                  <Ionicons name="checkmark" size={20} color="#176B54" />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  campo: { marginTop: 16 },
  label: { fontSize: 14, color: "#647572", marginBottom: 8 },
  caja: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cajaError: { borderColor: "#DC2626" },
  texto: { fontSize: 16, color: "#172C2A" },
  placeholder: { fontSize: 16, color: "#9CA3AF" },
  errorTexto: { color: "#DC2626", fontSize: 13, marginTop: 6 },
  fondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  hoja: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
  },
  hojaTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#172C2A",
    marginBottom: 8,
  },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  opcionTexto: { fontSize: 16, color: "#172C2A" },
  opcionActiva: { fontWeight: "700", color: "#176B54" },
});