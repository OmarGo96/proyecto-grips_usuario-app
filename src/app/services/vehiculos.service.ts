import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  //#region Atributos
  public apiPartner = environment.API_PARTNER;
  public apiURL = environment.API_URL;
  //#endregion


  constructor(
    public httpClient: HttpClient,
    public router: Router
  ) { }

  //#region Métodos

  // obtener listado de marcas vehículos
  listMarcas(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiURL}/catalog/vehiculos/marcas`).pipe(map(response => {
      return response;
    }));
  }


  // obtener clase vehículos dado id marca
  listClases(data): Observable<any> {
    return this.httpClient.post<any>(`${this.apiURL}/catalog/vehiculos/clases`, data).pipe(map(response => {
      return response;
    }));
  }

  // obtener tipos vehículos
  listTipos(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiURL}/catalog/vehiculos/tipos`).pipe(map(response => {
      return response;
    }));
  }

  // obtener colores
  listColores(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiURL}/catalog/vehiculos/colores`).pipe(map(response => {
      return response;
    }));
  }

  registrar(data): Observable<any> {
    return this.httpClient.post<any>(`${this.apiPartner}/vehiculos/register`, data).pipe(map(response => {
      return response;
    }));
  }

  listVehiculos(makeSolictud?: boolean): Observable<any> {
    if (makeSolictud && makeSolictud === true) {
      return this.httpClient.get<any>(`${this.apiPartner}/vehiculos/list?makeSolicitud=${makeSolictud}`).pipe(map(response => {
        return response;
      }));
    } else {
      return this.httpClient.get<any>(`${this.apiPartner}/vehiculos/list`).pipe(map(response => {
        return response;
      }));
    }

  }

  showVehiculo(data): Observable<any> {
    return this.httpClient.post<any>(`${this.apiPartner}/vehiculos/show`, data).pipe(map(response => {
      return response;
    }));
  }

  deleteVehiculo(data): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: data
    };
    return this.httpClient.delete<any>(`${this.apiPartner}/vehiculo`, options).pipe(map(response => {
      return response;
    }));
  }

  //#endregion
}
