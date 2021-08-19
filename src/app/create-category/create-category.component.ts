import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CategoriesService } from '../categories.service';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { Category } from '../models/category.model';

const emptyCategories: Category.IClientDataList = {
  results: [],
  retrieved: new Date(),
};

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent {
  category$ = new BehaviorSubject<Category.IClientData>(null);
  categories$ = new BehaviorSubject<Category.IClientDataList>(emptyCategories);

  loading = false;
  breadcrumbs = [];

  constructor(
    private _categoriesSrv: CategoriesService,
    private _modalCtrl: ModalController,
    private _router: Router
  ) {}

  ionViewWillEnter() {
    this.loading = true;
    this._categoriesSrv.list().subscribe((categories) => {
      this.categories$.next(categories);
      this.loading = false;
    });
  }

  clickCategory(id: number): void {
    this.loading = true;
    this.breadcrumbs.push(this.category$.value);

    this._categoriesSrv.retrieve(id).subscribe((category) => {
      this.category$.next(category);

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

    this.category$.next(category);

    if (category === null) {
      this._categoriesSrv.list().subscribe((categories) => {
        this.categories$.next(categories);
        this.loading = false;
      });
    } else {
      this._categoriesSrv.retrieve(category.id).subscribe((category) => {
        this.category$.next(category);
        this.categories$.next({
          results: category.children,
          retrieved: new Date(),
        });
        this.loading = false;
      });
    }
  }

  async clickCreateCategory(): Promise<void> {
    return this._modalCtrl
      .create({
        component: CategoryModalComponent,
        componentProps: {
          parent: this.category$.value,
        },

      })
      .then((modal) => modal.present());
  }
}
