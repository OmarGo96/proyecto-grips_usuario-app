import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreSolicitudPageRoutingModule } from './pre-solicitud-routing.module';

import { PreSolicitudPage } from './pre-solicitud.page';
import {AppCommonModule} from "../../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreSolicitudPageRoutingModule,
    AppCommonModule
  ],
  declarations: [PreSolicitudPage]
})
export class PreSolicitudPageModule {}
