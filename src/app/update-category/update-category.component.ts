import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CategoriesService } from '../categories.service';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { Category } from '../models/category.model';

const emptyCategories: Category.IClientDataList = {
  results: [],
  retrieved: new Date(),
};

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss'],
})
export class UpdateCategoryComponent implements OnInit {
  category: Category.IClientData = null;
  categories$ = new BehaviorSubject<Category.IClientDataList>(emptyCategories);

  loading = false;
  breadcrumbs: Category.IClientData[] = [];
  get path(): string {
    const path: string = this.breadcrumbs
      .filter((category) => Boolean(category))
      .map((category) => category.name)
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
      results: categories.results.filter((cat) => {
        return cat.id !== this.category.id;
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
                buttons: ['Okay'],
              })
              .then((alert) =>
                alert.present().then(() => this._router.navigateByUrl('/find'))
              ),
        });
      },
    });
  }

  clickCategory(id: number): void {
    this.loading = true;

    this._categoriesSrv.retrieve(id).subscribe((category) => {
      this.breadcrumbs.push(category);

      const categories: Category.IClientDataList = {
        retrieved: category.retrieved,
        results: category.children.filter((cat) => {
          return cat.id !== this.category.id;
        }),
      };
      this.categories$.next(categories);

      this.loading = false;
    });
  }

  clickEditCategory(changePath: boolean): void {
    const presentModal = (parent: Category.IRequestBody) => {
      this._modalCtrl
        .create({
          component: CategoryModalComponent,
          componentProps: {
            parent: parent,
            category: this.category,
            path: changePath ? this.path : this.category.path,
          },
        })
        .then((modal) => modal.present());
    };

    if (this.category.id) {
      this._categoriesSrv.retrieve(this.category.id).subscribe({
        next: (parent) => {
          presentModal(parent);
        },
        error: (res) => {
          console.error(res);
        },
      });
    } else {
      presentModal(null);
    }
  }

  clickBack(): void {
    if (this.breadcrumbs.length === 0) {
      this._router.navigateByUrl('/find');

      return;
    }

    const category = this.breadcrumbs.pop();

    if (this.breadcrumbs.length === 0) {
      this._categoriesSrv.list().subscribe((categories) => {
        this.categories$.next(this.removeCategory(categories));

        this.loading = false;
      });
    } else {
      this._categoriesSrv.retrieve(category.parent).subscribe((category) => {
        this.categories$.next(
          this.removeCategory({
            results: category.children,
            retrieved: new Date(),
          })
        );

        this.loading = false;
      });
    }
  }
}
