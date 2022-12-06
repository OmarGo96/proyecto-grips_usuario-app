import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CardI} from '../../../interfaces/cards/card.interface';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {CardsConfig} from '../../../interfaces/cards/cards-config';
import {CardConfig} from '../../../interfaces/cards/cardConfig';
import {Months} from '../../../interfaces/shared/months';
import * as moment from 'moment';
import {SweetMessagesService} from '../../../services/sweet-messages.service';
import {GripsOpenPayService} from '../../../services/grips-open-pay.service';
import {GeneralService} from '../../../services/general.service';
import {ToastMessageService} from '../../../services/toast-message.service';

@Component({
  selector: 'app-add-card-modal',
  templateUrl: './add-card-modal.component.html',
  styleUrls: ['./add-card-modal.component.scss'],
})
export class AddCardModalComponent implements OnInit {

  @Output() modalEmitter = new EventEmitter();
  @Input() returnCapture = false;
  @Input() gateway: 'openpay' | 'other' = 'openpay';

  public cardData: CardI;
  @Input() asModal: boolean;
  @Input() card_id: number;
  @Input() cliente_id: number;
  @Input() loadLoading = true;

  @Input() needCaptureAmount = false;
  @Input() cod_banco: string;
  @Input() monto: number;
  @Input() tipoPago = null;
  @Input() titularTarj = null;
  @Input() montoCobrar: number;

  public title = 'Formulario Tarjeta';

  public cardForm: UntypedFormGroup;
  public cardConf = CardsConfig;
  public cardConfig: CardConfig;
  public months = Months;
  public validYears: any[];
  public cn1Value = [];
  public saveBtnText = 'Add Card';

  public minValidDate = moment().format('YYYY-MM-DD');

  constructor(
    private formBuilder: UntypedFormBuilder,
    private messageService: SweetMessagesService,
    public tarjetaServ: GripsOpenPayService,
    public generalServ: GeneralService,
    private toastServ: ToastMessageService
  ) { }

  ngOnInit() {
    this.initCardForm();

    this.validYears = this.getYears();
    this.fillCardForm();
  }

  private getYears() {
    const years = [];
    const dateStart = moment();
    const dateEnd = moment().add(10, 'y');
    while (dateEnd.diff(dateStart, 'years') >= 0) {
      years.push(dateStart.format('YYYY'));
      dateStart.add(1, 'year');
    }
    return years;
  }

  initCardForm() {
    this.cardForm = this.formBuilder.group({
      c_name: ['', [Validators.required]],
      c_cn1: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      c_cn2: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      c_cn3: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      c_cn4: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      c_month: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      c_year: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      c_code: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      c_type: ['', [Validators.required]],
      c_charge_method: [''],

      cod_banco: [null],
      monto: [null]
    });

    if (this.needCaptureAmount) {
      this.cardForm.controls.cod_banco.setValidators(Validators.required);
      this.cardForm.controls.monto.setValidators(Validators.required);
    }
  }

  async fillCardForm(data?) {
    if (!data) {
      this.saveBtnText = 'Add Card';
    } else {
      this.saveBtnText = 'Save Card';
    }
    this.cardForm.setValue({
      c_name: data && data.c_name ? data.c_name : this.titularTarj,
      c_cn1: data && data.c_cn1 ? parseInt(data.c_cn1, 10)  : null,
      c_cn2: data && data.c_cn2 ? parseInt(data.c_cn2, 10) : null,
      c_cn3: data && data.c_cn3 ? parseInt(data.c_cn3, 10) : null,
      c_cn4: data && data.c_cn4 ? parseInt(data.c_cn4, 10) : null,
      c_month: data && data.c_month ? data.c_month : null,
      c_year: data && data.c_year ? data.c_year : null,
      c_code: data && data.c_code ? data.c_code : null,
      c_type: data && data.c_type ? data.c_type : null,
      c_charge_method: (data && data.c_charge_method) ? data.c_charge_method : this.tipoPago,

      cod_banco: this.cod_banco ? this.cod_banco : null,
      monto: this.monto ? this.monto : null
    });
  }

  changeInputMax(value) {
    this.cardConfig = this.cardConf.find((x) => x.desc === value);
    if (this.cardForm.controls.c_type.value !== 'DINERS CLUB') {
      this.cardForm.controls.c_type.setValue(this.cardConfig.desc);
    }
  }

