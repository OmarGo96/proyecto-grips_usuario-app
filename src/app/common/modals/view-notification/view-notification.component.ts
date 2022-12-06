import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import { NotificationI } from '../../../interfaces/notifications/notification.interface';
import { SweetMessagesService } from '../../../services/sweet-messages.service';
import {PushNotificationsService} from '../../../services/push-notifications.service';
import {DateConv} from "../../../helpers/date-conv";
import {GeneralService} from "../../../services/general.service";
import {PreSolicitudesService} from "../../../services/pre-solicitudes.service";

@Component({
  selector: 'app-view-notification',
  templateUrl: './view-notification.component.html',
  styleUrls: ['./view-notification.component.scss'],
})
export class ViewNotificationComponent implements OnInit {

  @Output() emitReloadNoti = new EventEmitter();
  @Input() notification: NotificationI;
  public dateConv = DateConv;

  constructor(
    public modalCtrl: ModalController,
    public notiServ: PushNotificationsService,
    public sweetServ: SweetMessagesService,
    public generalServ: GeneralService,
    public preSolServ: PreSolicitudesService,
    public navCtrl: NavController
    ) {}

  ngOnInit() {}

  putNotiRead(idnoty, justMark?: boolean) {
    let data = {
      id: idnoty
    }
    this.notiServ.notificationAsRead(data).subscribe(res => {
      if (res.ok === true) {
        if (!justMark) {
          this.dismiss(true);
        }

      }
    }, error => {
      console.log(error);
      this.sweetServ.printStatusArray(error.error.errors, 'error');
    });
  }

  acceptService() {
    let _data =  {
      pre_sol_id: this.notification.model_id
    };
    this.generalServ.presentLoading();
    this.preSolServ.acceptPreSol(_data).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.sweetServ.printStatus(res.message, 'success');
        this.putNotiRead(this.notification.id, true);
        this.navCtrl.navigateRoot(['/partners/servicios']);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
      this.sweetServ.printStatusArray(error.error.errors, 'error');
    });
  }

  dismiss(needRealod: boolean) {
    this.modalCtrl.dismiss({
      reload: needRealod
    });
  }
}
