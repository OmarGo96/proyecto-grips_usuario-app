import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {NavController} from '@ionic/angular';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {SweetMessagesService} from './sweet-messages.service';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class GripsOpenPayService {

  // region Atributos
  public apiPartner: string;
  public profile: any;
  public apiUrl = environment.API_URL;

  // endregion

  // region Constructor
  constructor(
    public httpClient: HttpClient,
    public navCtrl: NavController,
    public sweetMsg: SweetMessagesService,
    private generalServ: GeneralService
  ) {
    this.apiPartner = environment.API_PARTNER;
  }

  // endregion

  public getCardData(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiPartner}/profile/openpay/get-cards`).pipe(map(response => {
      if (response.status === 500) {
        this.sweetMsg.printStatus('Por el momento no esta disponible el servicio de pago en línea, intente mas tarde.', 'error');
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {

      if (err.status === 500) {
        this.sweetMsg.printStatus('Por el momento no esta disponible el servicio bancario, intente mas tarde.', 'error');
      }
      if (this.generalServ.ngxLoaderMsg) {
        this.generalServ.hideNgxSpinner();
      }
      return throwError(err);
    }));
  }

  public saveClientCard(gateway: 'openpay' | 'other', cardData, cardId?): Observable<any> {
    if (gateway === 'openpay') {
      return this.httpClient.post<any>(`${this.apiPartner}/profile/openpay/save-client-card`, cardData).pipe(map(res => {
        return res;
      }), catchError((err: HttpErrorResponse) => {
        if (err.status === 500) {
          this.sweetMsg.printStatus('Por el momento no esta disponible el servicio bancario, intente mas tarde.', 'error');
        }
        if (this.generalServ.ngxLoaderMsg) {
          this.generalServ.hideNgxSpinner();
        }
        return throwError(err);
      }));
    } else {
      return;
    }
  }

  public deleteCardData(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiPartner}/profile/openpay/delete-client-card`, payload).pipe(map(response => {
      if (response.status === 500) {
        this.sweetMsg.printStatus('Por el momento no esta disponible el servicio bancario, intente mas tarde.', 'error');
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      if (err.status === 500) {
        this.sweetMsg.printStatus('Por el momento no esta disponible el servicio bancario, intente mas tarde.', 'error');
      }
      if (this.generalServ.ngxLoaderMsg) {
        this.generalServ.hideNgxSpinner();
      }
      return throwError(err);
    }));
  }
}
