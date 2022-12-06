export enum SolicitudesStatus
{
  'RESERVADA' = 'reserved', // considerar
  'BORRADOR' = 'draft',
  'ARRIBADA' = 'arrived', // considerar
  'ABIERTA' = 'open',
  'PAGADA' = 'paid', // considerar
  'VALIDARPAGO' = 'paidlocked',
  'PAIDVALID' = 'paidvalid',
  'ENCIERRO' = 'locked',
  'CANCELADA' = 'cancel', // considerar
  'CERRADA' = 'closed', // considerar
  'FACTURADA' = 'invoiced',
  'CUENTAXCOBRAR' = 'receivable',
  'LIBERADA' = 'relased',
  'SOLLAMADA' = 'call_request', // considerar
  'SOLCOTIZACION' = 'quot_request', // considear
  'ONTRANSIT' = 'on_transit'
}
