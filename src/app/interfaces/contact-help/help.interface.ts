import {SolicitudType} from '../../types/solicitudes.types';

export interface HelpI {
  solicitudType: SolicitudType;
  userTelephone: string;
  id?: number;
  helpTitle?: string;
  dateReg: string;
}
