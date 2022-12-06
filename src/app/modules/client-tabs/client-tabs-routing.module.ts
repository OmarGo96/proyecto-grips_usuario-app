import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientTabsPage } from './client-tabs.page';


const routes: Routes = [
  {
    path: '',
    component: ClientTabsPage,
    children: [
      {
        path: 'servicios',
        loadChildren: () => import('./servicios-tab/servicios.module').then(m => m.ServiciosPageModule)
      },
      {
        path: 'vehiculos',
        loadChildren: () => import('./vehiculos-tab/vehiculos-tab.module').then( m => m.VehiculosTabPageModule)
      },
      {
        path: 'asistencias',
        loadChildren: () => import('./asistencias-tab/asistencias-tab.module').then( m => m.AsistenciasTabPageModule)
      },
      {
        path: 'ajustes',
        loadChildren: () => import('./ajustes-tab/ajustes-tab.module').then( m => m.AjustesTabPageModule)
      },
      {
        path: '',
        redirectTo: 'asistencias',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/partners/asistencias',
    pathMatch: 'full'
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientTabsPageRoutingModule {}
