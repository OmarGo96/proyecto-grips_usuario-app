import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PreSolicitudesService} from "../../services/pre-solicitudes.service";
import {PreSolicitudI} from "../../interfaces/pre-solicitud/pre-solicitud.interface";
import {GeneralService} from "../../services/general.service";

@Component({
  selector: 'app-pre-solicitud',
  templateUrl: './pre-solicitud.page.html',
  styleUrls: ['./pre-solicitud.page.scss'],
})
export class PreSolicitudPage implements OnInit {

  public preSolId: number;
  public preSolData: PreSolicitudI;
  constructor(
    private route: ActivatedRoute,
    public preSolicitudesServ: PreSolicitudesService,
    public generalServ: GeneralService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.route.params.subscribe(params => {
      if (params.preSolId) {
        this.preSolId = params.preSolId;
        this.loadPreSolData();
      }
    });
    console.log('enter view servicio detallado');
  }

  public loadPreSolData() {
    this.generalServ.presentLoading();
    this.preSolicitudesServ.getPreSolData(this.preSolId).subscribe(res => {
      if (res.ok === true) {
        this.preSolData = res.solicitud;
        this.generalServ.dismissLoading();
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });

  }
}
