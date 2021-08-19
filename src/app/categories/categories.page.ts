import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IconDetailService } from '../icon-detail.service';
import { IconsService } from '../icons.service';
import { Category } from '../models/category.model';
import { Icon } from '../models/icon.model';
import { CategoriesService } from '../categories.service';
import { AuthService } from '../auth.service';

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

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  // Behavior Subjects
  category$ = new BehaviorSubject<Category.IClientData>(null);
  categories$ = new BehaviorSubject<Category.IClientDataList>(emptyCategories);
  icons$ = new BehaviorSubject<Icon.IClientDataList>(emptyIcons);

  // Subscriptions
  iconsSub: Subscription;
  categoriesSub: Subscription;
  iconClickSub: Subscription;

  // Spinners
  loadingCategories = true;
  loadingIcons = true;

  // Navigation history
  breadcrumbs: Category.IClientData[] = [];

  // Back-end parameters
  query = '';
  page = 1;

  // Event emitters
  @Output() iconClick = new EventEmitter<Icon.IIcon>();

  constructor(
    private _iconsSrv: IconsService,
    private _iconsDetailSrv: IconDetailService,
    private _categoriesSrv: CategoriesService,
    public authSrv: AuthService
  ) {}

  ngOnInit(): void {
    this.categoriesSub = this._categoriesSrv.list().subscribe((categories) => {
      this.breadcrumbs = [];
      this.categories$.next(categories);
      this.loadingCategories = false;

      this.iconsSub = this._iconsSrv.list().subscribe((icons) => {
        this.icons$.next(icons);
        this.loadingIcons = false;
      });
    });
  }

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

  searchbar(query: string): void {
    this.resetCategories();
    this.resetIcons();

    this.query = query;

    this.categoriesSub = this.category$.subscribe((category) => {
      this.loadingCategories = false;
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

  clickCategory(id: number): void {
    this.resetCategories();
    this.resetIcons();

    this.breadcrumbs.push(this.category$.value);

    this._categoriesSrv.retrieve(id).subscribe((category) => {
      this.category$.next(category);

      const categories: Category.IClientDataList = {
        retrieved: category.retrieved,
        results: category.children,
      };
      this.categories$.next(categories);
      this.loadingCategories = false;

      this._iconsSrv
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

  clickBack(): void {
    this.resetCategories();
    this.resetIcons();

    const category = this.breadcrumbs.pop();
    this.category$.next(category);

    if (category === null) {
      this._categoriesSrv.list().subscribe((categories) => {
        this.categories$.next(categories);
        this.loadingCategories = false;

        this._iconsSrv
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
    } else {
      this._categoriesSrv.retrieve(category.id).subscribe((category) => {
        this.category$.next(category);
        this.categories$.next({
          results: category.children,
          retrieved: new Date(),
        });
        this.loadingCategories = false;

        this._iconsSrv
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
  }

  clickIcon(icon: Icon.IIcon): void {
    this._iconsDetailSrv.click(icon);
  }

  nextPage($event): void {
    if (!this.icons$.value.pagination.nextPageExists) {
      $event.target.complete();
      return;
    }

    this.resetIcons(false);

    this.categoriesSub = this.categories$.subscribe(() => {
      const page = this.icons$.value.pagination.thisPageNumber;
      const category = this.category$.value;

      this.iconsSub = this._iconsSrv
        .list(
          this.query ? this.query : undefined,
          category ? category.id : undefined,
          this.page
        )
        .subscribe((icons) => {
          const updated = this.icons$.value;

          if (updated) {
            updated.results.push(...icons.results);
            this.icons$.next(updated);
          } else {
            this.icons$.next(icons);
          }

          $event.target.complete();
          this.loadingIcons = false;
        });
    });
  }
}
