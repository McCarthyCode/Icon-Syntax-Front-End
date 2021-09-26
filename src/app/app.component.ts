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

  get findPage(): boolean {
    return this._router.url === '/find';
  }

  get categories$(): BehaviorSubject<Category.IClientDataList> {
    return this._findSrv.categories$;
  }

  get loadingCategories(): boolean {
    return this._findSrv.loadingCategories;
  }
  set loadingCategories(value) {
    this._findSrv.loadingCategories = value;
  }

  get breadcrumbs(): Category.IClientData[] {
    return this._findSrv.breadcrumbs;
  }
  set breadcrumbs(value) {
    this._findSrv.breadcrumbs = value;
  }

  get libraryVisible(): boolean {
    return this._findSrv.libraryVisible;
  }
  set libraryVisible(value) {
    this._findSrv.libraryVisible = value;
  }

  // DOM Elements
  @ViewChild('searchbar') searchbar: any;

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
  ngOnInit(): void {
    this.loadingCategories = true;

    this.categoriesSub = this._categoriesSrv.list().subscribe((categories) => {
      this.breadcrumbs = [];
      this.categories$.next(categories);
      this.loadingCategories = false;
    });
  }

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
          this._router.navigateByUrl('/');
        });
    });
  }

  onSearchbar($event: any): void {
    this._findSrv.onSearchbar($event.detail.value);
  }

  onClear(): void {
    this._findSrv.query = '';
    this.searchbar.value = '';
  }

  onClickCategory(id: number): void {
    this._findSrv.onClickCategory(id);
  }

  onClickBack(): void {
    this._findSrv.onClickBack();
    this.libraryVisible = true;
  }

  libraryToggle() {
    this.libraryVisible = !this.libraryVisible;
  }

  updateCategory(category: Category.IClientData): void {
    this._categoriesSrv.update(category).subscribe();
  }

  deleteCategory(id: number): void {
    this._categoriesSrv.retrieve(id).subscribe({
      next: (category) => {
        this._alertCtrl
          .create({
            header: 'Confirm Category Deletion',
            message:
              'Are you sure you want to delete the category "' +
              category.name +
              '"?',
            cssClass: 'alert',
            buttons: [
              { text: 'Cancel', role: 'dismiss' },
              { text: 'Okay', handler: () => this._deleteCategory(id) },
            ],
          })
          .then((alert) => alert.present());
      },
      error: (res) => console.error(res),
    });
  }

  private _deleteCategory(id: number): void {
    this._categoriesSrv.delete(id).subscribe(
      (success) => {
        if (success) {
          this._alertCtrl
            .create({
              header: 'Category Deleted',
              message: 'The category has been removed successfully.',
              cssClass: 'alert',
              buttons: [{ text: 'Okay', handler: this.ngOnInit }],
            })
            .then((alert: HTMLIonAlertElement) => alert.present());
        }
      },
      (error) => {
        switch (error.status) {
          case 403:
            this._toastCtrl
              .create({
                message:
                  'You do not have permission to perform the requested action.',
                position: 'bottom',
                color: 'warning',
                duration: 5000,
                cssClass: 'toast',
                buttons: [
                  {
                    text: 'Close',
                    role: 'cancel',
                  },
                ],
              })
              .then((toast) => toast.present());
            break;

          case 500:
          default:
            this._alertCtrl
              .create({
                header: 'Error Deleting Category',
                message:
                  'A server error has prevented the category from being removed. Please try again later.',
                cssClass: 'alert',
                buttons: ['Okay'],
              })
              .then((alert: HTMLIonAlertElement) => alert.present());
            break;
        }
      }
    );
  }
}
