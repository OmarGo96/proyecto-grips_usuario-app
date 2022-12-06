import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecoveryAccountPageRoutingModule } from './recovery-account-routing.module';

import { RecoveryAccountPage } from './recovery-account.page';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecoveryAccountPageRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [RecoveryAccountPage]
})
export class RecoveryAccountPageModule {}
