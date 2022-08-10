import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _authSrv: AuthService,
    private _router: Router,
    private _toastCtrl: ToastController
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const credentials = this._authSrv.credentials$.value;
    if (!credentials) {
      this.redirectToLogin(state);
      return false;
    }

    if (route.data && route.data.allowAdmin) {
      if (!credentials.isAdmin) {
        this._toastCtrl
          .create({
            message: `You do not have permission to access the resource at ${state.url}.`,
            position: 'bottom',
            color: 'warning',
            duration: 5000,
            cssClass: 'toast',
            buttons: [{ text: 'Close', role: 'cancel' }]
          })
          .then((toast) => toast.present());
      }
      return credentials.isAdmin;
    }

    return true;
  }

  redirectToLogin(state: RouterStateSnapshot): void {
    this._router.navigate(['/login'], {
      queryParams: { redirect: state.url }
    });
  }
}
