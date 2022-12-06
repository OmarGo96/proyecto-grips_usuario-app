import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-wire-transfer-data',
  templateUrl: './wire-transfer-data.component.html',
  styleUrls: ['./wire-transfer-data.component.scss'],
})
export class WireTransferDataComponent implements OnInit {

  title: string;
  clabeInterbank: string;
  cardNumber: string;
  bankName: string;
  beneficiary: string;
  importantInfo: string;

  constructor(
    public modalCtrl: ModalController,
    public generalServ: GeneralService
  ) { }

  ngOnInit() {
    this.title = 'Datos para transferencia bancaria';
    this.clabeInterbank = this.generalServ.configParams.find(x => x.key === 'bank_clabe').value;
    this.cardNumber = this.generalServ.configParams.find(x => x.key === 'bank_card_number').value;
    this.bankName = this.generalServ.configParams.find(x => x.key === 'bank_name').value;
    this.beneficiary = this.generalServ.configParams.find(x => x.key === 'bank_beneficiary').value;
    this.importantInfo = this.generalServ.configParams.find(x => x.key === 'bank_important_note').value;
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'modal': false
    });
  }

}
