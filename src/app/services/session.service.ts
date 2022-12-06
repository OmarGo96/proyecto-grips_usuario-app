import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserClient } from '../interfaces/user-client';
import {SweetMessagesService} from './sweet-messages.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  // region Atributos
  public JWToken = 'TK1983!';
  public profileToken = 'PF849!';
  public permissionToken = 'PSK2358!';
  public fCMToken = 'FCMTOKEN';

  public role;
  public partnerURL: string;
  public profile: any;

  public userData: UserClient;

  public apiURL = environment.API_URL;

  // endregion

  // region Constructor
  constructor(
    public httpClient: HttpClient,
    public navigate: NavController,
    private sweetMsg: SweetMessagesService
     ) {
    this.partnerURL = environment.API_PARTNER;
  }
  // endregion

  // region Métodos

  // Obtiene el token guardado en sessionStorage, si no existe devuelve null
  getToken() {
    const token = localStorage.getItem(this.JWToken);
    if (token != 'undefined') {
      return token;
    } else {
      return null;
    }
  }

  // Función para enviar las credendiales de autenticación con el backend
  signup(data): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post(this.partnerURL + '/login', data, {
      headers: headers,
    });
  }

  // Función para registar un usuario
  registerUser(data): Observable<any> {
    return this.httpClient.post<any>(`${this.partnerURL}/register`, data).pipe(map(response => {
      return response;
    }))
  }

  // función para actualizar datos de contacto
  updateProfile(data): Observable<any> {
    return this.httpClient.put<any>(`${this.partnerURL}/profile`, data).pipe(map(response => {
      return response;
    }))
  }

  // función para actualizar datos de contacto
  updateUsernameOrEmail(data): Observable<any> {
    return this.httpClient.put<any>(`${this.partnerURL}/profile/change-usr-email`, data).pipe(map(response => {
      return response;
    }))
  }

  changePassword(data): Observable<any> {
    return this.httpClient.put<any>(`${this.partnerURL}/profile/change-pwd`, data).pipe(map(response => {
      return response;
    }))
  }

  recoveryPws(data): Observable<any> {
    return this.httpClient.post<any>(`${this.apiURL}/recovery-psw`, data).pipe(map(response => {
      return response;
    }))
  }

  verifyRecTK(data): Observable<any> {
    return this.httpClient.post<any>(`${this.apiURL}/review-recovery-token`, data).pipe(map(response => {
      return response;
    }))
  }

  changePasswordRecTK(data): Observable<any> {
    return this.httpClient.post<any>(`${this.apiURL}/change-pwd-token`, data).pipe(map(response => {
      return response;
    }))
  }

  activateUserRecTK(data): Observable<any> {
    return this.httpClient.post<any>(`${this.apiURL}/activate-usr-token`, data).pipe(map(response => {
      return response;
    }))
  }

  // función para obtener datos de la cuenta del usuario
  loadUserData(): Observable<any> {
    return this.httpClient.get<any>(`${this.partnerURL}/profile`).pipe(map(response => {
      return response;
    }));
  }

  updateFMC(data): Observable<any> {
    return this.httpClient.post<any>(`${this.apiURL}/push-notifications/register`, data).pipe(map(response => {
      return response;
    }));
  }

  removeFMC(data): Observable<any> {
    return this.httpClient.post<any>(`${this.apiURL}/push-notifications/remove-token`, data).pipe(map(response => {
      return response;
    }));
  }

  setFMCToken(token) {
    localStorage.setItem(this.fCMToken, token);
  }

  getFCMToken() {
    const token = localStorage.getItem(this.fCMToken);
    if (token != 'undefined') {
      return token;
    } else {
      return null;
    }
  }

  canShowUserName(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  // función amigable para verificar si existe el token de sesión
  public isLogged(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  // Función para cerrar sesión, elimina lo almacenado en sessionStorage
  logout() {
    this.sweetMsg.confirmRequest('¿Estás seguro de querer cerrar tu sesión?', null, 'Si').then((data) => {
      if (data.value) {
        if (this.getFCMToken && this.getToken()) {
          let data =  {
            fcm_token: this.getFCMToken()
          };
          this.removeFMC(data).subscribe(res => {
            if (res.ok) {
              localStorage.removeItem(this.fCMToken);
            }
            console.log(res);
          }, error => {
            console.log(error);
          });
        }

        localStorage.removeItem(this.JWToken);
        Preferences.clear();
        // Redireccionar
        this.navigate.navigateRoot(['login']);
      }
    });
  }

  reloadPage() {
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }


}
