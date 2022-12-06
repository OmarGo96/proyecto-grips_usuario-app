import { AddressI } from './address';

export interface OpenStreetGeoCodeI
{
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  place_rank: number;
  category: string;
  type: string;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: AddressI;
  boundingbox: string[];
  flatAddress?: string;
}
