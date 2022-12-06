import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoveryAccountPage } from './recovery-account.page';

const routes: Routes = [
  {
    path: ':type',
    component: RecoveryAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecoveryAccountPageRoutingModule {}
