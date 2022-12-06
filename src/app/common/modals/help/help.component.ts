import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { DateTransform } from '../../../helpers/date-trans';
import { ContactMe } from '../../../interfaces/help/contact-me';
import { AsistenciasService } from '../../../services/asistencias.service';
import { GeneralService } from '../../../services/general.service';
import { SweetMessagesService } from '../../../services/sweet-messages.service';



@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {

  public contactPhone: string;
  public whatsAppInput: string;
  @Input() whatsAppTxt: string;
  @Input() helpTitle: string;
  @Input() solicitudId: number;

  public callMe = false;
  public callForm: UntypedFormGroup;
  public spinner = false;
  @Input() contactMe: ContactMe;

  constructor(
    public modalCtrl: ModalController,
    public generalServ: GeneralService,
    public formBuilder: UntypedFormBuilder,
    public sweetMsg: SweetMessagesService,
    public asistenciasServ: AsistenciasService
  ) { }

  ngOnInit() {
    if (this.generalServ.configParams) {
      let key = 'app_tel_soporte';
      let _telSupport = this.generalServ.configParams.find(x => x.key === key);
      if (_telSupport) {
        this.contactPhone = _telSupport.value;
      }
    }

    if (this.whatsAppTxt) {
      let transformTxt = this.whatsAppTxt;
      console.log(transformTxt);
      this.whatsAppInput = `https://wa.me/52${this.contactPhone}?text=${transformTxt}`;
    } else {
      this.whatsAppInput = `https://wa.me/52${this.contactPhone}`;
    }

    this.callForm = this.formBuilder.group({
      request_id: [this.solicitudId ? this.solicitudId : null],
      telefono: [this.contactMe.telephone, Validators.required],
      fechahoraprogramada: [null, Validators.required],
      comment: [this.contactMe.comment, Validators.required],
      sys_comment: [this.contactMe.sys_comment]
    });

    if (!this.helpTitle) {
      this.helpTitle = 'Parece que necesitas ayuda';
    }
  }

   // convenience getter for easy access to form fields
   get cf() {
    return this.callForm.controls;
  }

  dismiss(emit?) {
    this.modalCtrl.dismiss({
      'modal': false,
      'save': emit
    });
  }

  showCallForm() {
    this.callMe = (this.callMe === true) ? false : true;
  }

  resetContactForm() {
    this.callForm.controls.fechahoraprogramada.setValue(null);
    this.callForm.controls.comment.setValue(null);
  }

  programCall() {
    if (this.callForm.invalid) {
      this.sweetMsg.printStatus('Llena todos los campos requieridos para continuar', 'warning');
      this.callForm.markAllAsTouched();
      return;
    }
    this.spinner = true;

    if (this.contactMe && this.contactMe.sys_comment) {
      this.callForm.controls.sys_comment.setValue(this.contactMe.sys_comment);
    } else {
      this.callForm.controls.sys_comment.setValue('Llamada programada por cliente, sin solicitud previa.')
    }

    let callData = this.callForm.value;
    if (callData.fechahoraprogramada) {
      callData.fechahoraprogramada = DateTransform.utc(callData.fechahoraprogramada);
    }

    this.asistenciasServ.programPhoneCall(callData).subscribe(res => {
      this.spinner = false;
      if (res.ok === true) {
        this.sweetMsg.printStatus(res.message, 'success');
        this.resetContactForm();
        this.dismiss(true);
      }
    }, error => {
      this.spinner = false;
      this.sweetMsg.printStatusArray(error.error.errors, 'error');
      console.log(error);
    });
  }

}
