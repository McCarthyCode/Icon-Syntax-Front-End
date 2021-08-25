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
  category: Category.IClientData = null;
  categories$ = new BehaviorSubject<Category.IClientDataList>(emptyCategories);

  loading = false;
  breadcrumbs = [];

  get path(): string {
    const path: string = this.breadcrumbs
      .filter((category) => Boolean(category))
      .map((category) => category.name)
      .join(' » ');

    return path;
  }

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
    // this.breadcrumbs.push(this.category);

    this._categoriesSrv.retrieve(id).subscribe((category) => {
      this.category = category;
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

    this.category = category;

    if (category.parent === null) {
      this._categoriesSrv.list().subscribe((categories) => {
        this.categories$.next(categories);
        this.loading = false;
      });
    } else {
      this._categoriesSrv.retrieve(category.parent).subscribe((category) => {
        this.category = category;
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
          parent: this.category,
          path: this.path,
        },
      })
      .then((modal) => modal.present());
  }
}
