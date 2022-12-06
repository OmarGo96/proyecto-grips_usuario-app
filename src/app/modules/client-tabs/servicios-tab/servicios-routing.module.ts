import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalladoComponent } from './detallado/detallado.component';

import { ServiciosPage } from './servicios.page';

const routes: Routes = [
  {
    path: '',
    component: ServiciosPage
  },
  {
    path: ':idservicio',
    component: DetalladoComponent
  },
  {
    path: '',
    redirectTo: '/partners/servicios',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosPageRoutingModule {}
