import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  //#region Atributos
  public apiUrl = environment.API_URL;
  //#endregion


  constructor(
    public httpClient: HttpClient,
    public router: Router
  ) { }

  //#region Métodos

  // obtener listado de tipos de pago
  loadTipoPagos(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/catalog/tipo-pagos`).pipe(map(response => {
      return response;
    }));
  }

  // obtener listado de tipos de servicios
  loadTiposServicios(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/catalog/tipo-servicios`).pipe(map(response => {
      return response;
    }));
  }
  //#endregion
}
