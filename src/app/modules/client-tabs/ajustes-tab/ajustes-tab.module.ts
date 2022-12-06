import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjustesTabPageRoutingModule } from './ajustes-tab-routing.module';

import { AjustesTabPage } from './ajustes-tab.page';
import { MaterialModule } from '../../../material/material.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { AppCommonModule } from '../../../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjustesTabPageRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    IonicSelectableModule,
    AppCommonModule
  ],
  declarations: [AjustesTabPage]
})
export class AjustesTabPageModule {}
