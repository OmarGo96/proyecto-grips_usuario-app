export enum PreSolStatusE
{
  'CANCELADA' = 0,
  'EXPIRADA' = -1,
  'NUEVA' = 1,
  'SIENDOATENDIA' = 2,
  'CONFIRMADAACEPTADA'= 3,
  'VALIDANDOPAGO'= 4
}

export class PreSolStatusC
{
  static statusLabel(status) {
    let label = '';
    switch (status) {
      case 1:
        label = 'EN ESPERA DE OPERADOR';
        break;
      case 2:
        label = 'OPERADOR ASIGNADO - EN ESPERA DE CONFIRMACIÓN';
        break;
      case 3:
        label = 'SOLICITUD CONFIRMADA';
        break;
      case 4:
        label = 'VALIDANDO PAGO';
        break;
      case 0:
        label = 'CANCELADA';
        break;
      case -1:
        label = 'EXPIRADA';
        break;
      case 'reserved':
        return 'RESERVADA';
      case 'draft':
        return 'RESERVACIÓN CONFIRMADA';
      case 'arrived':
        return 'ARRIBADA';
      case 'open':
        return 'ABIERTA';
      case 'paid':
        return 'PAGADA';
      case 'paidlocked':
        return 'VALIDANDO PAGO';
      case 'paidvalid':
        return 'PAGO VALIDADO';
      case 'locked':
        return 'ENCIERRO';
      case 'cancel':
        return 'CANCELADA';
      case 'closed':
        return 'CERRADA';
      case 'invoiced':
        return 'FACTURADA';
      case 'receivable':
        return 'CUENTA X COBRAR';
      case 'relased':
        return 'LIBERADA';
      case 'call_request':
        return  'SOLICITUD DE LLAMADA';
      case 'quot_request':
        return  'SOLICITUD DE COTIZACIÓN';
      case 'on_transit':
        return 'OPERADOR EN TRANSITO';
      default:
        label = '--';
        break;
    }
    return label;
  }
}
