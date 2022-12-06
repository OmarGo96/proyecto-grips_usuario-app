import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsistenciasTabPage } from './asistencias-tab.page';
import { SolicitarComponent } from './solicitar/solicitar.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AsistenciasTabPage
      },
      {
        path: 'solicitar/:type',
        component: SolicitarComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsistenciasTabPageRoutingModule {}
