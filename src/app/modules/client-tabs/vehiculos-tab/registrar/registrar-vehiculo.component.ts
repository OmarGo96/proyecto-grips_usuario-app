import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ModalController } from '@ionic/angular';
import { ClaseVehiculo } from 'src/app/interfaces/clase-vehiculo';
import { ColorVehiculo } from 'src/app/interfaces/color-vehiculo';
import { MarcaVehiculo } from 'src/app/interfaces/marca-vehiculo';
import { TipoVehiculo } from 'src/app/interfaces/tipo-vehiculo';
import { Vehiculo } from 'src/app/interfaces/vehiculo';
import { GeneralService } from 'src/app/services/general.service';
import { SweetMessagesService } from 'src/app/services/sweet-messages.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';

@Component({
  selector: 'app-registrar-vehiculo',
  templateUrl: './registrar-vehiculo.component.html',
  styleUrls: ['./registrar-vehiculo.component.scss'],
})
export class RegistrarVehiculoComponent implements OnInit {

  registerForm: UntypedFormGroup;
  public spinner = false;
  @Output() saveEmitter = new EventEmitter();
  @Input() vehiculoId: number;
  public marcasVehiculo: MarcaVehiculo[];
  public loadMarcasV = false;
  public clasesVehiculo: ClaseVehiculo[];
  public loadClasesV = false;
  public tiposVehiculo: TipoVehiculo[];
  public loadTiposV = false;
  public tipoVIcon: string;
  public coloresVehiculo: ColorVehiculo[];
  public loadColoresV = false;

  public vehiculoData: Vehiculo;
  public title: string;
  public submitBtnLabel: string;

  constructor(
    public modalCtrl: ModalController,
    private formBuilder: UntypedFormBuilder,
    private sweetMsg: SweetMessagesService,
    private vehiculosServ: VehiculosService,
    public generalServ: GeneralService
  ) {
    this.registerForm = this.formBuilder.group({
      id: [''],
      marca_id: ['', Validators.required],
      clase_id: ['', Validators.required],
      clase: ['', Validators.required],
      tipovehiculo_id: ['', Validators.required],
      anio: ['', Validators.required],
      colorvehiculo_id: ['', Validators.required],
      color: ['', Validators.required],
      placas: ['', Validators.required],
      noserie: [''],
      alias: ['', Validators.required]
    })
   }

   get cf() {
    return this.registerForm.controls;
  }

  ngOnInit() {
    this.listMarcas();
    this.listColores();
    this.listTipos();
    if (this.vehiculoId && this.vehiculoId > 0) {
      this.getVehiculoData();
      this.title = 'Actualizar Vehículo';
      this.submitBtnLabel = 'ACTUALIZAR';
    } else {
      this.title = 'Registrar Vehículo';
      this.submitBtnLabel = 'REGISTRAR';
    }
  }

  getVehiculoData() {
    let data = {
      id: this.vehiculoId
    }
    this.generalServ.presentLoading();
    this.vehiculosServ.showVehiculo(data).subscribe(res => {
      if (res.ok === true) {
        this.vehiculoData = res.vehiculo;
        this.listClases(null, this.vehiculoData.marca_id);
        this.fillRegisterForm(this.vehiculoData);
        this.tipoVIcon = this.vehiculoData.tipo.icon_name;
        this.generalServ.dismissLoading();
      }
    }, error => {
      console.log(error);
      this.sweetMsg.printStatusArray(error.error.errors, 'error');
      this.generalServ.dismissLoading();
      this.dismiss();
    }).add(() => {
      this.registerForm.controls.clase.setValue(this.vehiculoData.clase.name);
      this.registerForm.controls.color.setValue(this.vehiculoData.color.name);
    })
  }

  fillRegisterForm(data) {
    this.registerForm.setValue({
      id: (data && data.id) ? data.id : null,
      marca_id: (data && data.marca_id) ? data.marca_id : null,
      clase: (data && data.clase) ? data.clase : null,
      clase_id: (data && data.clase_id) ? data.clase_id : null,
      anio: (data && data.anio) ? data.anio : null,
      tipovehiculo_id: (data && data.tipovehiculo_id) ? data.tipovehiculo_id : null,
      color: (data && data.color) ? data.color : null,
      colorvehiculo_id: (data && data.colorvehiculo_id) ? data.colorvehiculo_id : null,
      noserie: (data && data.noserie) ? data.noserie : null,
      placas: (data && data.placas) ? data.placas : null,
      alias: (data && data.alias) ? data.alias : null
    });
  }

