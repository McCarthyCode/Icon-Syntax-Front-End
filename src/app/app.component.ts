import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private _menuCtrl: MenuController,
    private _authSrv: AuthService,
    private _toastCtrl: ToastController,
    private _router: Router
  ) {}

  get isAuthenticated(): boolean {
    return this._authSrv.credentials$.value !== null;
  }

  get findPage(): boolean {
    return this._router.url === '/find';
  }

  onMenuClick(): void {
    this._menuCtrl.close();
  }

  logout(): void {
    this._authSrv.logout().subscribe(() => {
      this._toastCtrl
        .create({
          message: 'You have successfully logged out.',
          buttons: [{ text: 'Close', role: 'dismiss' }],
          duration: 5000,
          cssClass: 'toast',
          position: 'top',
          color: 'success'
        })
        .then((toast) => {
          toast.present();
          this._authSrv.credentials$.next(null);
          this._router.navigateByUrl('/');
        });
    });
  }
}
