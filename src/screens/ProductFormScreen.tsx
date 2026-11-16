import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
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
import { configNegocios } from "../constants/negocios";
import { obtenerNegocio } from "../database/negocio";
import {
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProducto,
} from "../database/productos";
import Campo from "../components/forms/Campo";
import Selector from "../components/forms/Selector";

type Unidad = "kg" | "pieza";

type Errores = {
  nombre?: string;
  categoria?: string;
  precio?: string;
  existencias?: string;
};

const opcionesUnidad = [
  { valor: "kg", texto: "Kilogramos (kg)" },
  { valor: "pieza", texto: "Piezas" },
];

export default function ProductFormScreen({
  route,
}: NativeStackScreenProps<RootStackParamList, "ProductForm">) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const productoId = route.params?.productoId;
  const editando = productoId !== undefined;

  const [giro, setGiro] = useState<TipoNegocio | null>(null);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [existencias, setExistencias] = useState("");
  const [unidad, setUnidad] = useState<Unidad>("kg");
  const [errores, setErrores] = useState<Errores>({});

  useEffect(() => {
    async function cargar() {
      const negocio = await obtenerNegocio();
      if (negocio) {
        setGiro(negocio.tipo);
        setUnidad(configNegocios[negocio.tipo].unidadDefault);
      }

      // Modo edición: llena los campos con el producto guardado
      if (productoId !== undefined) {
        const p = await obtenerProducto(productoId);
        if (p) {
          setNombre(p.nombre);
          setCategoria(p.categoria);
          setPrecio(String(p.precio));
          setExistencias(String(p.existencias));
          setUnidad(p.unidad);
        }
      }
    }
    cargar();
  }, [productoId]);

  const config = giro ? configNegocios[giro] : null;
  const opcionesCategoria = (config?.categorias ?? []).map((c) => ({
    valor: c,
    texto: c,
  }));

  const guardar = async () => {
    const nuevos: Errores = {};
    const precioNum = Number(precio.replace(",", "."));
    const existenciasNum = Number(existencias.replace(",", "."));

    if (!nombre.trim()) nuevos.nombre = "Escribe el nombre del producto";
    if (!categoria) nuevos.categoria = "Elige una categoría";
    if (!precio.trim() || isNaN(precioNum) || precioNum <= 0)
      nuevos.precio = "Escribe un precio válido";
    if (!existencias.trim() || isNaN(existenciasNum) || existenciasNum < 0)
      nuevos.existencias = "Escribe las existencias";

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const datos = {
      nombre: nombre.trim(),
      categoria,
      precio: precioNum,
      existencias: existenciasNum,
      unidad,
    };

    try {
      if (productoId !== undefined) {
        await actualizarProducto(productoId, datos);
      } else {
        await agregarProducto(datos);
      }
      navigation.goBack();
    } catch (e) {
  console.error("No se pudo guardar el producto", e);

  const mensaje =
    e instanceof Error
      ? e.message
      : "Ocurrió un error inesperado al guardar el producto.";

  Alert.alert("No se pudo guardar", mensaje);
}
  };

  const confirmarEliminar = () => {
    if (productoId === undefined) return;

    Alert.alert("Eliminar producto", `¿Seguro que quieres eliminar "${nombre}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await eliminarProducto(productoId);
            navigation.goBack();
          } catch (e) {
            console.error("No se pudo eliminar", e);
            Alert.alert(
              "No se pudo eliminar",
              "Es posible que el producto ya tenga ventas registradas."
            );
          }
        },
      },
    ]);
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
          <Text style={styles.titulo}>
            {editando ? "Editar producto" : "Registrar producto"}
          </Text>
        </View>
        <Text style={styles.subtitulo}>
          {editando ? "Edición" : "Nuevo registro"}
          {config ? ` · ${config.nombre}` : ""}
        </Text>

        <Campo
          label="Nombre del producto"
          value={nombre}
          onChangeText={setNombre}
          placeholder="Jitomate saladet"
          error={errores.nombre}
        />
        <Selector
          label="Categoría"
          valor={categoria}
          opciones={opcionesCategoria}
          onChange={setCategoria}
          error={errores.categoria}
        />
        <Campo
          label={`Precio por ${unidad === "kg" ? "kilogramo" : "pieza"} · MXN`}
          value={precio}
          onChangeText={setPrecio}
          placeholder="28.00"
          keyboardType="decimal-pad"
          error={errores.precio}
        />
        <Campo
          label={`Existencias disponibles · ${unidad === "kg" ? "kg" : "piezas"}`}
          value={existencias}
          onChangeText={setExistencias}
          placeholder="18"
          keyboardType="decimal-pad"
          error={errores.existencias}
        />
        <Selector
          label="Unidad de medida"
          valor={unidad}
          opciones={opcionesUnidad}
          onChange={(v) => setUnidad(v as Unidad)}
        />
        <Text style={styles.ayuda}>Elige si vendes por kilo o por pieza.</Text>

        <View style={styles.pie}>
          <Pressable
            style={({ pressed }) => [styles.boton, pressed && styles.botonPressed]}
            onPress={guardar}
          >
            <Text style={styles.botonTexto}>
              {editando ? "Guardar cambios" : "Guardar producto"}
            </Text>
          </Pressable>

          {editando && (
            <Pressable style={styles.botonEliminar} onPress={confirmarEliminar}>
              <Text style={styles.textoEliminar}>Eliminar producto</Text>
            </Pressable>
          )}
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
    fontSize: 26,
    fontWeight: "800",
    color: "#172C2A",
  },
  subtitulo: {
    fontSize: 14,
    color: "#647572",
    marginTop: 12,
  },
  ayuda: {
    fontSize: 13,
    color: "#647572",
    marginTop: 10,
  },
  pie: {
    marginTop: "auto",
    paddingTop: 32,
    gap: 4,
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
  botonEliminar: {
    paddingVertical: 16,
    alignItems: "center",
  },
  textoEliminar: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "700",
  },
});