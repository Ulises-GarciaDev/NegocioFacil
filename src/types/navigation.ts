//Esto es para definir los tipos de navegación en la aplicación.
//  Se utiliza para tipar las rutas y los parámetros que se pasan entre pantallas, 
// lo que ayuda a prevenir errores y mejorar la autocompletación en el desarrollo.
import type { TipoNegocio } from "./negocio";

export type RootStackParamList = {
  Welcome: undefined;
  BusinessSelection: undefined;
  BusinessSetup: { tipoNegocio: TipoNegocio };
  Main: undefined;
  ProductForm: { productoId?: number } | undefined;
  NuevaVenta: undefined;
  ConfirmarVenta: undefined;
  VentaRegistrada: { total: number };
  ResumenVenta: undefined;
};