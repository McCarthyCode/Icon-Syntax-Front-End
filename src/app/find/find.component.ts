import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IconDetailService } from '../icon-detail.service';
import { IconsService } from '../icons.service';
import { Category } from '../models/category.model';
import { Icon } from '../models/icon.model';
import { CategoriesService } from '../categories.service';
import { AuthService } from '../auth.service';
import { AlertController, ToastController } from '@ionic/angular';
import { DOMAnimations } from '../dom-animations';

const emptyCategories: Category.IClientDataList = {
  results: [],
  retrieved: new Date(),
};
const emptyIcons: Icon.IClientDataList = {
  results: [],
  pagination: {
    totalResults: 0,
    maxResultsPerPage: 100,
    numResultsThisPage: 0,
    thisPageNumber: 0,
    totalPages: 0,
    prevPageExists: false,
    nextPageExists: false,
  },
  retrieved: new Date(),
};

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.scss'],
})
export class FindComponent implements OnInit {
  // Behavior Subjects
  category$ = new BehaviorSubject<Category.IClientData>(null);
  categories$ = new BehaviorSubject<Category.IClientDataList>(emptyCategories);
  icons$ = new BehaviorSubject<Icon.IClientDataList>(emptyIcons);

  // Subscriptions
  iconsSub: Subscription;
  categoriesSub: Subscription;
  iconClickSub: Subscription;

  // Booleans
  loadingCategories = true;
  loadingIcons = true;
  libraryVisible = false;

  // Navigation history
  breadcrumbs: Category.IClientData[] = [];

  // Back-end parameters
  query = '';
  page = 1;

  // DOM Elements
  @ViewChild('library') library: any;
  @ViewChild('searchbar') searchbar: any;

  // Getters
  get path(): string {
    const path: string = this.breadcrumbs
      .filter((category) => Boolean(category))
      .map((category) => category.name)
      .join(' » ');

    return path;
  }

  // Event emitters
  @Output() iconClick = new EventEmitter<Icon.IIcon>();

  constructor(
    private _iconsSrv: IconsService,
    private _iconsDetailSrv: IconDetailService,
    private _categoriesSrv: CategoriesService,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    public authSrv: AuthService
  ) {}

  ngOnInit(): void {
    this._iconsDetailSrv.icon$.subscribe((icon) => {
      if (icon === null) {
        this.ionViewWillEnter();
      }
    });
  }

  ionViewWillEnter(): void {
    this.categoriesSub = this._categoriesSrv.list().subscribe((categories) => {
      this.breadcrumbs = [];
      this.categories$.next(categories);
      this.loadingCategories = false;

      this.iconsSub = this._iconsSrv.list().subscribe((icons) => {
        this.icons$.next(icons);
        this.loadingIcons = false;
      });
    });
  }

  libraryToggle() {
    DOMAnimations.slideToggle(this.library.el).then(() => {
      this.libraryVisible =
        window.getComputedStyle(this.library.el).display !== 'none';
    });
  }

  resetCategories(): void {
    this.loadingCategories = true;
  }

  resetIcons(empty = true): void {
    this.loadingIcons = true;

    if (empty) {
      this.page = 1;
      this.icons$.next(emptyIcons);
    } else {
      this.page++;
    }
  }

  onSearchbar($event: any): void {
    this.resetCategories();
    this.resetIcons();

    this.query = $event.detail.value;

    this.categoriesSub = this.category$.subscribe((category) => {
      this.loadingCategories = false;
      this.iconsSub = this._iconsSrv
        .list(
          this.query ? this.query : undefined,
          category ? category.id : undefined,
          this.page
        )
        .subscribe((icons) => {
          this.icons$.next(icons);
          this.loadingIcons = false;
        });
    });
  }

  clickCategory(id: number): void {
    this.resetCategories();
    this.resetIcons();

    this._categoriesSrv.retrieve(id).subscribe((category) => {
      this.breadcrumbs.push(category);
      this.category$.next(category);

      const categories: Category.IClientDataList = {
        retrieved: category.retrieved,
        results: category.children,
      };
      this.categories$.next(categories);
      this.loadingCategories = false;

      this._iconsSrv
        .list(
          this.query ? this.query : undefined,
          category ? category.id : undefined,
          this.page
        )
        .subscribe((icons) => {
          this.icons$.next(icons);
          this.loadingIcons = false;
        });
    });
  }

  onClear(): void {
    this.searchbar.value = '';
  }

  clickBack(): void {
    this.resetCategories();
    this.resetIcons();

    this.breadcrumbs.pop();
    const category =
      this.breadcrumbs.length > 0
        ? this.breadcrumbs[this.breadcrumbs.length - 1]
        : null;
    this.category$.next(category);

    if (category === null) {
      this._categoriesSrv.list().subscribe((categories) => {
        this.categories$.next(categories);
        this.loadingCategories = false;

        this._iconsSrv
          .list(
            this.query ? this.query : undefined,
            category ? category.id : undefined,
            this.page
          )
          .subscribe((icons) => {
            this.icons$.next(icons);
            this.loadingIcons = false;
          });
      });
    } else {
      this._categoriesSrv.retrieve(category.id).subscribe((category) => {
        this.category$.next(category);
        this.categories$.next({
          results: category.children,
          retrieved: new Date(),
        });
        this.loadingCategories = false;

        this._iconsSrv
          .list(
            this.query ? this.query : undefined,
            category ? category.id : undefined,
            this.page
          )
          .subscribe((icons) => {
            this.icons$.next(icons);
            this.loadingIcons = false;
          });
      });
    }
  }

  clickIcon(icon: Icon.IIcon): void {
    this._iconsDetailSrv.click(icon);
  }

  nextPage($event): void {
    if (!this.icons$.value.pagination.nextPageExists) {
      $event.target.complete();
      return;
    }

    this.resetIcons(false);

    this.categoriesSub = this.categories$.subscribe(() => {
      const page = this.icons$.value.pagination.thisPageNumber;
      const category = this.category$.value;

      this.iconsSub = this._iconsSrv
        .list(
          this.query ? this.query : undefined,
          category ? category.id : undefined,
          this.page
        )
        .subscribe((icons) => {
          const updated = this.icons$.value;

          if (updated) {
            updated.results.push(...icons.results);
            this.icons$.next(updated);
          } else {
            this.icons$.next(icons);
          }

          $event.target.complete();
          this.loadingIcons = false;
        });
    });
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
              buttons: [
                {
                  text: 'Okay',
                  handler: () => this.ionViewWillEnter(),
                },
              ],
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
