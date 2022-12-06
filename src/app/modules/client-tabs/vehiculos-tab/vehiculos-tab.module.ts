import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehiculosTabPageRoutingModule } from './vehiculos-tab-routing.module';

import { VehiculosTabPage } from './vehiculos-tab.page';
import { RegistrarVehiculoComponent } from './registrar/registrar-vehiculo.component';
import { MaterialModule } from 'src/app/material/material.module';
import { AppCommonModule } from '../../../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VehiculosTabPageRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    AppCommonModule
  ],
  declarations: [
    VehiculosTabPage,
    RegistrarVehiculoComponent,
  ]
})
export class VehiculosTabPageModule {}
