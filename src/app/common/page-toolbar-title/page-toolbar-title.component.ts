import { Component, Input, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import {PushNotificationsService} from "../../services/push-notifications.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-page-toolbar-title',
  templateUrl: './page-toolbar-title.component.html',
  styleUrls: ['./page-toolbar-title.component.scss'],
})
export class PageToolbarTitleComponent implements OnInit {

  @Input() title: string;
  @Input() subtitle: string;
  @Input() hideBackBtn = false;


  public headerTitle: string;
  public headerSubtitle: string;

  constructor(
    public sessionServ: SessionService,
    public notiServ: PushNotificationsService,
    public navCtr: NavController
  ) { }

  ngOnInit() {
    this.headerTitle = this.title || '';
    this.headerSubtitle = this.subtitle || '';
    this.getTotalUnReadNoti();
  }

  back() {
    this.navCtr.navigateRoot('/');
  }

  async getTotalUnReadNoti() {
    await this.notiServ.totalUnRead();
  }

  goToNotificationsList() {
    this.navCtr.navigateRoot('/notificaciones');
  }
}
