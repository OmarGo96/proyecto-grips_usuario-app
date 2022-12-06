export interface ConceptosCobroI
{
  id?: number;
  partner_id?: any[];
  tiposervicio_id?: any[];
  product_id?: any[];
  uom_id?: any[];
  price_unit?: number;
  tax_ids?: number[];
  amount_tax?: number;
  amount_total?: number;
  req_servicio?: boolean;
  tipo_cantidad?: string;
  one_by_request?: boolean;
  company_id?: any[];
  currency_id?: any[];
  pricelist_id?: any[];
  create_uid?: any[];
  create_date?: string;
  write_uid?: any[];
  write_date?: string;
  display_name?: string;
  __last_update?: string;
}
