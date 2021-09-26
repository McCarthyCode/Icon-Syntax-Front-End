import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CategoriesService } from './categories.service';
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

  // Back-end parameters
  query = '';
  page = 1;

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

  onSearchbar(query: string): void {
    this.resetCategories();
    this.resetIcons();

    this.query = query;

    this.categoriesSub = this.category$.subscribe((category) => {
      this.loadingCategories = false;
      this.iconsSub.unsubscribe();
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

  onClickCategory(id: number): void {
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

      this.iconsSub.unsubscribe();
      this.iconsSub = this._iconsSrv
        .list(
          this.query ? this.query : undefined,
          category ? category.id : undefined,
          this.page
        )
        .subscribe((icons) => {
          console.log('got here');
          this.icons$.next(icons);
          this.loadingIcons = false;
        });
    });
  }

  onClickBack(): void {
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

        this.iconsSub.unsubscribe();
        this.iconsSub = this._iconsSrv
          .list(
            this.query ? this.query : undefined,
            category ? category.id : undefined,
            this.page
          )
          .subscribe((icons) => {
            this.icons$.next(icons);
            this.loadingIcons = false;
            this.libraryVisible = true;
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

        this.iconsSub.unsubscribe();
        this.iconsSub = this._iconsSrv
          .list(
            this.query ? this.query : undefined,
            category ? category.id : undefined,
            this.page
          )
          .subscribe((icons) => {
            this.icons$.next(icons);
            this.loadingIcons = false;
            this.libraryVisible = true;
          });
      });
    }
  }
}
