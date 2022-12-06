import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {LoadingController, Platform} from '@ionic/angular';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import { Geolocation } from '@capacitor/geolocation';
import {SweetMessagesService} from './sweet-messages.service';
import {BehaviorSubject} from 'rxjs';
import {GeneralService} from './general.service';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  //#region Atributos
  public apiUrl = environment.API_URL;
  public gpsAvailable$ = new BehaviorSubject<boolean>(true);
  //#endregion

  constructor(
    public loadingController: LoadingController,
    public httpClient: HttpClient,
    public router: Router,
    private platform: Platform,
    private sweetServ: SweetMessagesService,
    public generalServ: GeneralService
  ) {
  }

  async requestPermissions() {
    if (this.platform.is('capacitor') || this.platform.is('cordova')) {
      try {
        let res = await Geolocation.requestPermissions();
        if (res.location !== 'granted') {
          this.gpsAvailable$.next(false);
          // this.sweetServ.printWarning('GPS - WARNING', 'Es necesario habilitar el gps y darle permisos a la aplicación para una mejor experiencia.');
        } else {
          this.gpsAvailable$.next(true);
        }
      } catch (e) {
        this.gpsAvailable$.next(false);
      }

    }
  }

  async getCurrentCoords(): Promise<{ ok: boolean, lat: number, lon: number, error?: any }> {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    try {
      let res = await Geolocation.getCurrentPosition(options);
      if (res.coords) {
        this.gpsAvailable$.next(true);
        return {ok: true, lat: res.coords.latitude, lon: res.coords.longitude};
      }
    } catch (e) {
      this.gpsAvailable$.next(false);
      this.sweetServ.printWarning('GPS - WARNING', 'Es posible que tu GPS este deshabilitado, ve a configuraciónes para habilitar tu gps.');
      return {lat: 0, lon: 0, ok: false, error: e};
    }
  }
}
