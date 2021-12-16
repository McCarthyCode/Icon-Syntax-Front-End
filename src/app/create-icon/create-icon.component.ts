import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CategoriesService } from '../categories.service';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { IconModalComponent } from '../icon-modal/icon-modal.component';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-create-icon',
  templateUrl: './create-icon.component.html',
  styleUrls: ['./create-icon.component.scss'],
})
export class CreateIconComponent {
  categories$ = new BehaviorSubject<Category.IClientDataList>(
    Category.emptyList
  );

  loading = false;
  breadcrumbs: Category.IClientData[] = [];

  get showAddButton(): boolean {
    const breadcrumbsLength = this.breadcrumbs.length;
    const childrenLength =
      breadcrumbsLength > 0
        ? this.breadcrumbs[breadcrumbsLength - 1].children.length
        : 0;

    return breadcrumbsLength > 0 && childrenLength === 0;
  }

  get path(): string {
    const path: string = this.breadcrumbs
      .filter((category) => Boolean(category))
      .map((category) => category.name)
      .join(' » ');

    return path;
  }

  get category(): Category.IClientData {
    const length = this.breadcrumbs.length;
    return length > 0 ? this.breadcrumbs[length - 1] : null;
  }

  constructor(
    private _categoriesSrv: CategoriesService,
    private _modalCtrl: ModalController,
    private _router: Router
  ) {}

  ionViewWillEnter(): void {
    this.loading = true;
    this._categoriesSrv.list().subscribe((categories) => {
      this.categories$.next(categories);
      this.loading = false;
    });
  }

  ionViewDidLeave(): void {
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
      this._router.navigateByUrl('/icons/browse');
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

  clickCreateIcon(): void {
    this._modalCtrl
      .create({
        component: IconModalComponent,
        componentProps: {
          category:
            this.breadcrumbs.length > 0
              ? this.breadcrumbs[this.breadcrumbs.length - 1]
              : null,
          mode: 'create',
          breadcrumbs: this.breadcrumbs,
        },
      })
      .then((modal) => modal.present());
  }

  async clickCreateCategory(): Promise<void> {
    return this._modalCtrl
      .create({
        component: CategoryModalComponent,
        componentProps: {
          parent: this.category,
          path: this.path,
          mode: 'create',
        },
      })
      .then((modal) => modal.present());
  }
}
