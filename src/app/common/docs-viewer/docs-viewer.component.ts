import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DocViewerI } from '../../interfaces/doc-viewer.interface';

@Component({
  selector: 'app-docs-viewer',
  templateUrl: './docs-viewer.component.html',
  styleUrls: ['./docs-viewer.component.scss'],
})
export class DocsViewerComponent implements OnInit {

  @Input() document: DocViewerI;
  constructor(
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss({
    });
  }

}
