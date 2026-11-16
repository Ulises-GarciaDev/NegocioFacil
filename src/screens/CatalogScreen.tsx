import { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { obtenerProductos, type Producto } from "../database/productos";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";


type Filtro = "todos" | "bajas";

const esBajo = (p: Producto) => p.existencias <= p.stock_minimo;

function detalle(p: Producto) {
  const stock = p.unidad === "kg" ? `${p.existencias} kg` : `${p.existencias} pzas`;
  return `${p.categoria} · $${p.precio.toFixed(2)} / ${p.unidad} · ${stock}`;
}

export default function CatalogScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  // Se ejecuta cada vez que la pantalla toma foco (no solo la primera vez)
  useFocusEffect(
    useCallback(() => {
      async function cargar() {
        const lista = await obtenerProductos();
        setProductos(lista);
      }
      cargar();
    }, [])
  );

  const bajos = productos.filter(esBajo).length;

  const visibles = productos.filter((p) => {
    const coincide = p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase());
    return coincide && (filtro === "todos" || esBajo(p));
  });

  return (
    <SafeAreaView style={styles.main} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#647572" />
        </Pressable>
        <Text style={styles.titulo}>Catálogo</Text>
      </View>
      <Text style={styles.subtitulo}>{productos.length} productos</Text>

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

      <View style={styles.chips}>
        <Pressable
          style={[styles.chip, styles.chipVerde, filtro === "todos" && styles.chipVerdeActivo]}
          onPress={() => setFiltro("todos")}
        >
          <Text style={styles.chipVerdeTexto}>Todos</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, styles.chipAmbar, filtro === "bajas" && styles.chipAmbarActivo]}
          onPress={() => setFiltro("bajas")}
        >
          <Text style={styles.chipAmbarTexto}>Bajas · {bajos}</Text>
        </Pressable>
      </View>

      <FlatList
        data={visibles}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vacio}>No hay productos que mostrar</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => navigation.navigate("ProductForm", { productoId: item.id })}
          >
            <Ionicons name="cube-outline" size={24} color="#647572" />
            <View style={styles.textos}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.detalle}>{detalle(item)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#647572" />
          </Pressable>
        )}
      />

      <View style={styles.pie}>
        <Pressable
          style={({ pressed }) => [styles.boton, pressed && styles.botonPressed]}
            onPress={() => navigation.navigate("ProductForm")}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.botonTexto}>Registrar producto</Text>
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
    fontSize: 28,
    fontWeight: "800",
    color: "#172C2A",
  },
  subtitulo: {
    fontSize: 14,
    color: "#647572",
    marginTop: 8,
    marginHorizontal: 20,
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
    marginTop: 16,
    marginHorizontal: 20,
  },
  buscadorInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#172C2A",
  },
  chips: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    marginHorizontal: 20,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipVerde: {
    backgroundColor: "#E4F2EC",
    borderColor: "#E4F2EC",
  },
  chipVerdeActivo: {
    borderColor: "#176B54",
  },
  chipVerdeTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#176B54",
  },
  chipAmbar: {
    backgroundColor: "#FEF3DC",
    borderColor: "#FEF3DC",
  },
  chipAmbarActivo: {
    borderColor: "#92600A",
  },
  chipAmbarTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92600A",
  },
  lista: {
    padding: 20,
    gap: 10,
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
  vacio: {
    textAlign: "center",
    color: "#647572",
    marginTop: 40,
  },
  pie: {
    paddingHorizontal: 20,
    paddingVertical: 12,
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