import { Component, EventEmitter, HostListener, Input, OnChanges, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { Vehiculo } from '../../interfaces/vehiculo';
import { RegistrarVehiculoComponent } from '../../modules/client-tabs/vehiculos-tab/registrar/registrar-vehiculo.component';
import { VehiculosService } from '../../services/vehiculos.service';

@Component({
  selector: 'app-vehiculos-selector',
  templateUrl: './vehiculos-selector.component.html',
  styleUrls: ['./vehiculos-selector.component.scss'],
})
export class VehiculosSelectorComponent implements OnChanges {

  public modal: any;
  public vehiculos: Vehiculo[];
  public loadData = false;
  public tinySlider: any;
  public selectedVehiculo: Vehiculo;
  @ViewChildren('vehiculoitems') vehiculoItems: QueryList<any>;
  @ViewChild('slideWithNav', {static: false}) slideWithNav: IonSlides;
  @Output() emitSelectVehiculo = new EventEmitter();
  @Output() totalVehiclesEmit = new EventEmitter();
  @Input() unsetVehiculo: boolean;
  @Input() reloadData: boolean;
  @Input() makeSolicitud: boolean;

  sliderOne: any;
  slideOptions = {
    initialSlide: 0,
    slidesPerView: 2,
    autoplay: false,
    speed: 400
  };

  constructor(
    public modalCtr: ModalController,
    private vehiculosServ: VehiculosService
  ) { }

  @HostListener('window:resize')
  onResize() {
    setTimeout(() => this.slideWithNav.update(), 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    let vChange = changes.unsetVehiculo;
    let rChange = changes.reloadData;
    if (vChange && (vChange.firstChange === true || vChange.isFirstChange() === false)) {
      if (this.unsetVehiculo === true) {
        this.selectedVehiculo = null;
      }
    }

    if (rChange && (rChange.firstChange === true || rChange.isFirstChange() === false)) {
      if (this.reloadData === true) {
        this.getVehiculos();
        this.selectedVehiculo = null;
      }
    }

  }

  getVehiculos() {
    this.loadData = true;
    let _makeSolicitud = false;
    if (this.makeSolicitud && this.makeSolicitud) {
      _makeSolicitud = true;
    }
    this.vehiculosServ.listVehiculos(_makeSolicitud).subscribe(res => {
      if (res.ok === true) {
        this.vehiculos = res.vehiculos;
        this.totalVehiclesEmit.emit(this.vehiculos.length);
      }
    }).add(() => {
      this.loadData = false;
      this.sliderOne =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: this.vehiculos
      };
    });
  }

  pickVehiculo(vehiculo: Vehiculo) {
    this.selectedVehiculo = vehiculo;
    this.emitSelectVehiculo.emit(this.selectedVehiculo);
  }

  async showRegister(vehiculo_id?) {
    this.modal = await this.modalCtr.create({
      component: RegistrarVehiculoComponent,
      swipeToClose: true,
      componentProps: {
        'vehiculoId': (vehiculo_id && vehiculo_id > 0) ? vehiculo_id : null
      }
    });

    await this.modal.present();
    const {data} = await this.modal.onWillDismiss();
    if (data.saved && data.saved === true) {
      this.getVehiculos();
    }
  }

   // Move to Next slide
   slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  // Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  // Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView, event) {
    this.checkIfNavDisabled(object, slideView);
  }

  // Call methods to check if slide is first or last to enable disbale navigation
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }

  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

  restartSlides() {
    this.slideWithNav.slideTo(0, 500);
  }
}
