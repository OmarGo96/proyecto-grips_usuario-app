import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientTabsPageRoutingModule } from './client-tabs-routing.module';

import { ClientTabsPage } from './client-tabs.page';
import { AppCommonModule } from '../../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientTabsPageRoutingModule,
    AppCommonModule
  ],
  declarations: [
    ClientTabsPage
  ]
})
export class ClientTabsPageModule {}
