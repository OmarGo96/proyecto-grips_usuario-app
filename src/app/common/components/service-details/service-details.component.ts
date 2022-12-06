import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {PreSolicitudI} from "../../../interfaces/pre-solicitud/pre-solicitud.interface";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {PreSolicitudesService} from "../../../services/pre-solicitudes.service";
import {SweetMessagesService} from "../../../services/sweet-messages.service";
import {DateConv} from "../../../helpers/date-conv";

import {GeneralService} from "../../../services/general.service";
import {PreSolStatusC, PreSolStatusE} from "../../../enums/pre-sol-status.enum";
import {SolicitudesStatus} from "../../../enums/solicitudes-status.enum";

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
})
export class ServiceDetailsComponent implements OnInit, OnChanges {

  @Input() asModal: boolean;
  @Input() data: PreSolicitudI;
  public photoVehiculoURL: SafeResourceUrl;
  loadingPhotoVehiculo = false;
  dateHelper = DateConv;
  step = 0;
  preSolStatus = PreSolStatusC;
  constructor(
    public modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private preSolServ: PreSolicitudesService,
    public sweetServ: SweetMessagesService,
    public generalServ: GeneralService
  ) { }

  ngOnInit() {
    this.showPhotoVehiculo(1);
  }

  ngOnChanges(changes: SimpleChanges) {
    let dataChange = changes.data;
    if (dataChange.isFirstChange() === true || dataChange.firstChange === false ) {
      if (this.data) {
        console.log(this.data);
        this.evalExpandPanel();
      }
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  showPhotoVehiculo(type) {
    this.loadingPhotoVehiculo = true;

    const data = {
      pre_sol_id: this.data.pre_sol_id,
      partner_id: this.data.complementData.partner.id,
      type
    };
    this.preSolServ.getPreSolFiles(data).subscribe(res => {
      this.photoVehiculoURL = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(res));
      this.loadingPhotoVehiculo = false;
    });
  }

  evalExpandPanel() {
    setTimeout(() => {
      if (this.data.model === 'cms_pre_solicitudes') {
        switch (this.data.status) {
          case PreSolStatusE.NUEVA: // nueva
            this.setStep(0);
            break;
          case PreSolStatusE.SIENDOATENDIA:
            this.setStep(3);
            document.getElementById('operador').scrollIntoView();
            break;
        }
      } else if (this.data.model === 'cms_padsolicitudes') {
        switch (this.data.status) {
          case SolicitudesStatus.ARRIBADA:
            this.setStep(3);
            document.getElementById('operador').scrollIntoView();
            break;
          default:
            this.setStep(0);
            break;
        }
      }
    }, 500);
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'modal': false
    });
  }

}
