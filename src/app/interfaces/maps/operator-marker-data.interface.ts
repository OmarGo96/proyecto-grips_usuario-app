import {MapsIconI} from '../../common/google-maps-javascript/interfaces/maps-icon.interface';
import {CotizacionI} from '../pre-solicitud/pre-solicitud.interface';
import {ConceptosCobroI} from '../conceptos-cobro.interface';

export interface OperatorMarkerDataI
{
  position: {
    lat: number,
    long: number
  };
  id: number;
  icon: MapsIconI;
  data: {
    company_logo?: string;
    company_name: string;
    crane_number: string;
    plates: string;
    op_profile_img?: string;
    op_name: string;
    origin: string;
    distance: string;
    arrive: string;
    price: number;
    cotizacion?: CotizacionI;
    calcObjs?: ConceptosCobroI[];
    distanciaKm?: number;
  };
  confirm?: boolean;
  blocked?: boolean;
  blockedTime?: any;
}
