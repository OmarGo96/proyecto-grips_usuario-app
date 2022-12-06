import { Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { GoogleMapsComponent } from '../../../../common/modals/google-maps/google-maps.component';
import { SolicitudesStatus } from '../../../../enums/solicitudes-status.enum';
import { DateTransform } from '../../../../helpers/date-trans';
import { TxtConv } from '../../../../helpers/txt-conv';
import { ValidateQuestion } from '../../../../interfaces/config/validate-questions';
import { TipoPago } from '../../../../interfaces/tipo-pago';
import { TipoServicio } from '../../../../interfaces/tipo-servicio';
import { UserClient } from '../../../../interfaces/user-client';
import { Vehiculo } from '../../../../interfaces/vehiculo';
import { AsistenciasService } from '../../../../services/asistencias.service';
import { CatalogService } from '../../../../services/catalog.service';
import { GeneralService } from '../../../../services/general.service';
import { SessionService } from '../../../../services/session.service';
import { SweetMessagesService } from '../../../../services/sweet-messages.service';
import {PayServiceModalComponent} from '../../../../common/modals/pay-service-modal/pay-service-modal.component';
import {GoogleMapsJavascriptComponent} from '../../../../common/google-maps-javascript/components/google-maps-javascript.component';
import {Subscription} from 'rxjs';
import {OperatorMarkerDataI} from '../../../../interfaces/maps/operator-marker-data.interface';
import {GoogleMapsService} from '../../../../common/google-maps-javascript/services/google-maps.service';
import {DateConv} from '../../../../helpers/date-conv';
import {SolicitudType} from '../../../../types/solicitudes.types';
import {HelpI} from '../../../../interfaces/contact-help/help.interface';
import {StorageService} from '../../../../services/storage.service';
import {StorageKeysTypes} from '../../../../types/storage-keys.types';
import {MatSlider} from '@angular/material/slider';

declare let google;

@Component({
  selector: 'app-solicitar',
  templateUrl: './solicitar.component.html',
  styleUrls: ['./solicitar.component.scss']
})
export class SolicitarComponent {

  //#region ATRIBUTES
  public solicitudType: SolicitudType;

  public datosInicialesForm: UntypedFormGroup;
  public cotizacionForm: UntypedFormGroup;
  public solictudForm: UntypedFormGroup;

  public enableSolitudForm = false;
  public enableOperatorsMap = false;
  public solicitudLabel: string;

  public unsetVehiculo: boolean; // flag to unset Selected vehiculo from vehiculos selector
  public reloadData: boolean; // flag to reload getVehicles from vehiculos selector
  public noRegisterVehicles: boolean;

  public tiposPago: TipoPago[];
  public loadTipoS = false;

  public tiposServicios: TipoServicio[];
  public loadTipoP = false;

  public userData: UserClient;
  public loadProfile = false;

  public loadPreguntas = false;
  public validateQuestions: ValidateQuestion[];

  @ViewChild('googleMapsJs', {static: false}) googleMapsJs: GoogleMapsJavascriptComponent;
  public radiusValue = 0;
  selectedPinMapSub: Subscription;
  selectedOpMarker: OperatorMarkerDataI;
  opMarkers: OperatorMarkerDataI[] = [];

  public tiempoEstimado: string | number;

  public modal: any;

  public solicitudData = {
    idsolicitud: null,
    status: null,
    type: null,
    datosIniciales: null,
    cotizacion: null,
    solicitud: null,
    telefono: null,
    tiempoArribo: null,
    photosVehiculo: [],
    comprobantePago: [],
    lat: null,
    lon: null,
    selectedOperator: null,
    calcObjs: null,
    distanciaKm: null
  };
  errorPhotoVehiculo = false;

  @ViewChild('stepper', {static: true}) stepper: MatStepper;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  enableTransferContent = false;
  dateHelper = DateConv;
  solicitudMinVigencia: any;
  //#endregion

  constructor(
    private catalogServ: CatalogService,
    private formBuilder: UntypedFormBuilder,
    private sessionServ: SessionService,
    private sweetMsg: SweetMessagesService,
    private asistenciasServ: AsistenciasService,
    private generalServ: GeneralService,
    public modalCtr: ModalController,
    private route: ActivatedRoute,
    private navigate: NavController,
    private googleMapsServ: GoogleMapsService,
    private storageServ: StorageService
  )
  {

    this.datosInicialesForm = this.formBuilder.group({
      vehiculo_id: ['', Validators.required],
      tiposervicio_id: ['', Validators.required],
      vehiculo_cargado: [null]
    });

    this.solictudForm = this.formBuilder.group({
      tipo: ['', Validators.required],
      seencuentra: ['', Validators.required],
      referencias: ['', Validators.required],
      selleva: ['', Validators.required],
      tipopago_id: [''],
      fecha_hora: [''],
      telefono: ['', Validators.required],
      observaciones: ['', Validators.required]
    });

    this.cotizacionForm = this.formBuilder.group({
      subtotal: [0, Validators.required],
      total_iva: [0, Validators.required],
      total_pagar: [0, Validators.required]
    });
  }

  get datosInicialesF() {
    return this.datosInicialesForm.controls;
  }

  get cotizacionF() {
    return this.cotizacionForm.controls;
  }

  get solicitudF() {
    return this.solictudForm.controls;
  }

  ionViewDidEnter() {
    this.route.params.subscribe(params => {
      console.log(params);
      if (params.type) {
        this.solicitudType = params.type;
      }
    });
    console.log('enter view');
    this.reloadData = true;

    this.getTiposPago();
    this.getTiposServicios();
    this.getUserData();
    this.getValidateQuestions();
  }

  getTiposPago() {
    this.loadTipoP = true;
    this.catalogServ
      .loadTipoPagos()
      .subscribe(
        (res) => {
          if (res.ok === true) {
            this.tiposPago = res.tipo_pagos;
            let _tipopago = this.tiposPago.find(x => x.name.includes('TARJETA'));
            if (_tipopago) {
              this.solictudForm.controls.tipopago_id.patchValue(_tipopago.id);
              console.log('tipo pago found -->', _tipopago);
            }
          }
        },
        (error) => {
          console.log(error);
        }
      )
      .add(() => {
        this.loadTipoP = false;
      });
  }

  getTiposServicios() {
    this.loadTipoS = true;
    this.catalogServ
      .loadTiposServicios()
      .subscribe(
        (res) => {
          if (res.ok === true) {
            this.tiposServicios = res.tipo_servicios;
            const _tipoServicio = this.tiposServicios.find(x => TxtConv.txtCon(x.name, 'uppercase') === TxtConv.txtCon('local', 'uppercase'));
            if (_tipoServicio) {
              this.datosInicialesF.tiposervicio_id.patchValue(_tipoServicio.id);
            }
          }
        },
        (error) => {
          console.log(error);
        }
      )
      .add(() => {
        this.loadTipoS = false;
      });
  }

  getUserData() {
    this.loadProfile = true;
    this.sessionServ
      .loadUserData()
      .subscribe((res) => {
        if (res.ok === true) {
          this.userData = res.profile;
        }
      })
      .add(() => {
        this.loadProfile = false;
        this.solictudForm.controls.telefono.setValue(this.userData.mobile);
      });
  }

  getValidateQuestions() {
    this.loadPreguntas = true;
    if (this.datosInicialesForm.contains('preguntas')) {
      this.datosInicialesForm.removeControl('preguntas');
    }
    this.generalServ.loadValidateQuestions().subscribe(res => {
      if (res.ok  === true) {
        this.validateQuestions = res.validate_questions;
        this.datosInicialesForm.addControl('preguntas', this.formBuilder.array([]));

        for (let i = 0; i < this.validateQuestions.length; i++) {
          // @ts-ignore
          this.datosInicialesForm.controls.preguntas.push(this.initPreguntaForm(this.validateQuestions[i]));
        }
        this.loadPreguntas = false;
      }
    }, error => {
      this.loadPreguntas = false;
      console.log(error);
    });
  }

  initPreguntaForm(pregunta: ValidateQuestion) {
    return this.formBuilder.group({
      pregunta_id: [pregunta.id],
      pregunta_label: [pregunta.name],
      pregunta_response: [null, Validators.required]
    });
  }

  catchSelectVehiculo(vehiculo: Vehiculo) {
    if (vehiculo) {
      this.datosInicialesForm.controls.vehiculo_id.setValue(vehiculo.id);
    }
    if (vehiculo.tipo.name === 'PICK UP') {
      this.datosInicialesF.vehiculo_cargado.enable();
    } else {
      this.datosInicialesF.vehiculo_cargado.disable();
    }
  }

  async prepareNextStep(solicitudType: 'cotizar' | 'programar' | 'pre-solicitud' | 'select-operator', stepper: MatStepper) {
    if (this.datosInicialesForm.invalid) {
      this.datosInicialesForm.markAllAsTouched();
      return false;
    }
    switch (solicitudType) {
      case 'cotizar':
        if (this.cotizacionForm.invalid) {
          return false;
        }

        this.enableSolitudForm = false;
        this.solictudForm.controls.fecha_hora.setValue(null);
        this.solicitudData.status = SolicitudesStatus.BORRADOR;
        this.solicitudData.type = solicitudType;
        this.solicitudData.datosIniciales = this.datosInicialesForm.value;
        this.solicitudData.cotizacion = this.cotizacionForm.value;

        break;
      case 'programar':
        this.solicitudF.fecha_hora.setValue(null);
        this.solicitudData.status = SolicitudesStatus.RESERVADA;
        this.solicitudData.type = solicitudType;
        this.solicitudLabel = 'Datos Programación';
        this.solicitudF.tipo.setValue(solicitudType);
        this.tiempoEstimado = null;
        this.enableSolitudForm = true;

        this.solicitudData.datosIniciales = this.datosInicialesForm.value;
        break;
      case 'pre-solicitud':
        if (this.validateSection('datos-iniciales') === false) {
          return;
        }
        this.solicitudF.fecha_hora.setValue(null);
        this.solicitudData.status = SolicitudesStatus.RESERVADA;
        this.solicitudData.type = solicitudType;
        this.solicitudLabel = 'Datos Solicitud';
        this.solicitudF.tipo.setValue(solicitudType);
        this.enableSolitudForm = true;

        this.solicitudData.datosIniciales = this.datosInicialesForm.value;
        break;
      case 'select-operator':
        if (this.validateSection('datos-iniciales') === false) {
          return;
        }
        if (this.validateSection('solicitud-geo') === false) {
          return;
        }
        if (this.validateSection('photo-vehiculo') === false) {
          return;
        }
        this.enableOperatorsMap = true;
        await this.setOperatorsMarkers();
        break;
    }

    setTimeout(() => {
      stepper.next();
    }, 100);
  }
  async prevStep(stepper: MatStepper) {
    switch (stepper.selectedIndex) {
      case 1:
        const element = document.querySelector('#solicitudForm');
        const response = await this.isElementVisible(element);
        if (response) {
          stepper.previous();
        } else {
          element.scrollIntoView({block: 'start', behavior: 'smooth'});
        }
        break;
      case 2:
        const elementOpMaker = document.querySelector('#selectedOpMarker');
        const responseOp = await this.isElementVisible(elementOpMaker);
        if (responseOp) {
          stepper.previous();
        } else {
          elementOpMaker.scrollIntoView({block: 'start', behavior: 'smooth'});
        }
        break;
      default:
        stepper.previous();
        break;
    }
  }

  isElementVisible(domElement) {
    return new Promise(resolve => {
      const o = new IntersectionObserver(([entry]) => {
        resolve(entry.intersectionRatio === 1);
        o.disconnect();
      });
      o.observe(domElement);
    });
  }

  async showGoogleMap(formField, headerBtnLabel?: string) {
    this.modal = await this.modalCtr.create({
      component: GoogleMapsComponent,
      swipeToClose: true,
      cssClass: 'google-map-modal',
      componentProps: {
        headerBtnLabel
      }
    });

    await this.modal.present();
    const {data} = await this.modal.onWillDismiss();
    if (data.address) {
      this.solictudForm.controls[formField].setValue(data.address);
    }
    if (formField === 'seencuentra' && (data.lat || data.lon)) {
      this.solicitudData.lat = data.lat;
      this.solicitudData.lon = data.lon;
    }
  }

  catchImg(event, type: 'vehiculo' | 'pago') {
    if (type === 'vehiculo') {
      this.solicitudData.photosVehiculo.push(event);
      if (this.solicitudData.photosVehiculo.length > 0) {
        this.errorPhotoVehiculo = false;
      }
    }
    if (type === 'pago') {
      this.solicitudData.comprobantePago.push(event);
    }
  }

  /**
   * @description Obtiene el tipo de servicio seleccionado (LOCAL, FOREANEO ETC..)
   */
  getTypeServSelected(): TipoServicio {
    if (!this.datosInicialesF.tiposervicio_id.value) {
      this.cotizacionForm.reset();
      return null;
    }

    return this.tiposServicios.find(x => x.id === this.datosInicialesF.tiposervicio_id.value);
  }

  validateSection(section: 'datos-iniciales' | 'solicitud-geo' | 'photo-vehiculo') {
    let _valid;
    switch (section) {
      case 'datos-iniciales':
        if (this.datosInicialesForm.invalid || this.cotizacionForm.invalid || this.solictudForm.invalid) {
          this.solictudForm.markAllAsTouched();
          this.sweetMsg.printStatus(
            'Llene todos los campos marcados en color rojo',
            'warning'
          );
          _valid = false;
        }
        break;
      case 'solicitud-geo':
        if (!this.solicitudData.lon || !this.solicitudData.lat) {
          this.sweetMsg.printStatus('Debe indicar su geolocalización para continuar', 'warning');
          this.showGoogleMap('seencuentra');
          _valid = false;
        }
        break;
      case 'photo-vehiculo':
        if (this.solicitudData.photosVehiculo && this.solicitudData.photosVehiculo.length == 0) {
          this.sweetMsg.printStatus('Proporciónanos una foto de tu vehículo para brindarte mejor atención', 'warning');
          this.errorPhotoVehiculo = true;
          _valid = false;
        } else {
          this.errorPhotoVehiculo = false;
          _valid = true;
        }
        break;
      default:
        _valid = false;
        break;
    }
    _valid = true;
    return _valid;
  }

  checkNeedDirectContact(forceTrue?: boolean): boolean {
    if (!this.datosInicialesF.preguntas) {
      return false;
    }
    const preguntasFArray = this.datosInicialesForm.get('preguntas')['controls'];
    for (let i = 0; i < preguntasFArray.length; i++) {
      const _validateQuestion: ValidateQuestion = this.validateQuestions.find(x => x.id === preguntasFArray[i].controls.pregunta_id.value);
      if (_validateQuestion) {
        if (_validateQuestion.pregunta_forzada !== preguntasFArray[i].controls.pregunta_response.value) {
          return true;
        }
      }
    }

    if (forceTrue) {
      return true;
    }

    console.log(preguntasFArray);

    return false;
  }

  //region GOOGLE MAPS OPERATOR FUNTIONS

  // Formatea valor que se imprime la barra de progreso
  formatRadiusLabel(value: number) {
    return value.toFixed(0);
  }

  async setOperatorsMarkers() {
    if (!this.generalServ.spinner.spinnerObservable.value || (this.generalServ.spinner.spinnerObservable.value?.show == false)) {
      await this.generalServ.loadNgxSpinner('Cargando elementos ...', 'maps');
    }
    this.googleMapsJs.initMapOk$.subscribe(async res => {
      if (res) {
        await this.loadOperatorsMarkers();
        if (this.generalServ.spinner.spinnerObservable.value && this.generalServ.spinner.spinnerObservable.value.show == true) {
          await this.generalServ.hideNgxSpinner();
        }
      }
    });
    this.subscribeSelectedPinMap(true);
  }

  async loadOperatorsMarkers(newRadius?: number, matSliderRadius?: MatSlider) {
    if (!this.generalServ.spinner.spinnerObservable.value || (this.generalServ.spinner.spinnerObservable.value?.show == false)) {
      await this.generalServ.loadNgxSpinner('Cargando elementos ...', 'maps');
    }

    let _radius = this.googleMapsJs.limitCircle.getRadius() / 1000;
    if (newRadius && newRadius > 0) {
      _radius = newRadius;
      if (this.googleMapsJs.limitCircle) {
        this.googleMapsJs.limitCircle.setRadius(newRadius * 1000);
      }
    }
    if (newRadius > 9) {
      if (matSliderRadius) {
        matSliderRadius.max = 100;
      }

    } else if (newRadius < 10) {
      if (matSliderRadius) {
        matSliderRadius.max = 10;
      }
    } else if (!newRadius) {
      if (matSliderRadius) {
        matSliderRadius.max = 10;
      }
    }
    this.googleMapsJs.googleMap.fitBounds(this.googleMapsJs.limitCircle.getBounds());
    let ignoreIds = [];

    let resAvailableOp = await this.generalServ.availableOperators(this.googleMapsJs.currentLat, this.googleMapsJs.currentLong, _radius, ignoreIds);

    if (resAvailableOp.ok && resAvailableOp.data?.length > 0) {
      this.opMarkers = resAvailableOp.data;

      for (let marker of this.opMarkers) {
        marker.icon = this.googleMapsServ.operatorMarkerIcon;
      }
    } else {
      this.opMarkers = [];
      console.log('opMarkers --->', this.opMarkers);
      await this.generalServ.hideNgxSpinner();
      this.sweetMsg.confirmRequest('Lo sentimos no hay operadores disponibles en este rango.', '¿Quieres intentar con un rango de búsqueda mayor o agendar una llamada telefónica?', 'Solicitar Llamada', 'Ampliar Búsqueda').then(async (data) => {
        if (data.value) {
          await this.submit(true);
        }
      });
    }
    this.removeOutLimitMarkers();

    this.googleMapsJs.addMarkersToMap(this.opMarkers, ignoreIds);
    this.radiusValue = _radius;
    if (this.generalServ.spinner.spinnerObservable.value && this.generalServ.spinner.spinnerObservable.value.show == true) {
      await this.generalServ.hideNgxSpinner();
    }

  }

  removeOutLimitMarkers() {
    let _newOpMarkers = [];
    if (this.opMarkers && this.opMarkers.length > 0) {
      for (let i = 0; i < this.opMarkers.length; i++) {
        let _markerPosition = new google.maps.LatLng(this.opMarkers[i].position.lat, this.opMarkers[i].position.long);
        let isInRadious = this.googleMapsServ.geometrySphericalCalc('computeDistanceBetween', _markerPosition, this.googleMapsJs.limitCircle.getCenter()) <= this.googleMapsJs.limitCircle.getRadius();
        if (isInRadious) {
         _newOpMarkers.push(this.opMarkers[i]);
        }
      }
      this.opMarkers = null;
      this.opMarkers = _newOpMarkers;
      console.log('Rest markers -->', this.opMarkers);
    }
  }

  subscribeSelectedPinMap(subUnsub: boolean) {
    if (subUnsub) {
      if (!this.selectedPinMapSub) {
        this.selectedPinMapSub = this.googleMapsJs.selectedPinMap$.subscribe(res => {
          console.log('selectedPinMap$ -->', res);
          if (res && res.get('markerId')) {
            let _markerId = res.get('markerId');
            let _iconType = res.get('markerType');
            let _marker = this.opMarkers.find(x => x.id == _markerId);
            if (_marker) {
              this.selectedOpMarker = JSON.parse(JSON.stringify(_marker));
            }

            if (_iconType === 'selected-confirm') {
              this.selectedOpMarker.blocked = true;
              this.selectedOpMarker.confirm = true;
            }
          }
        });
      }
    } else {
      this.selectedPinMapSub.unsubscribe();
    }
  }

  closeMarkerInfoWindow() {
    this.googleMapsJs.changeMarkerIcon(this.selectedOpMarker.id, this.googleMapsServ.operatorMarkerIcon);
    this.selectedOpMarker = null;
  }

  confirmOperator() {
    this.sweetMsg.confirmRequest('¿Estás conforme con tu elección?', 'Tendrás 5 minutos para realizar tu pago para que tu solicitud sea atendida.').then(async (data) => {
      if (data.value) {
        if (!this.generalServ.spinner.spinnerObservable.value || (this.generalServ.spinner.spinnerObservable.value?.show == false)) {
          await this.generalServ.loadNgxSpinner('Guardando tu progreso ...', 'maps');
        }
        let _res = await this.submit();
        console.log('await submit --->', _res);
        if (this.generalServ.spinner.spinnerObservable.value && this.generalServ.spinner.spinnerObservable.value.show == true) {
          await this.generalServ.hideNgxSpinner();
        }
        if (_res.ok == false) {
           // @ts-ignore
          this.sweetMsg.printStatusArray(_res['errors'], 'error');
          return;
        } else {
          this.solicitudMinVigencia = DateConv.transFormDate(moment(), 'localTimeMoment');
          this.googleMapsJs.changeMarkerIcon(this.selectedOpMarker.id, this.googleMapsServ.operatorMarkerSelectedConfirmIcon);
          this.selectedOpMarker.confirm = true;
          this.selectedOpMarker.blocked = true;
          if (_res.id) {
            this.solicitudData.idsolicitud = _res.id;
          }
        }
      }
    });
  }

  //endregion

  async submit(needContact?: boolean) {

    if (this.validateSection('datos-iniciales') === false) { return {ok: false, errors: ['Información faltante en datos iniciales']}; }
    if (this.validateSection('solicitud-geo') === false) { return {ok: false, errors: ['Información faltante de geolocalización']}; }
    if (this.validateSection('photo-vehiculo') === false) { return {ok: false, errors: ['Información faltante sobre imagen del vehículo']}; }

    // revisamos si ocupamos mas info antes de guardar la solicitud
    if (this.checkNeedDirectContact(needContact)) {

      // abrimos ayuda
      this.setHelpData('Ponte en contacto con nosotros para darte un mejor seguimiento.');
      this.generalServ.showHelp(true);
      return;
    }

    switch (this.solicitudData.type)
    {
      case 'programar':
        this.solicitudData.solicitud = this.solictudForm.value;
        break;
      case 'pre-solicitud':
        this.solicitudData.solicitud = this.solictudForm.value;
        this.solicitudData.solicitud.tipo = 'solicitar';
        this.solicitudData.tiempoArribo = moment.utc(moment.duration(this.tiempoEstimado, 'minutes').asMilliseconds()).format('HH:mm');
        this.solicitudData.selectedOperator = this.selectedOpMarker;
        this.solicitudData.cotizacion = this.selectedOpMarker.data?.cotizacion;
        this.solicitudData.calcObjs = this.selectedOpMarker.data?.calcObjs;
        this.solicitudData.distanciaKm = this.selectedOpMarker.data?.distanciaKm;

        break;
    }

    const {value: telefono} = await this.sweetMsg.confirmContactTel(this.solicitudF.telefono.value);

    if (telefono) {
      this.solicitudData.telefono = telefono;
      if (this.solicitudData.solicitud.fecha_hora) {
        this.solicitudData.solicitud.fecha_hora = DateTransform.utc(this.solicitudData.solicitud.fecha_hora);
      }

      try {
        let res = await this.asistenciasServ._requireAssistance(this.solicitudData, this.solicitudData.type);
        if (res.ok) {
          return {ok: true, id: res.id};
        }
      } catch (e) {
        return {ok: false, errors: e.error.errors};
      }
    } else {
      return {ok: false, errors: ['Debes confirmar tu teléfono para un mejor servicio']};
    }
  }

  async confirmAndPay() {
    this.modal = await this.modalCtr.create({
      component: PayServiceModalComponent,
      swipeToClose: true,
      cssClass: '',
      componentProps: {
        totalToPay: this.selectedOpMarker.data.price,
        currency: 'MXN',
        clientId: this.userData.id,
        model: 'cms_pre_solicitudes',
        model_id: this.solicitudData.idsolicitud
      }
    });

    await this.modal.present();
    const _res = await this.modal.onWillDismiss();
    let _resData;
    if (_res.data) {
      _resData = _res.data;
    }

    if (_resData?.ok) {
      this.setHelpData();
      if (_resData.data.order) {
        console.log('_res of transactionId -->', _resData.data.order);
        await this.navigate.navigateRoot('/payment-transaction/' + _resData.data.order);
      }
    } else {
      if ((_resData.errors.error.step == 'pay' || _resData.errors.error.step == 'create_pad_solicitudes') && _resData.errors.error.data.order) {
        await this.navigate.navigateRoot('/payment-transaction/' + _resData.errors.error.data.order);
      } else {
        this.sweetMsg.printStatusArray(_resData.errors.error.errors, 'error');
      }
    }
  }

  reloadInitData() {
    setTimeout(() => { this.formGroupDirective.resetForm(); }, 0);
    this.stepper.reset();

    this.unsetVehiculo = true;
    this.reloadData = true;
    setTimeout(() => {
      this.unsetVehiculo = null;
    }, 500);
  }
  reloadAll() {
    if (this.reloadData !== true) {
      this.reloadData = true;
    }
    this.getTiposPago();
    this.getTiposServicios();
    this.getUserData();
    this.getValidateQuestions();
  }

  async setHelpData(message?: string) {
    this.generalServ.activeHelpBtn = true;
    let userPhone = this.userData && this.userData.mobile ? this.userData.mobile : null;
    let helpData: HelpI = {
      dateReg: moment().format(),
      helpTitle: message,
      solicitudType: this.solicitudType,
      id: this.solicitudData.idsolicitud,
      userTelephone: userPhone
    };
    this.storageServ.set(StorageKeysTypes.helpData, JSON.stringify(helpData));
    this.generalServ.helpData.next(helpData);

  }

  ionViewWillLeave() {
    this.reloadInitData();
    this.selectedPinMapSub.unsubscribe();
  }
}
