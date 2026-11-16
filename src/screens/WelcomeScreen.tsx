import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';


export default function WelcomeScreen() {
     const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.mainOne}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>nf</Text>
        </View>
        <Text style={styles.title}>Negocio Facil</Text>
      </View>
      <View>
        <Text style={styles.subtitle}>MENOS ADMINISTRACIÓN. MÁS NEGOCIO.</Text>
        <Text style={styles.description}>Tu negocio, bajo control.</Text>
        <Text style={styles.content}>
          Ventas, existencias y citas en un solo lugar.
        </Text>
        <Text style={styles.content2}> Hecho para el ritmo de tu día.</Text>
      </View>
      <View style={styles.mainTwo}>
        <Text style={styles.titlePresentation}>
          Así de claro. Todos los días. 
        </Text>
        <Text style={styles.salesToday}>Ventas de hoy</Text>
        <Text style={styles.salesAmount}>$3,840.00</Text>
        <Image source={require("../assets/images/graphic_Welcome_Screen.png")} style={styles.graphic} />
      </View>
      <View style = {styles.mainPressable}>
       <Pressable
  style={({ pressed }) => [
    styles.button,
    pressed && styles.buttonPressed,
  ]}
  onPress={() => navigation.navigate('BusinessSelection')}
>
  <Text style={styles.buttonText}>Comenzar</Text>
</Pressable>
        <Text style={styles.salesToday}>Simple, seguro y a tu medida.</Text>
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  background: {
    backgroundColor: "#F5F7F6",
    flex: 1,
  },
  mainOne: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 50,
    marginLeft: 20,
    width: 200,
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: "#176B54",
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  logoText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#172C2A",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#176B54",
    marginTop: 35,
    marginLeft: 25,
  },
  description: {
    width: 250,
    fontSize: 40,
    color: "#172C2A",
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 25,
  },
  content: {
    maxWidth: 300,
    fontSize: 16,
    color: "#647572",
    marginTop: 20,
    marginLeft: 27,
    fontWeight: "600",
  },
  content2: {
    maxWidth: 300,
    fontSize: 16,
    color: "#647572",
    marginTop: 0,
    marginLeft: 24,
    fontWeight: "600",
    lineHeight: 24,
  },
  mainTwo: {
    width: 300,
    height: 200,
    backgroundColor: "white",
    marginTop: 50,
    marginLeft: 25,
    borderRadius: 20,
    padding: 20,
  },
  titlePresentation: {
    maxWidth: 300,
    fontSize: 16,
    color: "#172C2A",
    fontWeight: "700",
    lineHeight: 24,
  },
  salesToday: {
    fontSize: 16,
    color: "#647572",
    fontWeight: "500",
    marginTop: 10,
  },
  salesAmount: {
    fontSize: 35,
    color: "#172C2A",
    fontWeight: "bold",
    marginTop: 10,
  },
  graphic: {
    width: 250,
    height: 50,
    marginTop: 0,
  },
    mainPressable: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
    button: {
    backgroundColor: "#176B54",
    paddingVertical: 15,
    width: 300,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonPressed: {
    backgroundColor: "#176B5544",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
