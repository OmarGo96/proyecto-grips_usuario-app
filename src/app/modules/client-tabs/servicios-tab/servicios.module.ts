import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';



import { ServiciosPage } from './servicios.page';
import { ServiciosPageRoutingModule } from './servicios-routing.module';
import { EnProcesoComponent } from './en-proceso/en-proceso.component';
import { HistoricoComponent } from './historico/historico.component';
import { AppCommonModule } from '../../../common/common.module';
import { MaterialModule } from '../../../material/material.module';
import { DetalladoComponent } from './detallado/detallado.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiciosPageRoutingModule,
    AppCommonModule,
    MaterialModule
  ],
  declarations: [
    ServiciosPage,
    EnProcesoComponent,
    HistoricoComponent,
    DetalladoComponent
  ]
})
export class ServiciosPageModule {}