  // Función para manejar si el usuario da enter y pasar al siguiente input
  keytab(event, _maxLength) {
    // tratamos de predecir que tipo de tarjeta es
    if (event.srcElement.id === 'c_cn1') {
      let cardType: CardConfig[];

      const valueEnter = event.target.value;

      if (!valueEnter) {
        this.cn1Value = [];
      } else {
        const numValue = valueEnter;
        this.cn1Value = [];

        for (let i = 0; i < numValue.length - 1; i++) {
          this.cn1Value[i] = numValue[i];
        }

        this.cn1Value.push(numValue);

        cardType = this.cardConf.filter((x) => {
          const element = x.divine;

          const results = element.filter((n) => {
            for (let i = 0; i < this.cn1Value.length; i++) {
              return n[i].includes(this.cn1Value[i]);
            }
          });
          return results.length;
        });

        if (cardType && cardType.length > 0) {
          this.changeInputMax(cardType[0].desc);
        } else {
          if (this.cardForm.controls.c_type.value !== 'DINERS CLUB') {
            this.cardForm.controls.c_type.setValue(null);
            this.cardForm.controls.c_type.markAsTouched();
          }
        }
      }
    }

    if (
      event.srcElement.id === 'c_cn1' &&
      event.target.value.length === _maxLength
    ) {
      document.getElementById('c_cn2').focus();
    }
    if (
      event.srcElement.id === 'c_cn2' &&
      event.target.value.length === _maxLength
    ) {

      document.getElementById('c_cn3').focus();
    }
    if (
      event.srcElement.id === 'c_cn3' &&
      event.target.value.length === _maxLength
    ) {
      document.getElementById('c_cn4').focus();
    }

    if (event.srcElement.id === 'c_cn4' && event.target.value.length === 0) {
      document.getElementById('c_cn3').focus();
    }
    if (event.srcElement.id === 'c_cn3' && event.target.value.length === 0) {
      document.getElementById('c_cn2').focus();
    }
    if (event.srcElement.id === 'c_cn2' && event.target.value.length === 0) {
      document.getElementById('c_cn1').focus();
    }

  }
  //#endregion

  saveUpdate() {

    if (this.cardForm.invalid) {
      this.messageService.printStatus('Revisa el formulario, hay campos por validar', 'warning');
      this.cardForm.markAllAsTouched();
      return;
    }

    const cardData = this.cardForm.value;
    const c_number =
      String(cardData.c_cn1) +
      String(cardData.c_cn2) +
      String(cardData.c_cn3) +
      String(cardData.c_cn4);

    if (this.gateway === 'openpay') {
      this.cardData = {
        card_number: c_number,
        holder_name: cardData.c_name,
        year: String(cardData.c_year).substr(cardData.c_year.length - 2),
        month: cardData.c_month,
        cvv2: cardData.c_code
      };
    } else {
      this.cardData = {
        id: (this.card_id) ? this.card_id : null,
        card_number: c_number,
        c_name: cardData.c_name,
        c_cn1: cardData.c_cn1,
        c_cn2: cardData.c_cn2,
        c_cn3: cardData.c_cn3,
        c_cn4: cardData.c_cn4,
        c_month: cardData.c_month,
        c_year: cardData.c_year,
        c_code: cardData.c_code,
        c_type: cardData.c_type,
        c_method: cardData.c_charge_method,
        cliente_id: (this.cliente_id) ? this.cliente_id : null,
        cod_banco: cardData.cod_banco,
        monto: cardData.monto,
        icon: this.cardConfig.icon
      };
    }

    if (this.loadLoading) {
      this.generalServ.loadNgxSpinner('Registrando su información ...', null, 'loaderNgxModal');
    }
    this.tarjetaServ.saveClientCard(this.gateway, this.cardData, this.card_id).subscribe(res => {
      if (this.loadLoading) {
        this.generalServ.hideNgxSpinner('loaderNgxModal');
      }
      if (res.ok === true) {
        this.card_id = res.card;
        this.cardData.id = res.card;
        if (this.returnCapture === true) {
          this.dismiss(false, this.cardData);
        } else {
          this.dismiss(true, null);
        }
        this.toastServ.presentToast('success', res.message, 'top');
      }
    }, error => {
      console.log(error);
      this.messageService.printStatusArray(error.error.errors, 'error');
      if (this.loadLoading) {
        this.generalServ.hideNgxSpinner('loaderNgxModal');
      }
    });
  }

  dismiss(reload?, _data?) {
    this.modalEmitter.emit({
      reload,
      info: _data
    });
  }
}
