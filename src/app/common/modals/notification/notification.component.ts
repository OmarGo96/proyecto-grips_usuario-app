import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NotificationI } from '../../../interfaces/notifications/notification';
import {PushNotificationsService} from "../../../services/push-notifications.service";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  @Input() notification: NotificationI;

  constructor(
    public viewCtrl: ModalController,
    public navigate: NavController,
    public notiServ: PushNotificationsService
  ) { }

  ngOnInit() {
    console.log('modal noti init ', this.notification)
  }

  moreDetails() {
    let url = null;
    if (this.notification && this.notification.data) {
      if (this.notification.data.url) {
        url = this.notification.data.url;
      } else if (!this.notification.data.url) {
        url = `/${this.notification.data.module}/${this.notification.data.section}/${this.notification.data.idobject}`
      }
    }

    if (url) {
      let data = {
        id: this.notification.data.notification_id
      };
      this.notiServ.notificationAsRead(data).subscribe(res => {
      }, error => { console.log('put notification as read fails --->', error); });
      this.navigate.navigateRoot([url]);
      this.dismiss();
    }
  }

  public dismiss() {
    if (this.notification.data.notification_id) {
      let data = {
        id: this.notification.data.notification_id
      };
      this.notiServ.notificationAsRead(data).subscribe(res => {
      }, error => { console.log('put notification as read fails --->', error); });
    }
    this.viewCtrl.dismiss();
  }

}
