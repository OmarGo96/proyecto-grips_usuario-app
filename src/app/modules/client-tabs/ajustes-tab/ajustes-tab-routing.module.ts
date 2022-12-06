import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AjustesTabPage } from './ajustes-tab.page';

const routes: Routes = [
  {
    path: 'perfil',
    component: AjustesTabPage
  },
  {
    path: '',
    redirectTo: '/partners/ajustes/perfil',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjustesTabPageRoutingModule {}
