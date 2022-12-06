import { NgModule } from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {GoogleMapsJavascriptComponent} from './components/google-maps-javascript.component';
import {HttpClientModule} from '@angular/common/http';



@NgModule({
  declarations: [
    GoogleMapsJavascriptComponent
  ],
  exports: [
    GoogleMapsJavascriptComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    DecimalPipe
  ]
})
export class GoogleMapsJavascriptModule { }
