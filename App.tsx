import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import { initDb,reiniciarBase} from "./src/database/db";
import { obtenerNegocio } from "./src/database/negocio";
import { VentaProvider } from "./src/context/VentaContext";

export default function App() {
  const [listo, setListo] = useState(false);
  const [rutaInicial, setRutaInicial] = useState<"Welcome" | "Main">("Welcome");

  useEffect(() => {
    async function iniciar() {
      try {
        //await reiniciarBase();
        await initDb();
        const negocio = await obtenerNegocio();
        if (negocio) setRutaInicial("Main");
      } catch (e) {
        console.error("Error al iniciar la base de datos", e);
      }
      setListo(true);
    }
    iniciar();
  }, []);

  if (!listo) return null;

 return (
  <VentaProvider>
    <NavigationContainer>
      <RootNavigator rutaInicial={rutaInicial} />
    </NavigationContainer>
  </VentaProvider>
);
}