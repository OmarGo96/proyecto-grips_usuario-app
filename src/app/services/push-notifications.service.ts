import { Injectable } from '@angular/core';
import {
  PushNotificationSchema,
  PushNotifications,
  Token,
  ActionPerformed,
} from '@capacitor/push-notifications';


import {map, tap} from 'rxjs/operators';
import {AlertController, AnimationController, ModalController, NavController, ToastController} from '@ionic/angular';

import { SessionService } from './session.service';
import { ToastMessageService } from './toast-message.service';
import { SweetMessagesService } from './sweet-messages.service';
import { NotificationComponent } from '../common/modals/notification/notification.component';
import { Platform } from '@ionic/angular';
import { NotificationI } from '../interfaces/notifications/notification';
import { AudioSoundsService } from './audio-sounds.service';
import { environment } from '../../environments/environment';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class PushNotificationsService {
  token = null;

  public apiPartner = environment.API_PARTNER;
  public apiUrl = environment.API_URL;

  public $totalNotiUnRead = new BehaviorSubject<number>(0);

  public notificationsAvailable$ = new BehaviorSubject<boolean>(true);

  public firebaseConfig = {
    apiKey: "AIzaSyDC6cFzzsXyhFB5aV4513jwB-JV5jhwP0g",
    authDomain: "econogruas-app.firebaseapp.com",
    projectId: "econogruas-app",
    storageBucket: "econogruas-app.appspot.com",
    messagingSenderId: "810029080064",
    appId: "1:810029080064:web:5569ff5f02452d65d6c2e5",
    measurementId: "G-V2X51M4NS9"
  };

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public sessionServ: SessionService,
    public toastMsgSev: ToastMessageService,
    public sweetMsgServ: SweetMessagesService,
    public modalCtr: ModalController,
    public platform: Platform,
    public navigate: NavController,
    public audioServ: AudioSoundsService,
    private afMessaging: AngularFireMessaging,
    public animationCtrl: AnimationController,
    public httpClient: HttpClient,


  ) {
  }

  async showNotificationModal(notification: NotificationI) {

    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationCtrl.create()
        .addElement(baseEl.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      const wrapperAnimation = this.animationCtrl.create()
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'scale(0)' },
          { offset: 1, opacity: '0.99', transform: 'scale(1)' }
        ]);

      return this.animationCtrl.create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(500)
        .addAnimation([backdropAnimation]);
    };

    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
    };

    const modal = await this.modalCtr.create({
      component: NotificationComponent,
      swipeToClose: true,
      cssClass: 'custom-modal-page',

      componentProps: {
        'notification': notification
      }
    });
    await modal.present();
    this.audioServ.play();
    const {data} = await modal.onWillDismiss();
  }

  // función para notificaciones con capacitor (nativo)
  initCapacitorNotifications() {

    console.log('Initializing Capacitor Notifications');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then((result) => {

      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
        this.notificationsAvailable$.next(true);
      } else {
        this.notificationsAvailable$.next(false);
      }
    });

    PushNotifications.addListener(
      'registration',
      (token: Token) => {
        if (token.value) {
          if (this.sessionServ.isLogged()) {
            let data = {
              fcm_token: token.value
            }
            this.sessionServ.updateFMC(data).subscribe(res => {
              if (res.ok === true) {
                console.log(res.message);
              }
            }, error => {
              this.toastMsgSev.presentSimpleToast(error.error.errors[0], 'Error');
            })
          }
          this.sessionServ.setFMCToken(token.value);
        }
        console.log(
          'Push registration success, token: ',
          JSON.stringify(token.value)
        );
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      this.toastMsgSev.presentSimpleToast(error.error.errors[0], 'Error al registrarse para recibir notificaciones.');
      console.log('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {

        let _notiI: NotificationI = {
          title: notification.title,
          body: notification.body,
          data: null
        };

        if (notification.data) {
          _notiI.data = notification.data;
        }

        await this.showNotificationModal(_notiI);
        console.log('Push received: ', notification);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        if (notification.notification.data.url) {
          this.navigate.navigateRoot([notification.notification.data.url]);
        }
        console.log('Push action performed: ', notification);
      }
    );
  }

  // función para notificaciones con web push pwa
  async initWebNotifications() {

    //TODO: Revisar este código si no remover
    if (localStorage.getItem('unReadNotifications') && localStorage.getItem('unReadNotifications') === 'y') {
      await this.showNotificationModal
      (
        {
          title: 'Tienes notificaciones sin leer',
          body: 'Da click en mas detalles para visualizar todos los resultados',
          data: {
            module: 'notifications',
            idobject: 'test',
            section: 'test',
            url: null
          }
        }
      );

    }

    (await this.requestPermission()).subscribe(async token => {

      if (token) {
        if (this.sessionServ.isLogged()) {
          let data = {
            fcm_token: token,
            audience: 1
          };
          this.sessionServ.updateFMC(data).subscribe(res => {
            if (res.ok === true) {
              console.log(res.message);
              //this.toastMsgSev.presentToast(res.message, 'Exitoso');
            }
          }, error => {
            this.toastMsgSev.presentSimpleToast(error.error.errors[0], 'Error');
          })
        }
        this.sessionServ.setFMCToken(token);
      }

      this.getMessages().subscribe(async (msg: any) => {

        console.log('PWA Notification recived: ', msg);

          let _notiI: NotificationI = {
            title: msg.notification.title,
            body: msg.notification.body,
            data: null
          };

          if (msg.data) {
            _notiI.data = msg.data;
          }

        await this.showNotificationModal(_notiI);

      });
    }, async error => {
      console.log(error);
      this.toastMsgSev.presentSimpleToast('Este navegador no soporta notificaciones push', 'Error', 'top');
    });
  }

  async requestPermission() {
    let pathWorker = '';
    if (environment.production === false) {
      pathWorker = 'firebase-messaging-sw.js';
    } else {
      pathWorker = '/econogruas/firebase-messaging-sw.js';
    }

    let finish = await navigator.serviceWorker.register(pathWorker).then(async (registration) => {
      return true;
    }).catch(e => {
      console.log('error register sw', e);
      return false;
    });

    if (finish) {
      return this.afMessaging.requestToken.pipe(
        tap(token => {
          console.log('Store token to server: ', token);
        })
      );
    } else {
      this.sweetMsgServ.printWarning('NOTIFICACIONES', 'Se recomienda dar permisos y habilitar la recepción de notificaciones para una mejor experiencia.');
      // this.toastMsgSev.presentSimpleToast('Este navegador no soporta notificaciones push', 'Error', 'top');
    }
  }

  getMessages() {
    return this.afMessaging.messages;
  }


  getAll(data?): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/notifications/list`, data).pipe(map(res => {
      return res;
    }));
  }

  notificationAsRead(data): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/notifications/mark-read`, data).pipe(map(res => {
      return res;
    }));
  }

  async totalUnRead() {
    try {
      let response = await this.httpClient.get(`${this.apiUrl}/notifications/total-unread`).toPromise();
      if (response['ok']) {
        this.$totalNotiUnRead.next(response['total']);
      }
    } catch (e) {
      console.log('Error during get total unread noti -->', e);
    }
  }
}
