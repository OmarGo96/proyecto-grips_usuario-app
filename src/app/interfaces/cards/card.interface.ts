export interface CardI
{
  id?: number;
  cliente_id?: number;
  c_name?: string;
  c_firstname?: string;
  c_lastname?: string;
  c_cn1?: string;
  c_cn2?: string;
  c_cn3?: string;
  c_cn4?: string;
  c_month?: string;
  c_year?: string;
  c_code?: string;
  c_type?: string;
  c_method?: string;
  icon?: string;

  cod_banco?: string;
  monto?: number;


  card_number?: string;
  holder_name?: string;
  year?: string;
  month?: string;
  cvv2?: string;
}
