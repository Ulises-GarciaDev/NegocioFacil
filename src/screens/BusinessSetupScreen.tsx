import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  type KeyboardTypeOptions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import type { TipoNegocio } from "../types/negocio";
import { guardarNegocio } from "../database/negocio";

const nombresNegocio: Record<TipoNegocio, string> = {
  verduleria: "Verdulería",
  carniceria: "Carnicería",
  abarrotes: "Abarrotes",
};

type Errores = {
  nombre?: string;
  propietario?: string;
  direccion?: string;
};

type CampoProps = {
  label: string;
  value: string;
  onChangeText: (texto: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
};

// Va FUERA del componente principal, si no, el teclado se cierra en cada letra
function Campo({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  error,
}: CampoProps) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
      />
      {error && <Text style={styles.errorTexto}>{error}</Text>}
    </View>
  );
}

export default function BusinessSetupScreen({
  route,
}: NativeStackScreenProps<RootStackParamList, "BusinessSetup">) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { tipoNegocio } = route.params;

  const [nombreNegocio, setNombreNegocio] = useState("");
  const [propietario, setPropietario] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errores, setErrores] = useState<Errores>({});

  const guardar = async () => {
  const nuevos: Errores = {};

  if (!nombreNegocio.trim()) nuevos.nombre = "Escribe el nombre del negocio";
  if (!propietario.trim()) nuevos.propietario = "Escribe el nombre del propietario";
  if (!direccion.trim()) nuevos.direccion = "Escribe la dirección";

  setErrores(nuevos);
  if (Object.keys(nuevos).length > 0) return;

  try {
    await guardarNegocio({
      tipo: tipoNegocio,
      nombre: nombreNegocio.trim(),
      propietario: propietario.trim(),
      direccion: direccion.trim(),
      telefono: telefono.trim(),
    });
    navigation.reset({ index: 0, routes: [{ name: "Main" }] });
  } catch (e) {
    console.error("No se pudo guardar el negocio", e);
  }
};

  return (
    <SafeAreaView style={styles.main}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#647572" />
          </Pressable>
          <Text style={styles.titulo}>Configuración</Text>
        </View>

        <Text style={styles.paso}>
          PASO 2 DE 2 · {nombresNegocio[tipoNegocio]}
        </Text>
        <Text style={styles.seccion}>Cuéntanos de tu negocio</Text>

        <Campo
          label="Nombre del negocio"
          value={nombreNegocio}
          onChangeText={setNombreNegocio}
          placeholder="La Huerta"
          error={errores.nombre}
        />
        <Campo
          label="Nombre del propietario"
          value={propietario}
          onChangeText={setPropietario}
          placeholder="María López"
          error={errores.propietario}
        />

        <View style={styles.campo}>
          <Text style={styles.label}>Moneda</Text>
          <View style={[styles.input, styles.moneda]}>
            <Text style={styles.monedaTexto}>Peso mexicano · MXN</Text>
            <Ionicons name="chevron-down" size={16} color="#647572" />
          </View>
        </View>

        <Campo
          label="Dirección del establecimiento"
          value={direccion}
          onChangeText={setDireccion}
          placeholder="Av. Juárez 125, Centro"
          error={errores.direccion}
        />
        <Campo
          label="Teléfono del negocio · opcional"
          value={telefono}
          onChangeText={setTelefono}
          placeholder="55 1234 5678"
          keyboardType="phone-pad"
        />

        <View style={styles.pie}>
          <Pressable
            style={({ pressed }) => [styles.boton, pressed && styles.botonPressed]}
            onPress={guardar}
          >
            <Text style={styles.botonTexto}>Guardar y comenzar</Text>
          </Pressable>
          <Text style={styles.pieTexto}>
            Puedes editar estos datos en tu perfil.
          </Text>
        </View>
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#172C2A",
  },
  paso: {
    fontSize: 14,
    color: "#647572",
    marginTop: 16,
  },
  seccion: {
    fontSize: 20,
    fontWeight: "700",
    color: "#172C2A",
    marginTop: 28,
    marginBottom: 8,
  },
  campo: {
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    color: "#647572",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#172C2A",
  },
  inputError: {
    borderColor: "#DC2626",
  },
  errorTexto: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 6,
  },
  moneda: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monedaTexto: {
    fontSize: 16,
    color: "#172C2A",
  },
  pie: {
    marginTop: "auto",
    paddingTop: 32,
    alignItems: "center",
    gap: 12,
  },
  boton: {
    width: "100%",
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
  pieTexto: {
    fontSize: 12,
    color: "#647572",
  },
});