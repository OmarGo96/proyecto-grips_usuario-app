import { Component, OnInit } from '@angular/core';
import { Solicitud } from '../../../interfaces/solicitud';
import { AsistenciasService } from '../../../services/asistencias.service';
import {PreSolicitudI} from "../../../interfaces/pre-solicitud/pre-solicitud.interface";
import {PreSolicitudesService} from "../../../services/pre-solicitudes.service";
import {forkJoin, Observable} from "rxjs";


@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  view: 'proceso' | 'historico' = 'proceso';
  public tab: string;
  public solicitudes: Solicitud[];
  public preSolicitudes: PreSolicitudI[] = [];
  public loadingData = false;
  public preSolLoading = false;

  constructor(
    private asistenciasServ: AsistenciasService,
    private preSolServ: PreSolicitudesService
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.tab = 'proceso';
    this.loadAsistenciasProceso(this.tab);
  }

   // Función para cambiar tab
   changeInfo(tab) {
    switch (tab) {
      case 'proceso':
        this.solicitudes = null;
        this.loadAsistenciasProceso(tab);
        break;
      case 'historico':
        this.solicitudes = null;
      // llamar servicio para obtener historico
        this.loadAsistenciasProceso(tab);
        break;

    }
    this.tab = tab;
  }

  loadAsistenciasProceso(seccion) {
    this.loadingData = true;
    this.solicitudes = null;
    this.preSolicitudes = [];
    let data = {
      seccion
    };

    this.preSolLoading = true;

    this.requestDataFromMultipleSources(data).subscribe(res => {
      this.preSolLoading = false;
      this.loadingData = false;
      if (res[0].ok === true) {
        if (res[0].preSolicitudes.length > 0) {
          for (let i = 0; i < res[0].preSolicitudes.length; i++) {
            this.preSolicitudes.push(
              res[0].preSolicitudes[i]
            );
          }

          console.log(this.preSolicitudes);
        }
      }
      if (res[1].ok === true) {
        if (res[1].solicitudes.length > 0) {
          for (let j = 0; j < res[1].solicitudes.length; j++) {
            this.preSolicitudes.push(
              res[1].solicitudes[j]
            );
          }

        }
      }

      console.log(res);
    }, error => {
      this.preSolLoading = false;
      this.loadingData = false;
      console.log(error);
    });

  }


  public requestDataFromMultipleSources(data): Observable<any[]> {
    let response1 = this.preSolServ.getPreSolSection(data);
    let response2 = this.asistenciasServ.listAssistenceReq2(data);
    return forkJoin([response1, response2]);
  }

  needReload(event, tab?) {
    if (tab) {
      this.tab = tab;
    }
    if (event === true) {
      this.loadAsistenciasProceso(this.tab);
    }
  }

}
