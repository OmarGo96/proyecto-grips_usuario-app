import {PreSolicitudI} from "../pre-solicitud/pre-solicitud.interface";

export interface NotificationI
{
  id?: number;
  title?: string;
  body?: string;
  date_reg?: string;
  priority?: number;
  status?: number;
  model?: string;
  model_id?: number;
  exp_date?: string;

  pre_sol?: PreSolicitudI;
}
