import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Geolocation} from '@capacitor/geolocation';
import {GoogleMapsService} from '../services/google-maps.service';
import {MapsIconI} from '../interfaces/maps-icon.interface';
import {DecimalPipe} from '@angular/common';
import {DirectionsResultI} from '../interfaces/directions-result.interface';
// @ts-ignore
import {} from '@types/google.maps';
import {BehaviorSubject} from 'rxjs';
import {SweetMessagesService} from '../../../services/sweet-messages.service';
declare let google;
const TravelMode = google.maps.TravelMode;


@Component({
  selector: 'app-google-maps-javascript',
  templateUrl: './google-maps-javascript.component.html',
  styleUrls: ['./google-maps-javascript.component.scss'],
})
export class GoogleMapsJavascriptComponent implements OnInit, AfterViewInit {

  //region ATTRIBUTES

  @Input() initRadius = 2000;
  @Input() currMarkerDraggable = false;
  @Input() currMarkerIcon: MapsIconI = this.googleMapsServ.currMarkerIcon;
  @Input() showLimitCircle = false;
  @Input() draggerMarkerLimitIcon: MapsIconI = this.googleMapsServ.draggerMarkerLimitIcon;

  @Input() showMarkers = false;
  pinMarkers: google.maps.Marker[] = [];

  initMapOk$ = new BehaviorSubject<boolean>(null);
  selectedPinMap$ = new BehaviorSubject(null);

  @Input() infoWindows: any = [];

  @ViewChild('googleMapsJs', {read: ElementRef, static: false}) mapRef: ElementRef;
  googleMap: any;
  @Input() currentLat: number;
  @Input() currentLong: number;

  @Input() enableCircleBundleMarker = true;
  limitCircle = null;
  circleBundleMarker = null;
  limitLabelInfo = null;

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  //endregion

