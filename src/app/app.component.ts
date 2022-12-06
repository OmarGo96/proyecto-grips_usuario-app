import { Component } from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import { AudioSoundsService } from './services/audio-sounds.service';
import { GeneralService } from './services/general.service';
import { PushNotificationsService } from './services/push-notifications.service';
import { SessionService } from './services/session.service';
import {AsistenciasService} from "./services/asistencias.service";
import {StorageService} from './services/storage.service';
import {StorageKeysTypes} from './types/storage-keys.types';
import * as moment from 'moment';
import {DateConv} from './helpers/date-conv';
import {PreSolicitudI} from './interfaces/pre-solicitud/pre-solicitud.interface';
import {GeoService} from './services/geo.service';
import {ToastMessageService} from './services/toast-message.service';
import {App} from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],

})
export class AppComponent {

  appVersion: string;

  constructor(
    private platform: Platform,
    private pushNotiServ: PushNotificationsService,
    private audioServ: AudioSoundsService,
    public generalServ: GeneralService,
    public sessionServ: SessionService,
    public asistenciasServ: AsistenciasService,
    public navigate: NavController,
    public storageServ: StorageService,
    public geoServ: GeoService,
    public toastServ: ToastMessageService
  ) {
    this.initializeApp();
  }

  initializeApp() {

    this.geoServ.gpsAvailable$.subscribe(async available => {
      let toast: HTMLIonToastElement = await this.toastServ.toastController.getTop();
      if (!available) {
        if(!toast || toast?.id !== 'GPSALERT') {
          this.toastServ.presentToast('warning', 'Es necesario habilitar el gps y darle permisos a la aplicación para una mejor experiencia.', 'bottom', true, 'GPSALERT', true);
        }
      } else {
        if (toast && toast.id === 'GPSALERT') {
          this.toastServ.toastController.dismiss(null, null, 'GPSALERT');
        }
      }
    });

    this.pushNotiServ.notificationsAvailable$.subscribe(async available => {
      let toast: HTMLIonToastElement = await this.toastServ.toastController.getTop();
      if (!available) {
        if(!toast || toast?.id !== 'NOTIFICATIONALERT') {
          this.toastServ.presentToast('warning', 'Se recomienda dar permisos y habilitar la recepción de notificaciones para una mejor experiencia.', 'bottom', true, 'NOTIFICATIONALERT', true);
        }
      } else {
        if (toast && toast.id === 'NOTIFICATIONALERT') {
          this.toastServ.toastController.dismiss(null, null, 'NOTIFICATIONALERT');
        }
      }
    });

    this.platform.ready().then(async () => {

      console.log('platform ready');

      //Obtenemos versión de app
      if (this.platform.is('capacitor') || this.platform.is('cordova')) {
        this.appVersion = 'Versión: ' + (await App.getInfo()).version
      }

      this.geoServ.requestPermissions();
      this.generalServ.checkNetworkStatus();

      if (this.sessionServ.isLogged()) {
        this.generalServ.initConfigParams();
      }

      this.audioServ.preload();
      if (this.platform.is('capacitor') || this.platform.is('cordova')) {
        this.pushNotiServ.initCapacitorNotifications();
      } else {
        await this.pushNotiServ.initWebNotifications();
      }
    });

    this.storageServ.get(StorageKeysTypes.helpData).then(async (data) => {
      let helpData = JSON.parse(data.value);
      if (helpData) {
        //revisamos fecha
        let now = DateConv.transFormDate(moment(), 'military');
        let helpDate = DateConv.transFormDate(moment(helpData.dateReg), 'military');
        if (helpDate < now) {
          this.storageServ.delete(StorageKeysTypes.helpData);
          this.generalServ.activeHelpBtn = false;
        } else {
          // revisamos con el backend
          try {
            let res: any = await this.asistenciasServ.getInProcess();
            if (res.ok && res.solicitudes) {
              let solicitudes: PreSolicitudI = res.solicitudes;
              if (solicitudes.id === helpData.id) {
                this.generalServ.activeHelpBtn = true;
                this.generalServ.helpData.next(helpData);
              }
            }
          } catch (e) {
            this.storageServ.delete(StorageKeysTypes.helpData);
            this.generalServ.activeHelpBtn = false;
          }
        }
      }
    }).catch((e) => {
      console.log('storage error -->', e);
    });
  }
}
