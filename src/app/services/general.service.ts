import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingController, ModalController, NavController} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {ConfigParams} from '../interfaces/config/config-params';
import {PreSolicitudI} from '../interfaces/pre-solicitud/pre-solicitud.interface';
import {PreSolStatusE} from '../enums/pre-sol-status.enum';
import {SweetMessagesService} from './sweet-messages.service';
import {SolicitudesStatus} from '../enums/solicitudes-status.enum';
import {PreSolicitudesService} from './pre-solicitudes.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {HelpComponent} from '../common/modals/help/help.component';
import {HelpI} from '../interfaces/contact-help/help.interface';
import {Network} from '@capacitor/network';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {

  //#region Atributos
  public apiUrl = environment.API_URL;
  public configParams: ConfigParams[];
  public availableFleets: number;
  public verifyEmail$ = new BehaviorSubject(null);
  public ngxLoaderMsg: string;

  public activeHelpBtn = false;
  public helpData = new BehaviorSubject<HelpI>(null);

  public netWorkStatus$ = new BehaviorSubject<boolean>(null);
  //#endregion

  constructor(
    public loadingController: LoadingController,
    public httpClient: HttpClient,
    public router: Router,
    public sweetServ: SweetMessagesService,
    public preSolServ: PreSolicitudesService,
    public navCtrl: NavController,
    public spinner: NgxSpinnerService,
    public modalCtr: ModalController,
    public navigate: NavController
    ) {}


  public static getServStatusString(status) {
    switch (status) {
      case 'reserved':
        return 'RESERVADA';
      case 'draft':
        return 'BORRADOR';
      case 'arrived':
        return 'ARRIBADA';
      case 'open':
        return 'ABIERTA';
      case 'paid':
        return 'PAGADA';
      case 'paidlocked':
        return 'VALIDANDO PAGO';
      case 'paidvalid':
        return 'PAGO VALIDADO';
      case 'locked':
        return 'ENCIERRO';
      case 'cancel':
        return 'CANCELADA';
      case 'closed':
        return 'CERRADA';
      case 'invoiced':
        return 'FACTURADA';
      case 'receivable':
        return 'CUENTA X COBRAR';
      case 'relased':
        return 'LIBERADA';
      case 'call_request':
        return  'SOLICITUD DE LLAMADA';
      case 'quot_request':
        return  'SOLICITUD DE COTIZACIÓN';
      case 'on_transit':
        return 'OPERADOR EN TRANSITO';
      default:
        return 'EN PROCESO';
    }
  }

  async presentLoading(message?) {
    const loading = await this.loadingController.create({
      cssClass: 'loading-controller',
      message: (message) ? message : 'Cargando datos ...',
      duration: 4000
    });
    await loading.present();
  }

  dismissLoading() {
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 500);
  }

  // Función para cargar el loader spinner del stepper
  async loadNgxSpinner(message, source?: 'maps', id?: string) {
    let type = 'square-jelly-box';
    switch (source) {
      case 'maps':
        type = 'ball-scale-multiple';
        break;
    }
    this.ngxLoaderMsg = message;
    //this.showSpinner = true;
    await this.spinner.show(id ? id : 'loaderNgx', {
      bdColor: 'rgb(75 75 75 / 57%)',
      color: '#f5f5f5',
      type,
      fullScreen: true,
      size: 'default',
      zIndex: 99999,
    });
  }

  // Función para ocultar el loader spinner del stepper
  async hideNgxSpinner(id?) {
    this.ngxLoaderMsg = null;
    //this.showSpinner = false;
    await this.spinner.hide(id ? id : 'loaderNgx');
  }

  initConfigParams() {
    this.loadConfigParams().subscribe(res => {
      if (res.ok === true) {
        this.configParams = res.config_params;
      }
    }, error => {
      console.log(error);
    });
  }

  /** @deprecated */
  public checkAvailableFleets(): Observable<number> {
    return this.httpClient.get<any>(`${this.apiUrl}/config/available/fleets`).pipe(map(response => {
      return response.total_available;
    }));
  }

  public async availableOperators(origin_lat: number, origin_long: number, radio: number, ignoreIds?: number[]) {
    let _payload = {
      origin_lat,
      origin_long,
      radio,
      ignoreIds
    };
    try {
      let res = await this.httpClient.post<any>(`${this.apiUrl}/maps/available-operators`, _payload).toPromise();
      if (res.ok) {
        return res;
      }
    } catch (e) {
      return {ok: false, error: e};
    }
  }

  public loadValidateQuestions(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/config/validate-questions`).pipe(map(response => {
      return response;
    }));
  }

  private loadConfigParams(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/config/params`).pipe(map(response => {
      return response;
    }));
  }

  isAvailable(data: PreSolicitudI): boolean {
    switch (data.model) {
      case 'cms_pre_solicitudes':
        const availableSts = [PreSolStatusE.NUEVA, PreSolStatusE.SIENDOATENDIA, PreSolStatusE.CONFIRMADAACEPTADA, PreSolStatusE.VALIDANDOPAGO];
        return availableSts.some(x => x === data.status);
        break;
      case 'cms_padsolicitudes':
        const availableSts2 = [SolicitudesStatus.RESERVADA, SolicitudesStatus.BORRADOR, SolicitudesStatus.ARRIBADA, SolicitudesStatus.ABIERTA, SolicitudesStatus.ONTRANSIT];
        return availableSts2.some(x => x === data.status);
        break;
      default:
        return false;
    }
  }

  canShowTimeCounter(data: PreSolicitudI): boolean {
    switch (data.model) {
      case 'cms_pre_solicitudes':
        const visibleStatus = [PreSolStatusE.NUEVA, PreSolStatusE.SIENDOATENDIA, PreSolStatusE.CONFIRMADAACEPTADA];
        return visibleStatus.some(x => x === data.status);
        break;
      default:
        return false;
    }
  }

  canShowBtnAction(action: 'accept-service' | 'cancel-service', model, data) {
    switch (model) {
      case 'cms_pre_solicitudes':
        switch (action) {
          case 'accept-service':
            return false;
            // let acceptValidSts = [PreSolStatusE.NUEVA, PreSolStatusE.SIENDOATENDIA];
            // if (acceptValidSts.some(x => x === data.status) && data.complementData.fleetData) {
            //   return true;
            // } else {
            //   return false;
            // }
            break;
          case 'cancel-service':
            let cancelValidSts = [PreSolStatusE.NUEVA, PreSolStatusE.SIENDOATENDIA, PreSolStatusE.CONFIRMADAACEPTADA];
            return cancelValidSts.some(x => x === data.status);
            break;
        }
        break;
    }
    return false;
  }

  canShowAccordeon(accordName: 'datos-servicio' | 'preguntas' | 'datos-vehiculo' | 'cobro' | 'arribo' | 'firma' | 'operador', model: 'cms_pre_solicitudes' | 'cms_padsolicitudes' | string, data ) {
    switch (accordName) {
      case 'datos-servicio':
      case 'preguntas':
      case 'datos-vehiculo':
        return true;
        break;
      case 'operador':
        if (data.complementData.fleetData) {
          return true;
        } else {
          return false;
        }
        break;
      case 'cobro':
        if (data.complementData.cotizacion && data.complementData.cotizacion.items.length > 0) {
          return true;
        } else {
          return false;
        }
        break;
      case 'arribo':
        if (model === 'cms_padsolicitudes') {
          if (data.status === SolicitudesStatus.ARRIBADA) {
            return true;
          } else {
            return false;
          }
        }
        break;
      case 'firma':
        if (model === 'cms_padsolicitudes') {
          if (data.status === SolicitudesStatus.CERRADA) {
            return true;
          } else {
            return false;
          }
        }
        break;
    }
    return false;
  }

  acceptService(data: PreSolicitudI) {
    if (data.model && data.model === 'cms_padsolicitudes') {
      this.sweetServ.printStatus('Esta solicitud no puede ser aceptada', 'warning');
      return;
    }

    if (data.status && data.status !== PreSolStatusE.SIENDOATENDIA) {
      this.sweetServ.printStatus('Esta solicitud no puede ser aceptada', 'warning');
      return;
    }

    let _data =  {
      pre_sol_id: data.pre_sol_id
    };
    this.presentLoading();
    this.preSolServ.acceptPreSol(_data).subscribe(res => {
      this.dismissLoading();
      if (res.ok === true) {
        this.sweetServ.printStatus(res.message, 'success');
        setTimeout(() => {
          location.reload();
        }, 4500);
        //this.navCtrl.navigateRoot(['/partners/servicios']);
      }
    }, error => {
      this.dismissLoading();
      console.log(error);
      this.sweetServ.printStatusArray(error.error.errors, 'error');
    });
  }

  cancelService() {
    console.log('cancel service');
    // TODO: Falta definir flujo de cancelación
    this.sweetServ.printStatus('Acción en desarrollo, falta definir flujo de cancelación', 'warning');
    return;
  }

  async showHelp(navigate?: boolean) {
    let _id = this.helpData.value ? this.helpData.value.id : null;
    const modal = await this.modalCtr.create({
      component: HelpComponent,
      swipeToClose: true,
      cssClass: 'help-contact-modal',
      componentProps: {
        solicitudId: _id,
        whatsAppTxt: `Solicito asistencia para programar una llamada con relación a un servicio ${(_id) ? 'con id: ' + _id : ''}, favor de contactarse conmigo.`,
        helpTitle: (this.helpData.value) ? this.helpData.value.helpTitle : null,
        contactMe: {
          comment: `Solicito asistencia para  programar una llamada con relación un servicio ${(_id) ? 'con id: ' + _id : ''}, favor de contactarse conmigo.`,
          telephone: (this.helpData.value && this.helpData.value.userTelephone) ? this.helpData.value.userTelephone : null,
          sys_comment: `Cliente solicita asistencia para  programar una llamada con relación ${(_id) ? 'para servicio con id: ' + _id : ''}`
        }
      }
    });

    await modal.present();
    const {data} = await modal.onWillDismiss();
    // if (data) {
    //   this.activeHelpBtn = false;
    // }
    if (data.save === true) {
      if (navigate) {
        this.navigate.navigateRoot(['/partners/asistencias']);
      } else {
        console.log('HelpComponent data --->', data);
      }

    }
  }

  checkNetworkStatus() {
    Network.addListener('networkStatusChange', status => {
      this.netWorkStatus$.next(status.connected);
      console.log('network status -->', status);
    });
  }


}
