import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  MenuController,
  ModalController,
} from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CategoriesService } from '../categories.service';
import { IconModalComponent } from '../icon-modal/icon-modal.component';
import { IconsService } from '../icons.service';
import { Category } from '../models/category.model';
import { Icon } from '../models/icon.model';

@Component({
  selector: 'app-update-icon',
  templateUrl: './update-icon.component.html',
  styleUrls: ['./update-icon.component.scss'],
})
export class UpdateIconComponent implements OnInit {
  categories$ = new BehaviorSubject<Category.IClientDataList>(
    Category.emptyList
  );
  icon: Icon.IClientData;

  loading = false;
  breadcrumbs: Category.IClientData[] = [];

  get path(): string {
    const path: string = this.breadcrumbs
      .filter((category) => Boolean(category))
      .map((category) => category.name)
      .join(' » ');

    return path;
  }

  get category(): Category.IClientData {
    const breadcrumbsLength = this.breadcrumbs.length;
    if (breadcrumbsLength === 0) {
      return null;
    }
    return this.breadcrumbs[breadcrumbsLength - 1];
  }

  get showEditButton(): boolean {
    const breadcrumbsLength = this.breadcrumbs.length;
    const category = this.breadcrumbs[breadcrumbsLength - 1];
    return breadcrumbsLength > 0 && category.children.length === 0;
  }

  removeCategory(
    categories: Category.IClientDataList
  ): Category.IClientDataList {
    return {
      results: categories.results.filter((category) => {
        return this.icon ? category.id !== this.icon.category : true;
      }),
      retrieved: categories.retrieved,
    };
  }

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _alertCtrl: AlertController,
    private _categoriesSrv: CategoriesService,
    private _iconsSrv: IconsService,
    private _modalCtrl: ModalController,
    private _menuCtrl: MenuController,
    private _router: Router
  ) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.loading = true;
    this._menuCtrl.close('end');

    const iconNotFoundAlert = () =>
      this._alertCtrl
        .create({
          header: 'Icon Not Found',
          message: 'The icon could not be found in our database.',
          buttons: ['Okay'],
        })
        .then((alert) =>
          alert.present().then(() => this._router.navigateByUrl('/find'))
        );

    this._activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        this._iconsSrv.retrieve(+paramMap.get('id')).subscribe({
          next: (icon: Icon.IClientData) => {
            if (!icon) {
              iconNotFoundAlert();
            }

            this.icon = icon;

            this._categoriesSrv.list().subscribe((categories) => {
              this.categories$.next(this.removeCategory(categories));

              this._categoriesSrv
                .retrieve(icon.category)
                .subscribe((category) => {
                  this.loading = false;
                });
            });
          },
          error: () => iconNotFoundAlert(),
        });
      },
    });
  }

  ionViewDidLeave() {
    this.breadcrumbs = [];
  }

  clickCategory(id: number): void {
    this.loading = true;

    this._categoriesSrv.retrieve(id).subscribe((category) => {
      this.breadcrumbs.push(category);

      const categories: Category.IClientDataList = {
        retrieved: category.retrieved,
        results: category.children,
      };
      this.categories$.next(categories);
      this.loading = false;
    });
  }

  clickBack(): void {
    this.loading = true;
    const category = this.breadcrumbs.pop();

    if (category === undefined) {
      this._router.navigateByUrl('/find');
      return;
    }

    if (category.parent === null) {
      this._categoriesSrv.list().subscribe((categories) => {
        this.categories$.next(categories);
        this.loading = false;
      });
    } else {
      this._categoriesSrv.retrieve(category.parent).subscribe((category) => {
        this.categories$.next({
          results: category.children,
          retrieved: new Date(),
        });
        this.loading = false;
      });
    }
  }

  clickEditIcon(changePath: boolean): void {
    if (changePath) {
      this._modalCtrl
        .create({
          component: IconModalComponent,
          componentProps: {
            icon: this.icon,
            category: this.category,
            path: changePath
              ? this.path
              : this.category
              ? this.category.path
              : '',
            mode: 'update',
            breadcrumbs: this.breadcrumbs,
          },
        })
        .then((modal) => modal.present());
    } else {
      this._categoriesSrv.retrieve(this.icon.category).subscribe((category)=>{
        this._modalCtrl
        .create({
          component: IconModalComponent,
          componentProps: {
            icon: this.icon,
            category: category,
            path: category ? category.path : '',
            mode: 'update',
            breadcrumbs: this.breadcrumbs,
          },
        })
        .then((modal) => modal.present());
      })
    }
  }
}
