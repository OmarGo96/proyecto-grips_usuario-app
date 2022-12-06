import {MapsIconI} from './maps-icon.interface';

export interface MarkerI
{
  id: number;
  position: any;
  latitude?: number;
  longitude?: number;
  icon?: MapsIconI;
  map: any;
  zIndex?: number;
}
