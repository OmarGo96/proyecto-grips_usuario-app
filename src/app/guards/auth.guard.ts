import { SweetMessagesService } from './../services/sweet-messages.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable, of } from 'rxjs';
import {AlertsService} from '../services/alerts.service';
import { SessionService } from '../services/session.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  public token;
  public role;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    public sweetMsg: SweetMessagesService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.check(next, state);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.check(next, state);
  }

  private check(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.token = this.sessionService.getToken();

    if (this.token === null) {
      this.sweetMsg.printStatus('Se ha expirado tu sesión, favor de ingresar de nuevo', 'warning');
      this.sessionService.logout();
      this.router.navigate(['login']);
      return false;
    } else {
       return true;
    }
  }

}
