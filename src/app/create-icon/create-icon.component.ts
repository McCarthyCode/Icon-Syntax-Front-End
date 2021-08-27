import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CategoriesService } from '../categories.service';
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

  ionViewWillEnter(): void {
    this.loading = true;
    this._categoriesSrv.list().subscribe((categories) => {
      this.categories$.next(categories);
      this.loading = false;
    });
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

  clickCreateIcon(): void {}
}
