import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { JwtInterceptor } from 'src/interceptors/jwt-interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import {NgxSpinnerModule} from 'ngx-spinner';
import {AppCommonModule} from './common/common.module';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
    declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios'
    }),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('combined-sw.js', {enabled: environment.production}),
    AngularFireModule.initializeApp(environment.firebase, ''),
    AngularFireMessagingModule,
    NgxSpinnerModule,
    AppCommonModule,
    MatIconModule,
  ],
    providers: [
        Geolocation,
        NativeGeocoder,
        NativeAudio,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always', defaultColor: 'primary' } },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
