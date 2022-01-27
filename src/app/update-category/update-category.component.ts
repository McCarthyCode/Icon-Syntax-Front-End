import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CategoriesService } from '../categories.service';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss'],
})
export class UpdateCategoryComponent implements OnInit {
  category: Category.IClientData = null;
  categories$ = new BehaviorSubject<Category.IClientDataList>(null);

  loading = false;
  breadcrumbs: Category.IClientData[] = [];
  get path(): string {
    const path: string = this.breadcrumbs
      .filter((category) => Boolean(category))
      .map((category) => category.data.name)
      .join(' » ');

    return path;
  }

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _categoriesSrv: CategoriesService,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController
  ) {}

  ngOnInit(): void {}

  removeCategory(
    categories: Category.IClientDataList
  ): Category.IClientDataList {
    return {
      data: categories.data.filter((category) => {
        return category.id !== this.category.data.id;
      }),
      retrieved: categories.retrieved,
    };
  }

  ionViewWillEnter(): void {
    this.loading = true;

    this._activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        this._categoriesSrv.retrieve(+paramMap.get('id')).subscribe({
          next: (category) => {
            this.category = category;

            this._categoriesSrv.list().subscribe((categories) => {
              this.categories$.next(this.removeCategory(categories));
              this.loading = false;
            });
          },
          error: () =>
            this._alertCtrl
              .create({
                header: 'Category Not Found',
                message: 'The category could not be found in our database.',
                cssClass: 'alert',
                buttons: ['Okay'],
              })
              .then((alert) =>
                alert
                  .present()
                  .then(() => this._router.navigateByUrl('/icons/browse'))
              ),
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
        data: category.data.children.filter((cat) => {
          return cat.id !== this.category.data.id;
        }),
      };
      this.categories$.next(categories);

      this.loading = false;
    });
  }

  clickEditCategory(changePath: boolean): void {
    const presentModal = (parent: Category.IClientData) => {
      this._modalCtrl
        .create({
          component: CategoryModalComponent,
          componentProps: {
            parent: parent,
            category: this.category,
            path: changePath ? this.path : this.category.data.path,
            mode: 'update',
          },
        })
        .then((modal) => modal.present());
    };

    if (this.breadcrumbs.length > 0) {
      const clientData = this.breadcrumbs[this.breadcrumbs.length - 1]
      presentModal(clientData);
    } else {
      presentModal(null);
    }
  }

  clickBack(): void {
    if (this.breadcrumbs.length === 0) {
      this._router.navigateByUrl('/icons/browse');

      return;
    }

    const category = this.breadcrumbs.pop();

    if (this.breadcrumbs.length === 0) {
      this._categoriesSrv.list().subscribe((categories) => {
        this.categories$.next(this.removeCategory(categories));

        this.loading = false;
      });
    } else {
      this._categoriesSrv.retrieve(category.data.parent).subscribe((category) => {
        this.categories$.next(
          this.removeCategory({
            data: category.data.children,
            retrieved: new Date(),
          })
        );

        this.loading = false;
      });
    }
  }
}
