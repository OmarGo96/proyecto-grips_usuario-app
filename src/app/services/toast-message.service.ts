import { Injectable } from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {

  constructor(public toastController: ToastController) { }

  async presentSimpleToast(theMessage, status?, position?) {
    const toast = await this.toastController.create({
      header: status ? status : '',
      message: theMessage,
      duration: 4000,
      color: 'dark',
      position: (position) ? position : 'bottom'
    });
    toast.present();
  }

  async presentToast(status: 'success' | 'error' | 'warning' | 'info', theMessage, position: 'top' | 'bottom' | 'middle', noDuration?: boolean, id?: string, cssClassEnable?: boolean) {
    let color = 'primary';
    switch (status) {
      case 'success':
        color = 'success';
        break;
      case 'error':
        color = 'danger';
        break;
      case 'warning':
        color = 'warning';
        break;
    }
    if (status !== 'info') {
      const toast = await this.toastController.create({
        message: theMessage,
        duration: noDuration ? null : 4000,
        buttons: noDuration ? [
          {
            text: 'Ok',
            role: 'cancel',
          }
        ] : null,
        color,
        position,
        id,
        cssClass: cssClassEnable ? 'custom-toast' : ''
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        header: 'Importante',
        message: theMessage,
        duration: noDuration ? null : 4000,
        position,
        cssClass: 'info-toast',
        id
      });
      toast.present();
    }
  }

  async presentToastWithOptions(message) {
    const toast = await this.toastController.create({
      header: 'Importante',
      message: message,
      keyboardClose: false,
      cssClass: 'info-toast',
      position: 'middle',
      buttons: [
        {
          text: 'Entendido',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