  constructor(
    private googleMapsServ: GoogleMapsService,
    private decimalPipe: DecimalPipe,
    private sweetMsg: SweetMessagesService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.currentLat && this.currentLong) {
      this.initMap(this.currentLat, this.currentLong);
    } else {
      this.initWithCurrentLocation();
    }
  }

  //region PUBLIC METHODS
  public initWithCurrentLocation() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    Geolocation.getCurrentPosition(options).then(async (res) => {
      this.currentLat = res.coords.latitude;
      this.currentLong = res.coords.longitude;
      console.log('current locations cords --->', this.currentLat, this.currentLong);
      await this.initMap(this.currentLat, this.currentLong);
    }, async error => {
      if (error.code == 1) {
        // Forzamos a colocar playa del carmen
        this.currentLat = 20.6338054;
        this.currentLong = -87.085475;

        await this.initMap(this.currentLat, this.currentLong);
      }
    });
  }

  public calculateDistance(origin: { lat: number; long: number }, destination: { lat: number; long: number }) {

    console.log('execute calculateDistance');
    this.directionsService.route({
      origin: new google.maps.LatLng(origin.lat, origin.long) ,
      destination: new google.maps.LatLng(destination.lat, destination.long),
      travelMode: TravelMode.DRIVING
    }, (response, status) => {
      console.log('calculateAndDisplayDistance --->', response);
      if (status === 'OK') {
        this.initDirections(response);
      } else {
        console.log('Directions request failed due to --->', status);
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  public initDirections(result: DirectionsResultI) {
    const currentLocation = new google.maps.LatLng(this.currentLat, this.currentLong);
    const options = {
      center: currentLocation,
      zoom: 15,
      disableDefaultUI: true
    };
    this.googleMap = new google.maps.Map(this.mapRef.nativeElement, options);
    this.directionsDisplay.setMap(this.googleMap);
    this.directionsDisplay.setDirections(result);
  }

  public addMarkersToMap(
    markers: {position: {lat: number; long: number}, id: number, icon: MapsIconI}[],
    ignoreIds?: number[]
  ) {
    this.removeAllMarkers(ignoreIds);
    for (const marker of markers) {
      console.log('pinMakers --->', this.pinMarkers);
      let _compare = this.pinMarkers.find(x => x.get('markerId') == marker.id);
      if (_compare) {
        continue;
      }
      const position = new google.maps.LatLng(marker.position.lat, marker.position.long);
      const mapMarker = new google.maps.Marker({
        position,
        icon: marker.icon
      });
      mapMarker.set('markerId', marker.id);
      mapMarker.set('markerType', marker.icon.type);
      mapMarker.setMap(this.googleMap);

      this.pinMarkers.push(mapMarker);

      mapMarker.addListener('click', (event) => {
        if (mapMarker.get('markerType') == 'selected-confirm') {
          this.selectedPinMap$.next(mapMarker);
          this.googleMap.panTo(mapMarker.position);
          return;
        }
        if (this.reviewIsSelectedConfirm()) {
          this.sweetMsg.confirmRequest('¿Quieres cambiar tu selección por esta?').then((data) => {
            if (data.value) {
              this.restoreAllPinMarkerIconDefault();
              this.changeMarkerIcon(mapMarker.get('markerId'), this.googleMapsServ.operatorMarkerSelectedConfirmIcon);
              this.selectedPinMap$.next(mapMarker);
              this.googleMap.panTo(mapMarker.position);
            }
          });
        } else {
          this.restoreAllPinMarkerIconDefault();
          this.changeMarkerIcon(mapMarker.get('markerId'), this.googleMapsServ.operatorMarkerSelectedIcon);
          this.selectedPinMap$.next(mapMarker);
          this.googleMap.panTo(mapMarker.position);
        }

      });
    }
  }

  public changeMarkerIcon(idMarker, icon: MapsIconI) {
    let _marker = this.pinMarkers.find(x => x.get('markerId') === idMarker);
    if (_marker) {
      _marker.setIcon(icon);
      console.log('icon --->', icon);
      _marker.set('markerType', icon.type);
      console.log('changeMarkerIcon --->', _marker);
    }
  }

  public restoreAllPinMarkerIconDefault() {
    for (let marker of this.pinMarkers) {
      marker.setIcon(this.googleMapsServ.operatorMarkerIcon);
    }
  }

  public removeMarker(id: number) {
    const _markerPin = this.pinMarkers.find(x => x.get('markerId') == id);
    const _markerPinIndex = this.pinMarkers.findIndex(x => x.get('markerId') == id);
    if (_markerPin && _markerPinIndex) {
      _markerPin.setMap(null);
      this.pinMarkers.splice(_markerPinIndex, 1);
    }
  }

  public removeAllMarkers(ignoreIds?: number[]) {
    let temp = [];
    for (const marker of this.pinMarkers) {
      if (ignoreIds && ignoreIds.length > 0) {
        let findMarker = ignoreIds.find(x => x == marker.get('markerId'));
        if (findMarker) {
          temp.push(marker);
          continue;
        }
      }
      marker.setMap(null);
    }

    if (temp && temp.length > 0) {
      this.pinMarkers = temp;
    } else {
      this.pinMarkers = [];
    }

  }

  reviewIsSelectedConfirm(): boolean {
    let _find = this.pinMarkers.find(x => x.get('markerType') == 'selected-confirm');
    console.log('reviewIsSelectedConfirm', _find);
    return !!_find;
  }

  public addInfoWindowToMarker(marker) {
    let _latitude;
    let _longitude;
    _latitude = marker.position?.lat() ? marker.position.lat() : marker.latitude;
    _longitude = marker.position?.lng() ? marker.position.lng() : marker.longitude;

    console.log('addInfoWindowToMarker --->', marker);
    const infoWindowContent =
      `<div id="content">
          <h2 id="firstHeading" class="firstHeading">${marker.title}</h2>
          <p>Latitude: ${_latitude}</p>
          <p>Longitude: ${_longitude}</p>
          <ion-button id="navigate">Navigate</ion-button>
      </div>`;

    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });
    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.googleMap, marker);

      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
        document.getElementById('navigate').addEventListener('click', () => {
          console.log('navigate button clicked');
          window.open('https://www.google.com/maps/dir/?api=1&destination=' + marker.latitude + ',' + marker.longitude);
        });
      });
    });
    this.infoWindows.push(infoWindow);
  }

  public closeAllInfoWindows() {
    for(const window of this.infoWindows) {
      window.close();
    }
  }

  //endregion

  //region PRIVATE METHODS
  private async initMap(latitude, longitude) {
    const currentLocation = new google.maps.LatLng(latitude, longitude);
    const options = {
      center: currentLocation,
      zoom: 12,
      disableDefaultUI: true
    };
    this.googleMap = new google.maps.Map(this.mapRef.nativeElement, options);

    const markerCurrentPosition = new google.maps.Marker({
      position: currentLocation,
      map: this.googleMap,
      draggable: this.currMarkerDraggable,
      icon: this.currMarkerIcon
    });

    let _res = await this.googleMapsServ.getReverseCoordsData(currentLocation.lat(), currentLocation.lng());
    this.googleMapsServ.currentMarkerLocation$.next({
      position: {
        lat: currentLocation.lat(),
        long: currentLocation.lng()
      },
      geodata: (_res.ok && _res.data) ? _res.data : null
    });

    if (this.currMarkerDraggable) {
      markerCurrentPosition.addListener('dragend', async (event) => {
        let _res = await this.googleMapsServ.getReverseCoordsData(event.latLng.lat(), event.latLng.lng());
        this.googleMapsServ.currentMarkerLocation$.next({
          position: {
            lat: event.latLng.lat(),
            long: event.latLng.lng()
          },
          geodata: (_res.ok && _res.data) ? _res.data : null
        });
      });
    }

    if (this.showLimitCircle) {
      this.initCircleRadius(this.currentLat, this.currentLong, this.initRadius);
    }

    if (!this.initMapOk$.value) {
      this.initMapOk$.next(true);
    }

  }

  private initCircleRadius(centerLat: number, centerLong: number, radius: number) {
    this.limitCircle = new google.maps.Circle({
      strokeColor: '#394dc9',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#394dc9',
      fillOpacity: 0.2,
      map: this.googleMap,
      center: {
        lat: centerLat,
        lng: centerLong
      },
      radius,
      draggable: false,
    });
    console.log('circle bounds --->', this.limitCircle.getRadius());

    if (this.enableCircleBundleMarker) {
      if (radius < 999) {
        this.limitLabelInfo = `Radio ${this.decimalPipe.transform(radius)} metro(s)`;
      } else if (radius >= 1000) {
        this.limitLabelInfo = `Radio  ${this.decimalPipe.transform(radius)} Kilómetro(s)`;
      }
      this.googleMapsServ.limitRadius$.next({
        distance: radius,
        infoLabel: this.limitLabelInfo
      });

      const circleLimitMarker = this.googleMapsServ.geometrySphericalCalc('computeOffset', this.limitCircle.getCenter(), null, radius, 90, 0);

      this.circleBundleMarker = new google.maps.Marker({
        position: circleLimitMarker,
        map: this.googleMap,
        draggable: true,
        icon: this.draggerMarkerLimitIcon
      });

      this.circleBundleMarker.addListener('drag', (event) => {
        const distance2 = this.googleMapsServ.geometrySphericalCalc('computeDistanceBetween', this.limitCircle.getCenter(), this.circleBundleMarker.getPosition());
        if (distance2) {
          if (distance2 < 999) {
            this.limitLabelInfo = `Radio ${this.decimalPipe.transform(distance2)} metro(s)`;
          } else if (distance2 >= 1000) {
            this.limitLabelInfo = `Radio ${this.decimalPipe.transform(distance2)} Kilómetro(s)`;
          }
          this.limitCircle.setRadius(distance2);
        }
      });

      this.circleBundleMarker.addListener('dragend', (event) => {
        let _distance = this.limitCircle.getRadius();
        if (_distance) {
          this.googleMapsServ.limitRadius$.next({
            distance: _distance,
            infoLabel: this.limitLabelInfo
          });
        }
      });
    }
  }

  //endregion

}
