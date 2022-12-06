import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {NavController} from '@ionic/angular';
import {SweetMessagesService} from './sweet-messages.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  // region Atributos
  public apiPartner: string;
  public profile: any;
  public apiUrl = environment.API_URL;

  // endregion

  // region Constructor
  constructor(
    public httpClient: HttpClient,
    public navCtrl: NavController,
    private sweetMsg: SweetMessagesService
  ) {
    this.apiPartner = environment.API_PARTNER;
  }

  // endregion

  public async payRequest(_paload) {
    try {
      return await this.httpClient.post<any>(`${this.apiPartner}/transaction/pay-request`, _paload).toPromise();
    } catch (e) {
      if (e.status === 500) {
        this.sweetMsg.printStatus('Por el momento no esta disponible el servicio bancario. Intente nuevamente mas tarde.', 'error');
      }
      return {ok: false, errors: e};
    }
  }

  public async reviewTransaction(_payload) {
    try {
      let res = await this.httpClient.post<any>(`${this.apiPartner}/transaction/review`, _payload).toPromise();
      return res;
    } catch (e) {
      if (e.status === 500) {
        this.sweetMsg.printStatus('Por el momento no esta disponible el servicio bancario. Intente nuevamente mas tarde.', 'error');
      }
      return {ok: false, errors: e};
    }

  }

}
