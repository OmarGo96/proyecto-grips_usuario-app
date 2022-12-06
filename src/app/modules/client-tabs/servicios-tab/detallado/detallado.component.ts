import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsistenciasService } from '../../../../services/asistencias.service';
import {PreSolicitudI} from "../../../../interfaces/pre-solicitud/pre-solicitud.interface";

@Component({
  selector: 'app-detallado',
  templateUrl: './detallado.component.html',
  styleUrls: ['./detallado.component.scss'],
})
export class DetalladoComponent implements OnInit {

  public servicioId: number;
  public solicitud: PreSolicitudI;
  public loadingData = false;
  constructor(
    private route: ActivatedRoute,
    private asistenciaServ: AsistenciasService
  ) { }

  ngOnInit() {}

  ionViewDidEnter() {
    this.route.params.subscribe(params => {
      if (params.idservicio) {
        this.servicioId = params.idservicio;
        this.loadSolicitudData();
      }
    });
    console.log('enter view servicio detallado');
  }

  loadSolicitudData() {
    this.loadingData = true;
    this.solicitud = null;

    let data = {
      seccion: 'detallado',
      solicitud_id: this.servicioId
    }
    this.asistenciaServ.listAssistenceReq(data).subscribe(res => {
      if (res.ok === true) {
        this.solicitud = res.solicitudes;
        this.loadingData = false;
      }
    }, error => {
      this.loadingData = false;
      console.log(error);
    })
  }

}
