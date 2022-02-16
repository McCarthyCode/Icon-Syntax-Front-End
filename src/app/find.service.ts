import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { CategoriesService } from './categories.service';
import { IconsService } from './icons.service';
import { IPagination } from './interfaces/pagination.interface';
import { Category } from './models/category.model';
import { Icon } from './models/icon.model';

@Injectable({
  providedIn: 'root',
})
export class FindService {
  // Behavior Subjects
  category$ = new BehaviorSubject<Category.IClientData>(null);

  categories$ = new BehaviorSubject<Category.IClientDataList>(null);
  get categoriesPagination$(): BehaviorSubject<IPagination> {
    return this._categoriesSrv.pagination$;
  }

  icons$ = new BehaviorSubject<Icon.IClientDataList>(null);
  get iconsPagination$(): BehaviorSubject<IPagination> {
    return this._iconsSrv.pagination$;
  }

  // Replay Subjects
  reset$ = new ReplaySubject<void>();

  // Subscriptions
  iconsSub: Subscription;
  categoriesSub: Subscription;
  iconClickSub: Subscription;

  // Booleans
  loadingCategories = true;
  loadingIcons = true;
  libraryVisible = false;

  // Attributes
  query = '';
  categoryId: number;
  page = 1;

  allIcons = true;
  breadcrumbs = 'All Icons';

  // Route Booleans
  get browseVisible(): boolean {
    return this._router.url === '/icons/browse';
  }

  get searchResultsVisible(): boolean {
    return this._router.url === '/icons/search-results';
  }

  // Message Flags
  get emptyQuery(): boolean {
    return this.query.length === 0
      ? this.allIcons || this.categoryId === undefined
      : false;
  }

  get notFound(): boolean {
    return (
      (this.allIcons || this.categoryId === undefined) && this.query.length > 0
    );
  }

  get broadenSearch(): boolean {
    return this.categoryId !== undefined && this.query.length > 0;
  }

  constructor(
    private _iconsSrv: IconsService,
    private _categoriesSrv: CategoriesService,
    private _router: Router
  ) {}

  resetCategories(): void {
    this.loadingCategories = true;
  }

  resetIcons(empty = true): void {
    this.loadingIcons = true;

    if (empty) {
      this.page = 1;
      this.icons$.next(null);
    } else {
      this.page++;
    }
  }

  onAllIconsChange(checked: boolean): void {
    this.resetCategories();
    this.resetIcons();

    this.allIcons = checked;
    if (!(checked || this.categoryId)) {
      setTimeout(() => {
        this.allIcons = true;
      }, 100);
    }

    if (this.emptyQuery) return;

    if (this.categoriesSub) this.categoriesSub.unsubscribe();
    this.categoriesSub = this.category$.subscribe((category) => {
      // this.loadingCategories = false;

      const listParams = {
        page: this.page,
      };
      if (this.query) listParams['search'] = this.query;
      if (!this.allIcons) listParams['category'] = this.categoryId;

      if (this.iconsSub) this.iconsSub.unsubscribe();
      this.iconsSub = this._iconsSrv
        .list(listParams)
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

    if (this.emptyQuery) return;

    if (this.categoriesSub) this.categoriesSub.unsubscribe();
    this.categoriesSub = this.category$.subscribe((category) => {
      // this.loadingCategories = false;

      const listParams = {
        page: this.page,
      };
      if (this.query) listParams['search'] = this.query;
      if (!this.allIcons) listParams['category'] = this.categoryId;

      if (this.iconsSub) this.iconsSub.unsubscribe();
      this.iconsSub = this._iconsSrv.list(listParams).subscribe((icons) => {
        this.icons$.next(icons);
        this.loadingIcons = false;
      });
    });
  }

  onClickCategory(allIcons: boolean = false): void {
    this.resetCategories();
    this.resetIcons();

    this.allIcons = allIcons;
    if (!this.query) this.breadcrumbs = '';
    if (this.emptyQuery) return;

    this._categoriesSrv.retrieve(this.categoryId).subscribe((category) => {
      this.breadcrumbs = [category.data.path, category.data.name]
        .filter(Boolean)
        .join(' » ');
      this.category$.next(category);

      const categories: Category.IClientDataList = {
        retrieved: category.retrieved,
        data: category.data.children,
      };
      this.categories$.next(categories);
      this.loadingCategories = false;

      const listParams = {
        page: this.page,
      };
      if (this.query) listParams['search'] = this.query;
      if (!this.allIcons) listParams['category'] = this.categoryId;

      if (this.iconsSub) this.iconsSub.unsubscribe();
      this.iconsSub = this._iconsSrv.list(listParams).subscribe((icons) => {
        this.icons$.next(icons);
        this.loadingIcons = false;
      });
    });
  }

  onReset(): void {
    this.reset$.next();
    this.categoryId = undefined;
    this.breadcrumbs = '';
    this.allIcons = true;
  }
}
