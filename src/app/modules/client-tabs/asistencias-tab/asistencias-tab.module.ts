import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsistenciasTabPageRoutingModule } from './asistencias-tab-routing.module';

import { AsistenciasTabPage } from './asistencias-tab.page';
import { AppCommonModule } from '../../../common/common.module';
import { MaterialModule } from '../../../material/material.module';
import { SolicitarComponent } from './solicitar/solicitar.component';
import { RouterModule } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {GoogleMapsJavascriptModule} from '../../../common/google-maps-javascript/google-maps-javascript.module';
import {MatSliderModule} from '@angular/material/slider';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsistenciasTabPageRoutingModule,
    AppCommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    GoogleMapsJavascriptModule,
    MatSliderModule
  ],
  declarations: [
    AsistenciasTabPage,
    SolicitarComponent
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ]
})
export class AsistenciasTabPageModule {}
