import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalController } from '@ionic/angular';
import { Solicitud } from '../../../../interfaces/solicitud';
import { GeneralService } from '../../../../services/general.service';
import { SessionService } from '../../../../services/session.service';
import { SweetMessagesService } from '../../../../services/sweet-messages.service';
import {PreSolicitudI} from "../../../../interfaces/pre-solicitud/pre-solicitud.interface";
import {PreSolicitudesService} from "../../../../services/pre-solicitudes.service";

@Component({
  selector: 'app-en-proceso',
  templateUrl: './en-proceso.component.html',
  styleUrls: ['./en-proceso.component.scss'],
})
export class EnProcesoComponent implements OnInit, OnChanges {

  loadData = false;

  listSolicitudes: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public pickedSolicitud: Solicitud;
  @Input() solicitudes: Solicitud[];

  public preSolicitud: PreSolicitudI[] = [];

  constructor(
    public modalCtr: ModalController,
    public generalServ: GeneralService,
    public sessionServ: SessionService,
    public sweetMsg: SweetMessagesService,
    public preSolServ: PreSolicitudesService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.initPickedSolicitud();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let solicitudChange = changes.solicitudes;
    if (solicitudChange.firstChange === false || solicitudChange.isFirstChange() === true) {
      if (this.solicitudes) {
        this.initPickedSolicitud();
      }
    }

  }


  initPickedSolicitud() {
    this.pickedSolicitud = {
      id: 0
    }
    let rowData = [];
    this.solicitudes.forEach(element => {
      rowData.push({
        id: element.id,
        tipo_servicio: element.servicio.name,
        status: GeneralService.getServStatusString(element.state),
        fecha_hora_reservacion: element.fecha_hora_reservacion,
        alias_vehiculo: element.vehiculo.alias,
        marca_vehiculo: element.vehiculo.marca.name,
        tipo_vehiculo: element.vehiculo.tipo.name,
        clase_vehiculo: element.vehiculo.clase.name,
        color_vehiculo: element.vehiculo.color.name,
        placas_vehiculo: element.vehiculo.placas,
        grua_asignada: (element.grua && element.grua.name) ? element.grua.name: null,
        grua_operador: (element.operador && element.operador.employee) ? element.operador.employee.name : null,
        total_pago: element.amount_total,
        tipo_pago: (element.tipopago && element.tipopago.name) ? element.tipopago.name : null,
        tipopago_id: element.tipopago_id,
        pagos: element.pagos
      })
    });
    console.log(rowData);
    this.listSolicitudes = new MatTableDataSource(rowData);
    setTimeout(() => {
      this.listSolicitudes.sort = this.sort;
      this.listSolicitudes.paginator = this.paginator3;
    }, 100);
  }

   //#region SEARCH FUNCTIONS

  applyFilterTable(event?: Event) {
    this.listSolicitudes.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  // Method to clear input search filter
  onSearchClearFilterTable() {
    this.searchKey = '';
    this.applyFilterTable();
  }

  checkNeedComprobante(solicitud: Solicitud): boolean {
    if (solicitud.tipopago_id === 3 && (solicitud.pagos && solicitud.pagos.length == 0)) {
      return true;
    }

    return false;
  }

  //#endregion


}
