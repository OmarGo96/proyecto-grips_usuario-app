import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentTransactionPageRoutingModule } from './payment-transaction-routing.module';

import { PaymentTransactionPage } from './payment-transaction.page';
import {AppCommonModule} from '../../common/common.module';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentTransactionPageRoutingModule,
    AppCommonModule,
    MatButtonModule
  ],
  declarations: [PaymentTransactionPage]
})
export class PaymentTransactionPageModule {}