  listMarcas() {
    this.loadMarcasV = true;
    this.vehiculosServ.listMarcas().subscribe(res => {
      if (res.ok === true) {
        this.marcasVehiculo = res.marcas_vehiculo;
      }
    }).add(() => {
      this.loadMarcasV = false;
      if (this.marcasVehiculo && this.marcasVehiculo.length > 0) {
        if (!this.vehiculoId || this.vehiculoId === 0) {
          this.registerForm.controls.marca_id.setValue(this.marcasVehiculo[0].id);
          this.listClases(null, this.marcasVehiculo[0].id);
        }
      }
    });
  }

  listClases(select?: MatSelectChange, id?:number) {
    let data = {
      marca_id: (select && select.value) ? select.value : id
    }
    this.loadClasesV = true;
    this.vehiculosServ.listClases(data).subscribe(res => {
      if (res.ok == true) {
        if (!id) {
          this.registerForm.controls.clase.setValue(null);
        }
        this.clasesVehiculo = res.clases_vehiculo;
      }
    }).add(() =>  {
      this.loadClasesV = false;
    });
  }

  getClase(select?: MatSelectChange) {
    let clase: ClaseVehiculo;
    clase = this.clasesVehiculo.find(x => x.id === select.value);

    if (clase) {
      this.registerForm.controls.clase.setValue(clase.name);
    }
  }

  listTipos() {
    this.loadTiposV = true;
    this.vehiculosServ.listTipos().subscribe(res => {
      if (res.ok === true) {
        this.tiposVehiculo = res.tipo_vehiculos;
      }
    }).add(() => {
      this.loadTiposV = false;
    });
  }

  getIcon(select?: MatSelectChange) {
    let tipoV: TipoVehiculo;
    tipoV = this.tiposVehiculo.find(x => x.id === select.value);
    if (tipoV) {
      this.tipoVIcon = tipoV.icon_name;
    }
  }

  listColores() {
    this.loadColoresV = true;
    this.vehiculosServ.listColores().subscribe(res => {
      if (res.ok === true) {
        this.coloresVehiculo = res.color_vehiculos;
      }
    }).add(() => {
      this.loadColoresV = false;
    });
  }

  getColor(select?: MatSelectChange) {
    let color: ColorVehiculo;
    color = this.coloresVehiculo.find(x => x.id === select.value);
    if (color) {
      this.registerForm.controls.color.setValue(color.name);
    }
  }

  submit() {
    if (this.registerForm.invalid) {
      this.sweetMsg.printStatus('Falta información, favor verificar el formulario', 'warning');
      console.log(this.registerForm.value);
      this.registerForm.markAllAsTouched();
      return;
    }

    this.spinner = true;

    this.vehiculosServ.registrar(this.registerForm.value).subscribe(res => {
      if (res.ok === true) {
        this.sweetMsg.printStatus(res.message, 'success');
        this.saveEmitter.emit(true);
        setTimeout(() => {
          this.modalCtrl.dismiss({
            'saved': true
          });
        }, 1500);
      }
    }, error => {
      this.sweetMsg.printStatusArray(error.error.errors, 'error');
      console.log(error);
    }).add(() => {
      this.spinner = false;
    });
  }

  deleteVehiculo(id) {
    this.sweetMsg.confirmDelete().then((data) => {
      if (data.value) {
        this.spinner = true;
        let data = {
          id: id
        }

        this.vehiculosServ.deleteVehiculo(data).subscribe(res => {
          if (res.ok === true) {
            this.sweetMsg.printStatus(res.message, 'success');
            this.saveEmitter.emit(true);
            setTimeout(() => {
              this.modalCtrl.dismiss({
                'saved': true
              });
            }, 1500);
          }
        }, error => {
          this.sweetMsg.printStatusArray(error.error.errors, 'error');
          console.log(error);
        }).add(() => {
          this.spinner = false;
        })
      } else {
        this.sweetMsg.dismissDelete();
      }
    })
  }


  dismiss() {
    this.modalCtrl.dismiss({
    });
  }

}
