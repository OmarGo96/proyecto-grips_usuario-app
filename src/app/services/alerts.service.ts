import { Injectable } from '@angular/core';
import {AlertController} from '@ionic/angular';
import {ToastMessageService} from './toast-message.service';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(private alertCtrl: AlertController, private toastMessage: ToastMessageService) { }

  public async alert(header: string, subHeader: string, message: string, buttons: string) {
    const alert = await this.alertCtrl.create({
      header,
      subHeader,
      message,
      buttons: [buttons]
    });
    await alert.present();
  }
  public async confirmAlert(header: string, message: string) {
    let choice;
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons : [
        {
          text: 'CANCEL',
          role: 'cancel',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        },
        {
          text: 'OK',
          role: 'ok',
          handler: () => {
            alert.dismiss(true);
            return false;
          }
        }
      ]
    });
    await alert.present();
    await alert.onDidDismiss().then((data) => {
      choice = data;
    });
    return choice;
  }

  public async confirmCancelRequest() {
    let choice;
    const alert = await this.alertCtrl.create({
      header: 'Cancel Request',
      subHeader: 'Are you sure to cancel?',
      message: 'Provide us a feedback in order to proceed',
      inputs: [
        {
          name: 'note_content',
          type: 'text',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            alert.dismiss(false);
          }
        },
        {
          text: 'Proceed',
          role: 'ok',
          handler: (alertData) => {
            console.log(alertData);
            if (alertData.note_content === '') {
              this.toastMessage.presentSimpleToast('Error', 'You need to provide us a feedback in order to proceed');
            } else {
              alert.dismiss(alertData);
            }
          }
        }
      ]
    });
    await alert.present();
    await alert.onDidDismiss().then((data) => {
      choice = data;
    });
    return choice;
  }
}
