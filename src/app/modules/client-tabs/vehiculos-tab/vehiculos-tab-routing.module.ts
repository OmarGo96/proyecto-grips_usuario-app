import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrarVehiculoComponent } from './registrar/registrar-vehiculo.component';

import { VehiculosTabPage } from './vehiculos-tab.page';

const routes: Routes = [
  {
    path: 'mis-vehiculos',
    component: VehiculosTabPage,
    children: [
      {
        path: 'registrar',
        component: RegistrarVehiculoComponent
      },
      {
        path: '',
        redirectTo: 'mis-vehiculos',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/partners/vehiculos/mis-vehiculos',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehiculosTabPageRoutingModule {}
