import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OpenStreetGeoCodeI} from '../interfaces/open-street-map/open-street-geocode';
import {BehaviorSubject} from 'rxjs';
import {MapsIconI} from '../interfaces/maps-icon.interface';

declare let google;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  //region ATTRIBUTES
  limitRadius$ = new BehaviorSubject<{distance: number; infoLabel: string}>(null);
  currentMarkerLocation$ = new BehaviorSubject<{position: {lat: number; long: number}; geodata: OpenStreetGeoCodeI}>(null);

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  currMarkerIcon: MapsIconI = {
    url: 'assets/img/static/locations/me-pin.svg',
    size: new google.maps.Size(24, 58.02),
    scaledSize: new google.maps.Size(24, 58.02),
    type: 'default'
  };

  draggerMarkerLimitIcon: MapsIconI = {
    url: 'assets/img/static/locations/drag-limit.svg',
    size: new google.maps.Size(24, 24),
    scaledSize: new google.maps.Size(24, 24),
    type: 'default'
  };

  operatorMarkerIcon: MapsIconI = {
    url: 'assets/img/static/locations/operator-pin.svg',
    size: new google.maps.Size(41.46, 56),
    scaledSize: new google.maps.Size(41.46, 56),
    type: 'default'
  };

  operatorMarkerSelectedIcon: MapsIconI = {
    url: 'assets/img/static/locations/operator-pin-selected.svg',
    size: new google.maps.Size(41.46, 56),
    scaledSize: new google.maps.Size(41.46, 56),
    type: 'selected'
  };

  operatorMarkerSelectedConfirmIcon: MapsIconI = {
    url: 'assets/img/static/locations/operator-pin-confirm.svg',
    size: new google.maps.Size(41.46, 56),
    scaledSize: new google.maps.Size(41.46, 56),
    type: 'selected-confirm'
  };

  //endregion
  constructor(
    public httpClient: HttpClient,
  ) { }

  //region PUBLIC METHODS
  public async getReverseCoordsData(lat, long) {
    let data = {
      format: 'jsonv2',
      lat,
      lon: long
    };
    try {
      const res: OpenStreetGeoCodeI = await this.httpClient.get<any>(`https://nominatim.openstreetmap.org/reverse`, {params: data}).toPromise();
      if (res) {
        res.flatAddress = res.address.road
          + ', ' + res.address.city
          + ', ' + res.address.country
          + ', ' + res.address.state
          + ', ' + res.address.postcode
          + ', ' + res.address.country;
        return {ok: true, data: res};
      } else {
        return {ok: false, errors: ['Algo salio mal']};
      }
    } catch (e) {
      return {ok: false, errors: e};
    }
  }

  public geometrySphericalCalc(type: 'computeOffset' | 'computeDistanceBetween', origin, destination?, distance?: number, heading?: number, radius?: number) {
    switch (type) {
      case 'computeOffset':
        return google.maps.geometry.spherical.computeOffset(origin, distance, heading, radius );
        break;
      case 'computeDistanceBetween':
        return google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
        break;
      default:
        return false;
    }
  }
  //endregion

}
