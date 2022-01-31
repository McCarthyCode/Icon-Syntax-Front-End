import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  // Subscriptions
  categoriesSub: Subscription;

  // Getters/Setters
  get isAuthenticated(): boolean {
    return this._authSrv.isAuthenticated;
  }

  get isAdmin(): boolean {
    return this._authSrv.isAdmin;
  }

  get homePage(): boolean {
    return this._router.url === '/';
  }

  get iconsPage(): boolean {
    return this._router.url === '/icons';
  }

  // Constructor
  constructor(
    private _router: Router,
    private _menuCtrl: MenuController,
    private _toastCtrl: ToastController,
    private _authSrv: AuthService
  ) {}

  // Lifecycle hooks
  ngOnInit(): void {}

  // Methods
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
          color: 'success',
        })
        .then((toast) => {
          toast.present();
          this._authSrv.credentials$.next(null);
          this._router.navigateByUrl('/icons/browse');
        });
    });
  }
}
