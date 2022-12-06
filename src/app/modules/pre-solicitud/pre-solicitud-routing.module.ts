import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreSolicitudPage } from './pre-solicitud.page';

const routes: Routes = [
  {
    path: ':preSolId',
    component: PreSolicitudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreSolicitudPageRoutingModule {}
