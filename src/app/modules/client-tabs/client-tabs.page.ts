import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonTabs, NavController } from '@ionic/angular';

@Component({
  selector: 'app-client-tabs',
  templateUrl: './client-tabs.page.html',
  styleUrls: ['./client-tabs.page.scss'],
})
export class ClientTabsPage implements OnInit {

  @ViewChild('myTabs', {static: true}) tabs: IonTabs;
  public activeTabName: any;
  constructor(
    public router: Router,
    public navigate: NavController,
  ) { }

  ngOnInit() {
  }

  navigateTo(path) {
    this.navigate.navigateRoot([`partners/${path}`])
  }

  getSelectedTab() {
    this.activeTabName = this.tabs.getSelected();
  }

}
