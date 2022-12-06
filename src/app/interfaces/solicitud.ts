import { Grua } from './grua';
import { Operador } from './operador';
import { PagoSolicitud } from './pago-solicitud';
import { TipoGrua } from './tipo-grua';
import { TipoPago } from './tipo-pago';
import { TipoServicio } from './tipo-servicio';
import { Vehiculo } from './vehiculo';

export interface Solicitud {
  id: number;
  name?: string;
  vehiculo_id?: number;
  fecha?: string;
  tiposervicio_id?: number;
  folio_ss?: string;
  tipopago_id?: number;
  telefono?: string;
  seencuentra?: string;
  referencias?: string;
  selleva?: string;
  grua_id?: number;
  tipogrua_id?: number;
  operador_id?: number;
  tmestimadoarribo?: string;
  tmrealarribo?: string;
  fechahorarealarribo?: string;
  state?: string;
  status?: string;
  observaciones?: any;
  fecha_hora_reservacion?: string;
  amount_untaxed?: number;
  amount_tax?: number;
  amount_total?: number;
  servicio?: TipoServicio;
  grua?: Grua;
  tipogrua?: TipoGrua;
  operador?: Operador;
  vehiculo?: Vehiculo;
  pagos?: PagoSolicitud[];
  tipopago?: TipoPago;
}
