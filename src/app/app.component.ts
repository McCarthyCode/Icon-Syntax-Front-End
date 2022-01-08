import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  MenuController,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { CategoriesService } from './categories.service';
import { DOMAnimations } from './dom-animations';
import { FindService } from './find.service';
import { Category } from './models/category.model';

const emptyCategories: Category.IClientDataList = {
  results: [],
  retrieved: new Date(),
};

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
    return this._authSrv.credentials$.value !== null;
  }

  get isAdmin(): boolean {
    return (
      this._authSrv.credentials$.value !== null &&
      this._authSrv.credentials$.value.isAdmin
    );
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
    private _alertCtrl: AlertController,
    private _menuCtrl: MenuController,
    private _toastCtrl: ToastController,
    private _authSrv: AuthService,
    private _findSrv: FindService,
    private _categoriesSrv: CategoriesService
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
