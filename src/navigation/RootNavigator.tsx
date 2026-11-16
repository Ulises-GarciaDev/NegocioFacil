import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import WelcomeScreen from "../screens/WelcomeScreen";
import BusinessSelectionScreen from "../screens/BusinessSelectionScreen";
import BusinessSetupScreen from "../screens/BusinessSetupScreen";
import TabNavigator from "./TabNavigator";
import ProductFormScreen from "../screens/ProductFormScreen";
import NewSaleScreen from "../screens/NewSaleScreen";
import ConfirmSaleScreen from "../screens/ConfirmSaleScreen";
import SaleDoneScreen from "../screens/SaleDoneScreen";
import SaleSummaryScreen from "../screens/SaleSummaryScreen";
import SalesHistoryScreen from "../screens/SalesHistoryScreen";


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator({
  rutaInicial,
}: {
  rutaInicial: keyof RootStackParamList;
}) {
  return (
   <Stack.Navigator
   initialRouteName={rutaInicial}
  screenOptions={{ headerShown: false }}
>
  <Stack.Screen name="Welcome" component={WelcomeScreen} />
  <Stack.Screen name="BusinessSelection" component={BusinessSelectionScreen} />
  <Stack.Screen name="BusinessSetup" component={BusinessSetupScreen} />
  <Stack.Screen name="Main" component={TabNavigator} />
  <Stack.Screen name="ProductForm" component={ProductFormScreen} />
  <Stack.Screen name="NuevaVenta" component={NewSaleScreen} />
  <Stack.Screen name="ConfirmarVenta" component={ConfirmSaleScreen} />
<Stack.Screen name="VentaRegistrada" component={SaleDoneScreen} />
   <Stack.Screen name="ResumenVenta" component={SaleSummaryScreen} />
    <Stack.Screen
  name="HistorialVentas"
  component={SalesHistoryScreen}
/>

</Stack.Navigator>
  );
}