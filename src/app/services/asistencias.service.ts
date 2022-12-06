import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsistenciasService {

   //#region Atributos
   public apiPartner = environment.API_PARTNER;
   //#endregion


   constructor(
     public httpClient: HttpClient,
     public router: Router
   ) { }

   //#region Métodos

    // registrar solictud de asistencia
    requireAssistance(data, type: 'cotizar' | 'programar' | 'pre-solicitud' | 'call_request'): Observable<any> {
     switch (type) {
       case 'pre-solicitud':
         return this.httpClient.post<any>(`${this.apiPartner}/solicitudes/pre`, data).pipe(map(response => {
           return response;
         }));
         break;
       case 'cotizar':
       //case 'call_request':
       case 'programar':
         return this.httpClient.post<any>(`${this.apiPartner}/solicitudes/register`, data).pipe(map(response => {
           return response;
         }));
         break;
     }
    }

  async _requireAssistance(data, type: 'cotizar' | 'programar' | 'pre-solicitud' | 'call_request') {
    switch (type) {
      case 'pre-solicitud':
        return await this.httpClient.post<any>(`${this.apiPartner}/solicitudes/pre`, data).toPromise();
        break;
      case 'cotizar':
      case 'call_request':
      case 'programar':
        return await this.httpClient.post<any>(`${this.apiPartner}/solicitudes/register`, data).toPromise()
        break;
    }
  }

    listAssistenceReq(data): Observable<any> {
      return this.httpClient.post<any>(`${this.apiPartner}/solicitudes/list`, data).pipe(map(response => {
        return response;
      }));
    }

    listAssistenceReq2(data) {
      return this.httpClient.post<any>(`${this.apiPartner}/solicitudes/list`, data);
    }



    programPhoneCall(data): Observable<any> {
      return this.httpClient.post<any>(`${this.apiPartner}/solicitudes/call-me`, data).pipe(map(response => {
        return response;
      }));
    }

    attachWT(data): Observable<any> {
      return this.httpClient.post<any>(`${this.apiPartner}/solicitudes/wt-attach`, data).pipe(map(response => {
        return response;
      }));
    }

    getPaymentTicket(data): Observable<any> {
      return this.httpClient.post(`${this.apiPartner}/solicitudes/get-ticket`, data, {responseType: 'blob'})
    }

    getInProcess() {
    return this.httpClient.get(`${this.apiPartner}/pre-solicitudes/inprogress`).toPromise();
  }

   //#endregion
}
