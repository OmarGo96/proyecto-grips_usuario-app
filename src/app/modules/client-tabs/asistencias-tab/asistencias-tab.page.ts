import { Component, OnInit } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {PayServiceModalComponent} from '../../../common/modals/pay-service-modal/pay-service-modal.component';

@Component({
  selector: 'app-asistencias-tab',
  templateUrl: './asistencias-tab.page.html',
  styleUrls: ['./asistencias-tab.page.scss'],
})
export class AsistenciasTabPage {
  constructor(
    public navigate: NavController,
    public modalCtr: ModalController,

  ) {
  }

  navigateTo(param: 'cotizar' | 'programar' | 'pre-solicitud') {
    this.navigate.navigateRoot([`/partners/asistencias/solicitar/${param}`]);
  }
}
