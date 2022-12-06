import { ClaseVehiculo } from "./clase-vehiculo";
import { ColorVehiculo } from "./color-vehiculo";
import { MarcaVehiculo } from "./marca-vehiculo";
import { TipoVehiculo } from "./tipo-vehiculo";

export interface Vehiculo {
    id: number;
    partner_id?: number;
    marca_id?: number;
    tipovehiculo_id?: number;
    clase_id?: number;
    anio?: number;
    colorvehiculo_id?: number;
    placas?: string;
    noserie?: any;
    alias?: string;
    marca?: MarcaVehiculo;
    tipo?: TipoVehiculo;
    clase?: ClaseVehiculo;
    color?: ColorVehiculo;
}
