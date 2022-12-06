import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Solicitud } from '../../interfaces/solicitud';
import { AsistenciasService } from '../../services/asistencias.service';
import { GeneralService } from '../../services/general.service';
import { SessionService } from '../../services/session.service';
import { SweetMessagesService } from '../../services/sweet-messages.service';
import { WireTransferDataComponent } from '../modals/wire-transfer-data/wire-transfer-data.component';

@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.scss'],
})
export class DetalleServicioComponent implements OnInit {

  public modal: any;
  @Input() solicitud: Solicitud;
  @Output() requestReload = new EventEmitter();
  comprobantePago = [];
  constructor(
    public modalCtr: ModalController,
    public asistenciasServ: AsistenciasService,
    public sweetServ: SweetMessagesService,
    public generalServ: GeneralService,
    public userServ: SessionService
  ) {
  }

  ngOnInit() {}

  checkNeedComprobante(solicitud: Solicitud): boolean {
    if (solicitud.tipopago_id === 3 && (solicitud.pagos && solicitud.pagos.length == 0)) {
      return true;
    }

    return false;
  }

  async showTransferBank() {
    this.modal = await this.modalCtr.create({
      component: WireTransferDataComponent,
      swipeToClose: true,
    });

    await this.modal.present();
  }

  catchImg(event, type: 'vehiculo' | 'pago', solicitud: Solicitud) {
    if (type === 'pago') {
      let data = {
        comprobantePago: [event],
        id: solicitud.id
      }
      this.generalServ.presentLoading();
      this.asistenciasServ.attachWT(data).subscribe(res => {
        if (res.ok === true) {
          this.generalServ.dismissLoading();
          this.sweetServ.printStatus(res.message, 'success');
          this.requestReload.emit(true);
        }
      }, error => {
        this.generalServ.dismissLoading();
        console.log(error);
        this.sweetServ.printStatusArray(error.error.errors, 'error');
      });
    }
  }

}
