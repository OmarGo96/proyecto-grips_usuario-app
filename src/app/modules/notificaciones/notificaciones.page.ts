import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ViewNotificationComponent } from '../../common/modals/view-notification/view-notification.component';
import { NotifificationE } from '../../enums/notifications.enum';
import { DateConv } from '../../helpers/date-conv';
import { NotificationI } from '../../interfaces/notifications/notification.interface';
import { GeneralService } from '../../services/general.service';
import { SweetMessagesService } from '../../services/sweet-messages.service';
import {PushNotificationsService} from '../../services/push-notifications.service';
import {SessionService} from '../../services/session.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  public notifications: NotificationI[];
  public loadingInfo = false;

  public dateConv = DateConv;

  constructor(
    public authService: SessionService,
    public generalServ: GeneralService,
    public notiServ: PushNotificationsService,
    public sweetServ: SweetMessagesService,
    public modalCtr: ModalController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.realoadAtributes();
    this.listNotifications();
  }

  listNotifications() {
    this.loadingInfo = true;
    this.notifications = [];
    const data = [NotifificationE.IMPORTANT, NotifificationE.NORMAL, NotifificationE.IMPORTANT];

    this.generalServ.presentLoading();

    this.notiServ.getAll(data).subscribe(res => {
      this.loadingInfo = false;
      if (res.ok === true) {

        if (this.notifications) {
          this.notifications.push(... res.notifications);
        } else {
          this.notifications = [... res.notifications];
        }

      }

    }, error => {
      this.loadingInfo = false;
      console.log(error);
      this.generalServ.dismissLoading();
      this.sweetServ.printStatusArray(error.error.errors, 'error');
    }).add(() => {
      this.generalServ.dismissLoading();
    });
  }

  putNotiRead(idnoty) {
    let data = {
      id: idnoty
    };
    this.notiServ.notificationAsRead(data).subscribe(async res => {
      if (res.ok === true) {
        await this.notiServ.totalUnRead();
        this.listNotifications();
      }
    }, error => {
      console.log(error);
      this.sweetServ.printStatusArray(error.error.errors, 'error');
    });
  }

  realoadAtributes() {
    this.notifications = null;
  }

  async readMore(noti: NotificationI) {
    const modal = await this.modalCtr.create({
      component: ViewNotificationComponent,
      componentProps: {
        notification: noti
      },
      swipeToClose: true
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data && data.reload === true) {
      this.listNotifications();
    }
  }

}
