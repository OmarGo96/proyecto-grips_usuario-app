import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {TransactionsService} from '../../services/transactions.service';
import {SweetMessagesService} from '../../services/sweet-messages.service';
import {GeneralService} from '../../services/general.service';

@Component({
  selector: 'app-payment-transaction',
  templateUrl: './payment-transaction.page.html',
  styleUrls: ['./payment-transaction.page.scss'],
})
export class PaymentTransactionPage implements OnInit {

  loading = false;
  paymentSuccess: boolean;
  message: string;
  authCode: string;
  errorCode: string;
  finalMessage: string;
  btnTxt = 'Finalizar';
  returnPath = '/';
  constructor(
    private navCtrl: NavController,
    private router: ActivatedRoute,
    private transactionServ: TransactionsService,
    private sweetMsg: SweetMessagesService,
    private generalServ: GeneralService
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.router.params.subscribe(async res => {
      if (res.order) {
        let _payload = {
          order_indentify: res.order
        };
        this.loading = true;
        await this.generalServ.loadNgxSpinner('Verificando tu transacción ...');
        let _res = await this.transactionServ.reviewTransaction(_payload);
        await this.generalServ.hideNgxSpinner();
        this.loading = false;

        this.paymentSuccess = _res.ok;
        this.authCode = _res.authCode;
        this.message = _res.message;
        this.finalMessage = _res.ok === true ? _res.finalMessage : 'No. Orden:' + _res.order;
        this.returnPath = _res.returnPath;
      }
    });
  }

  async returnHome() {
    await this.navCtrl.navigateRoot(this.returnPath);
  }

}
