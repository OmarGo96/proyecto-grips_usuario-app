import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {PreSolicitudI} from '../../../interfaces/pre-solicitud/pre-solicitud.interface';
import {DateConv} from '../../../helpers/date-conv';
import {PreSolStatusC, PreSolStatusE} from '../../../enums/pre-sol-status.enum';
import {GeneralService} from '../../../services/general.service';
import {MatPaginator} from '@angular/material/paginator';
import {BehaviorSubject} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {SweetMessagesService} from '../../../services/sweet-messages.service';
import {GoogleMapsComponent} from '../../modals/google-maps/google-maps.component';
import {ModalController} from '@ionic/angular';
import {PreSolicitudesService} from '../../../services/pre-solicitudes.service';


@Component({
  selector: 'app-pre-solicitud-card-resume',
  templateUrl: './pre-solicitud-card-resume.component.html',
  styleUrls: ['./pre-solicitud-card-resume.component.scss'],
})
export class PreSolicitudCardResumeComponent implements OnInit, OnDestroy {

  @Input() preSolicitudes: PreSolicitudI[];
  dateHelper = DateConv;
  preSolStatus = PreSolStatusC;
  public modal: any;
  @Output() republishEmit = new EventEmitter();
  preSolStatusEnum = PreSolStatusE;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: BehaviorSubject<any>;
  dataSource: MatTableDataSource<PreSolicitudI>;
  constructor(
    public generalServ: GeneralService,
    private changeDetectorRef: ChangeDetectorRef,
    private sweetMessage: SweetMessagesService,
    public modalCtr: ModalController,
    public preSolServ: PreSolicitudesService
  ) { }

  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    if (this.preSolicitudes) {
      console.log('data-card ---> ', this.preSolicitudes);
      this.dataSource = new MatTableDataSource<PreSolicitudI>(this.preSolicitudes);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    }
  }

  rePublish(sol: PreSolicitudI) {
    console.log('rePublish --->', sol);
    this.sweetMessage.confirmRequest('¿Estás seguro de querer publicar nuevamente esta solicitud?, se generará con la fecha actual.', 'Adicional debes confirmar tu ubicación.').then(async (data) => {
      if (data.value) {
        await this.showGoogleMap(sol);
      }
    });
  }

  async showGoogleMap(sol: PreSolicitudI) {
    this.modal = await this.modalCtr.create({
      component: GoogleMapsComponent,
      swipeToClose: true,
      cssClass: 'google-map-modal',
      componentProps: {
        latitude: sol.cords.lat,
        longitude: sol.cords.lon
      }
    });

    await this.modal.present();
    const {data} = await this.modal.onWillDismiss();
    if (data) {
      const _payload = {
        pre_solicitud_id: sol.pre_sol_id,
        lat: data.lat,
        lon: data.lon
      };
      this.generalServ.presentLoading();
      const res =  await this.preSolServ._renewPreSol(_payload);
      this.generalServ.dismissLoading();
      if (res.ok) {
        this.sweetMessage.printStatus(res.message, 'success');
        this.republishEmit.emit(true);
      } else {
        this.sweetMessage.printStatusArray(res.errors.error.errors, 'error');
      }
    }

    console.log(data);
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}
