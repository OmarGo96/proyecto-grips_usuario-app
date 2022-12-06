import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeocoderService {

  constructor(
    public httpClient: HttpClient,
  ) { }

  getReverseCoordsData(lat, long): Observable<any> {
    let data = {
      format: 'jsonv2',
      lat: lat,
      lon: long
    };
    return this.httpClient.get<any>(`https://nominatim.openstreetmap.org/reverse`, {params: data}).pipe(map(response => {
      return response;
    }))
    //let endPoint = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=20.6355915&lon=-87.0743748`
  }
}
