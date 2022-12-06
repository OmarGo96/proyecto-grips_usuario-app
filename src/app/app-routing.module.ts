import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'landing',
    loadChildren: () => import('./modules/landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./modules/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'otp',
    loadChildren: () => import('./modules/recovery-account/recovery-account.module').then( m => m.RecoveryAccountPageModule)
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'partners',
        loadChildren: () => import('./modules/client-tabs/client-tabs.module').then( m => m.ClientTabsPageModule)
      },
      {
        path: 'notificaciones',
        loadChildren: () => import('./modules/notificaciones/notificaciones.module').then( m => m.NotificacionesPageModule)
      },
      {
        path: 'partners/cms_pre_solicitudes',
        loadChildren: () => import('./modules/pre-solicitud/pre-solicitud.module').then(m => m.PreSolicitudPageModule)
      },
      {
        path: 'payment-transaction',
        loadChildren: () => import('./modules/payment-transaction/payment-transaction.module').then( m => m.PaymentTransactionPageModule)
      }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
