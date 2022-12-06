import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Vehiculo } from 'src/app/interfaces/vehiculo';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { RegistrarVehiculoComponent } from './registrar/registrar-vehiculo.component';

@Component({
  selector: 'app-vehiculos-tab',
  templateUrl: './vehiculos-tab.page.html',
  styleUrls: ['./vehiculos-tab.page.scss'],
})
export class VehiculosTabPage implements OnInit {

  public modal: any;
  public vehiculos: Vehiculo[];
  public loadData = false;
  constructor(
    public modalCtr: ModalController,
    private vehiculosServ: VehiculosService
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getVehiculos();
  }

  ionViewWillLeave() {
    this.vehiculos = null;
  }

  getVehiculos() {
    this.loadData = true;
    this.vehiculosServ.listVehiculos().subscribe(res => {
      if (res.ok === true) {
        this.vehiculos = res.vehiculos;
      }
    }).add(() => {
      this.loadData = false;
      console.log(this.vehiculos.length);
    });
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

}
