export interface CordsI {
  lat: string;
  lon: string;
  distance?: any;
}

export interface CarDetailsI {
  brand: string;
  model: string;
  year: number;
  color: string;
  plates: string;
}

export interface ServiceDetailsI {
  from: string;
  to: string;
}

export interface PreguntaI {
  pregunta_id: number;
  pregunta_label: string;
  pregunta_response: boolean;
}

export interface SolicitudI {
  tipo: string;
  seencuentra: string;
  referencias: string;
  selleva: string;
  tipopago_id: number;
  fecha_hora: string;
  telefono: string;
}

export interface MarcaI {
  id: number;
  name: string;
}

export interface TipoI {
  id: number;
  name: string;
  icon_name?: any;
}

export interface ClaseI {
  id: number;
  name: string;
}

export interface ColorI {
  id: number;
  name: string;
}

export interface VehiculoI {
  id: number;
  marca_id: number;
  tipovehiculo_id: number;
  clase_id: number;
  anio: number;
  colorvehiculo_id: number;
  placas: string;
  noserie: string;
  alias: string;
  marca: MarcaI;
  tipo: TipoI;
  clase: ClaseI;
  color: ColorI;
}

export interface TiposervicioI {
  id: number;
  name: string;
}

export interface TipopagoI {
  id: number;
  name: string;
  banco: boolean;
}

export interface PartnerI {
  id: number;
  name: string;
  mobile: string;
}

export interface FleetI {
  grua: string;
  license_plate: string;
  tipogrua_id: string;
}

export interface OperatorI {
  name: string;
}

export interface FleetDataI {
  fleet: FleetI;
  operator: OperatorI;
  company: string;
}

export interface ItemI {
  item_quantity: number;
  item_code: string;
  item_description: string;
  item_price: number;
}

export interface CalculatorI {
  subtotal: number;
  tax: number;
  tax_amount: number;
  total: number;
}

export interface CotizacionI {
  items: ItemI[];
  calculator: CalculatorI;
}

export interface ComplementDataI {
  preguntas: PreguntaI[];
  solicitud: SolicitudI;
  telefono: string;
  lat: string;
  lon: string;
  fecha_hora_reservacion: string;
  urgencyEmit?: any;
  vehiculo: VehiculoI;
  tiposervicio: TiposervicioI;
  tipopago: TipopagoI;
  partner: PartnerI;
  assignment_datetime: string;
  cotizacion: CotizacionI;
  tiempoEstimadoArribo: string;
  fleetData: FleetDataI;
}

export interface PreSolicitudI {
  id?: number;
  pre_sol_id: number;
  cords: CordsI;
  user_data: string;
  car_details: CarDetailsI;
  service_details: ServiceDetailsI;
  date: string;
  complementData: ComplementDataI;
  folio?: string;
  status?: number | string;
  model?: string;
  fecha_hora_extension?: string;
}
