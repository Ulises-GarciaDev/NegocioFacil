import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, StyleSheet } from "react-native";
import DashboardScreen from "../screens/DashboardScreen";
import CatalogScreen from "../screens/CatalogScreen";
import NewSaleScreen from "../screens/NewSaleScreen";


const Tab = createBottomTabNavigator();

function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={styles.main}>
      <Text>{title}</Text>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      //screenOptions Sirve para personalizar la apariencia de la barra de navegación y los elementos de la barra de pestañas.
      //Si quieres personalizar la etiqueta de la pestaña, puedes usar la propiedad tabBarLabel en las
      // opciones de cada pantalla. Esto te permite definir un componente personalizado para la etiqueta
      // de la pestaña, como un Text con estilos específicos.
      screenOptions={{
        tabBarActiveTintColor: "#176B54",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: styles.navigatorContainer,
      }}
    >
    
      <Tab.Screen
  name="Inicio"
  component={DashboardScreen}
  options={{
    headerShown: false,
    tabBarLabel: ({ focused, color }) => (
      <Text
        style={{
          fontSize: styles.textStyle.fontSize,
          color: color,
          fontWeight: focused ? "bold" : "normal",
        }}
      >
        Inicio
      </Text>
    ),
    tabBarIcon: ({ focused }) => (
      <View
        style={{
          backgroundColor: focused ? "#176b5544" : "transparent",
          borderRadius: 15,
          height: 30,
          padding: 5,
        }}
      >
        <Ionicons
          name={focused ? "home" : "home-outline"}
          size={20}
          color={focused ? "#176B54" : "#999"}
        />
      </View>
    ),
  }}
/>

      <Tab.Screen
      //Este Tab screen es el segundo boton de Operaciones
        name="Operaciones"
        component={NewSaleScreen}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontSize: styles.textStyle.fontSize,
                color: color,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              Operaciones
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#176b5544" : "transparent",
                borderRadius: 15,
                height: 30,
                padding: 5,
              }}
            >
              <Ionicons
                name={focused ? "list" : "list-outline"}
                size={20}
                color={focused ? "#176B54" : "#999"}
              />
            </View>
          ),
        }}
        //AQUI TERMINA EL SEGUNDO TAB SCREEN, QUE ES EL DE OPERACIONES, Y SE CIERRA CON EL
      />

    <Tab.Screen
  name="Catalogo"
  component={CatalogScreen}
  options={{
    headerShown: false,
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontSize: styles.textStyle.fontSize,
                color: color,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              Catálogo
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#176b5544" : "transparent",
                borderRadius: 15,
                height: 30,
                padding: 5,
              }}
            >
              <Ionicons
                name={focused ? "apps" : "apps-outline"}
                size={20}
                color={focused ? "#176B54" : "#999"}
              />
            </View>
          ),
          
        }}
        //AQUI TERMINA EL TERCER TAB SCREEN, QUE ES EL DE CATALOGO, Y SE CIERRA CON EL
      />

      

     
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navigatorContainer: {
    height: 70,
  },
  textStyle: {
    color: "#176B54",

    fontSize: 11,
    fontWeight: "bold",
  },
});
