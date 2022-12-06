import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PreSolicitudesService {

  //#region Atributos
  public apiPartner = environment.API_PARTNER;
  //#endregion


  constructor(
    public httpClient: HttpClient,
    public router: Router
  ) { }

  getPreSolData(idPreSol): Observable<any> {
    return this.httpClient.get<any>(`${this.apiPartner}/pre-solicitud/${idPreSol}`).pipe(map(res => {
      return res;
    }));
  }

  getPreSolFiles(data): Observable<any> {
    return this.httpClient.post(`${this.apiPartner}/pre-solicitudes/files`, data, {responseType: 'blob'});
  }

  getPreSolSection(data) {
    return this.httpClient.post<any>(`${this.apiPartner}/pre-solicitudes/get`, data);
  }

  acceptPreSol(data): Observable<any> {
    return this.httpClient.post(`${this.apiPartner}/pre-solicitudes/accept`, data).pipe(map(res => {
      return res;
    }));
  }

  async _renewPreSol(data) {
    try {
      let res: any = await this.httpClient.post(`${this.apiPartner}/pre-solicitudes/renew`, data).toPromise();
      if (res.ok) {
        return {ok: true, message: res.message};
      }
    } catch (e) {
      return {ok: false, errors: e};
    }
  }

}
