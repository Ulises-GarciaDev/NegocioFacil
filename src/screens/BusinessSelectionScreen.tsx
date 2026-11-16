import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";

type TipoNegocio = "verduleria" | "carniceria" | "abarrotes";

type Negocio = {
  id: TipoNegocio;
  nombre: string;
  descripcion: string;
  icono: keyof typeof MaterialCommunityIcons.glyphMap;
};

const negocios: Negocio[] = [
  {
    id: "verduleria",
    nombre: "Verdulería",
    descripcion: "Productos por peso y por pieza.",
    icono: "leaf",
  },
  {
    id: "carniceria",
    nombre: "Carnicería",
    descripcion: "Cortes, pesos y existencias.",
    icono: "food-steak",
  },
  {
    id: "abarrotes",
    nombre: "Abarrotes",
    descripcion: "Productos, ventas y reposición.",
    icono: "storefront-outline",
  },
];

export default function BusinessSelectionScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [seleccionado, setSeleccionado] = useState<TipoNegocio>("verduleria");

  const negocioActual = negocios.find((n) => n.id === seleccionado);

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#176B54" />
        </Pressable>
        <Text style={styles.txtSimple2}>PASO 1 DE 2</Text>
      </View>

      <View>
        <Text style={styles.questionTXT}>¿Qué negocio tienes?</Text>
        <Text style={styles.subtitleTXT}>
          Verás solo las herramientas que necesitas. Puedes cambiarlo después.
        </Text>
      </View>

      <View style={styles.lista}>
        {negocios.map((negocio) => {
          const activo = negocio.id === seleccionado;
          return (
            <Pressable
              key={negocio.id}
              style={[styles.card, activo && styles.cardActiva]}
              onPress={() => setSeleccionado(negocio.id)}
            >
              <MaterialCommunityIcons
                name={negocio.icono}
                size={26}
                color={activo ? "#176B54" : "#647572"}
              />
              <View style={styles.textos}>
                <Text style={styles.nombre}>{negocio.nombre}</Text>
                <Text style={styles.descripcion}>{negocio.descripcion}</Text>
              </View>
              {activo && <Ionicons name="checkmark" size={22} color="#176B54" />}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.pie}>
        <Pressable
          style={({ pressed }) => [styles.boton, pressed && styles.botonPressed]}
          onPress={() => navigation.navigate("BusinessSetup", { tipoNegocio: seleccionado })}
        >
          <Text style={styles.botonTexto}>
            Continuar con {negocioActual?.nombre.toLowerCase()}
          </Text>
        </Pressable>
        <Text style={styles.pieTexto}>Una misma aplicación. Adaptada a ti.</Text>
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
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 30,
    marginLeft: 20,
    width: 200,
  },
  txtSimple2: {
    fontSize: 16,
    fontWeight: "900",
    color: "#176B54",
    marginLeft: 20,
  },
  questionTXT: {
    fontSize: 30,
    fontWeight: "800",
    marginTop: 40,
    color: "#172C2A",
    marginLeft: 20,
  },
  subtitleTXT: {
    maxWidth: 300,
    fontSize: 17,
    color: "#647572",
    marginTop: 30,
    marginLeft: 20,
    fontWeight: "400",
  },
  lista: {
    gap: 12,
    marginTop: 24,
    marginHorizontal: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
  },
  cardActiva: {
    backgroundColor: "#E8F5EF",
    borderColor: "#176B54",
  },
  textos: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "700",
    color: "#172C2A",
  },
  descripcion: {
    fontSize: 13,
    color: "#647572",
    marginTop: 4,
  },
  pie: {
    marginTop: "auto",
    marginHorizontal: 20,
    marginBottom: 16,
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