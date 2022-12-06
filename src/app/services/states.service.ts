import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatesService {

   //#region Atributos
   public apiUrl = environment.API_URL;
   //#endregion


   constructor(
     public httpClient: HttpClient,
     public router: Router
   ) { }

   //#region Métodos

    // obtener listado de paises
    loadRegions(data): Observable<any> {
      return this.httpClient.post<any>(`${this.apiUrl}/catalog/states`, data).pipe(map(response => {
        return response;
      }));
    }

   //#endregion
}
