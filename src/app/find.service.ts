import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CategoriesService } from './categories.service';
import { IconsPage } from './icons-page/icons-page.page';
import { IconsService } from './icons.service';
import { Category } from './models/category.model';
import { Icon } from './models/icon.model';

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

@Injectable({
  providedIn: 'root',
})
export class FindService {
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

  // Attributes
  query = '';
  categoryId: number;
  page = 1;

  allIcons = false;
  path = '';

  constructor(
    private _iconsSrv: IconsService,
    private _categoriesSrv: CategoriesService
  ) {}

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

  onAllIconsChange(checked: boolean): void {
    this.resetCategories();
    this.resetIcons();

    this.allIcons = checked;

    if (this.categoriesSub) this.categoriesSub.unsubscribe();
    this.categoriesSub = this.category$.subscribe((category) => {
      // this.loadingCategories = false;

      if (this.iconsSub) this.iconsSub.unsubscribe();
      this.iconsSub = this._iconsSrv
        .list(
          this.query ? this.query : undefined,
          this.allIcons ? undefined : this.categoryId,
          this.page
        )
        .subscribe((icons) => {
          this.icons$.next(icons);
          this.loadingIcons = false;
        });
    });
  }

  onSearchbar(query: string): void {
    this.resetCategories();
    this.resetIcons();

    this.query = query;

    if (this.categoriesSub) this.categoriesSub.unsubscribe();
    this.categoriesSub = this.category$.subscribe((category) => {
      // this.loadingCategories = false;

      if (this.iconsSub) this.iconsSub.unsubscribe();
      this.iconsSub = this._iconsSrv
        .list(
          this.query ? this.query : undefined,
          this.allIcons ? undefined : this.categoryId,
          this.page
        )
        .subscribe((icons) => {
          this.icons$.next(icons);
          this.loadingIcons = false;
        });
    });
  }

  onClickCategory(): void {
    this.resetCategories();
    this.resetIcons();

    this.allIcons = false;

    if (this.categoryId === undefined) return;

    this._categoriesSrv.retrieve(this.categoryId).subscribe((category) => {
      this.path = [category.path, category.name].filter(Boolean).join(' » ');
      this.category$.next(category);

      const categories: Category.IClientDataList = {
        retrieved: category.retrieved,
        results: category.children,
      };
      this.categories$.next(categories);
      this.loadingCategories = false;

      if (this.iconsSub) this.iconsSub.unsubscribe();
      this.iconsSub = this._iconsSrv
        .list(
          this.query ? this.query : undefined,
          this.allIcons ? undefined : this.categoryId,
          this.page
        )
        .subscribe((icons) => {
          this.icons$.next(icons);
          this.loadingIcons = false;
        });
    });
  }
}
