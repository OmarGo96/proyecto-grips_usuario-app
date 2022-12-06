import { Platform } from '@ionic/angular';
import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { ModalController } from '@ionic/angular';

import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { GeocoderService } from '../../../services/geocoder.service';
import {OpenStreetGeoCodeI} from '../../google-maps-javascript/interfaces/open-street-map/open-street-geocode';

declare var google;

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss'],
})
export class GoogleMapsComponent implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;

  public map: any;
  public address: string;
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() headerBtnLabel = '¿Dondé estoy?';
  public openStreetGeoCode: OpenStreetGeoCodeI;

  constructor(
    public modalCtrl: ModalController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private platform: Platform,
    public geocoderServ: GeocoderService
  ) { }

  ngOnInit() {
    this.getCurrentCoords();
  }

  getCurrentCoords() {
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    this.geolocation.getCurrentPosition(options).then((res) => {
      this.latitude = res.coords.latitude;
      this.longitude = res.coords.longitude;

      this.getAddressFromGeoCoords();

      this.initMap(this.latitude, this.longitude);
    }, error => {
      if (error.code == 1) {
        // Forzamos a colocar playa del carmen
        this.latitude = 20.6338054;
        this.longitude = -87.085475;

        this.getAddressFromGeoCoords();

        this.initMap(this.latitude, this.longitude);
      }

    });
  }


  initMap(lat, long) {
    let mapProp = {
      center: new google.maps.LatLng(lat, long),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      clickableIcons: false
    };
    let map = new google.maps.Map(this.mapElement.nativeElement, mapProp);

    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, long),
      map: map,
      draggable: true,
    });

    google.maps.event.addListener(marker, 'dragend', (event) => {
      this.latitude = event.latLng.lat();
      this.longitude = event.latLng.lng();
      this.getAddressFromGeoCoords();
    });

    google.maps.event.addListener(map, 'click', (event) => {
      this.latitude = event.latLng.lat();
      this.longitude = event.latLng.lng();
      marker.setPosition(event.latLng);
      this.getAddressFromGeoCoords();
    });
  }

  getAddressFromGeoCoords() {
    this.geocoderServ.getReverseCoordsData(this.latitude, this.longitude).subscribe(res => {
      if (res) {
        this.openStreetGeoCode = res;
        this.address = this.openStreetGeoCode.address.road
        + ', ' + this.openStreetGeoCode.address.city
        + ', ' + this.openStreetGeoCode.address.country
        + ', ' + this.openStreetGeoCode.address.state
        + ', ' + this.openStreetGeoCode.address.postcode
        + ', ' + this.openStreetGeoCode.address.country;
      }
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      console.log('getAddressFromCoords ' + lattitude + ' ' + longitude);
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5,
      };

      this.nativeGeocoder
        .reverseGeocode(lattitude, longitude, options)
        .then((result: NativeGeocoderResult[]) => {
          this.address = '';
          let responseAddress = [];
          for (let [key, value] of Object.entries(result[0])) {
            if (value.length > 0) responseAddress.push(value);
          }
          responseAddress.reverse();
          for (let value of responseAddress) {
            this.address += value + ', ';
          }
          this.address = this.address.slice(0, -2);
        })
        .catch((error: any) => {
          this.address = 'Address Not Available!';
        });
    } else {
      this.address = 'Address Not Available!'
    }
  }

  submitAddress() {
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'address': this.address ? this.address : null,
      'lat': this.latitude,
      'lon': this.longitude
    });
  }
}
