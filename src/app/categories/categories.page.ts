import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IconsService } from '../icons.service';
import { Category } from '../models/category.model';
import { Icon } from '../models/icon.model';

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

  // Spinners
  loadingCategories = true;
  loadingIcons = true;

  // Navigation history
  breadcrumbs: Category.IClientData[] = [];

  // Back-end parameters
  query = '';
  page = 1;

  constructor(private _http: HttpClient, private _iconsSrv: IconsService) {}

  ngOnInit() {
    this.categoriesSub = this.listCategories().subscribe(() => {
      this.loadingCategories = false;
      this.iconsSub = this.listIcons().subscribe((icons) => {
        this.icons$.next(icons);
        this.loadingIcons = false;
      });
    });
  }

  resetCategories() {
    this.loadingCategories = true;
  }

  resetIcons(empty = true) {
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

    this.categoriesSub = this.category$.subscribe(() => {
      this.loadingCategories = false;
      this.iconsSub = this.listIcons().subscribe((icons) => {
        this.icons$.next(icons);
        this.loadingIcons = false;
      });
    });
  }

  retrieveCategory(id: number): Observable<Category.IClientData> {
    return this._http
      .get<Category.IResponseBody>(environment.apiBase + '/categories/' + id)
      .pipe(
        debounceTime(250),
        map((body) => {
          const retrieved = new Date();
          const category: Category.IClientData = {
            ...body,
            retrieved: retrieved,
          };
          const children: Category.IClientDataList = {
            results: category.children,
            retrieved: retrieved,
          };

          this.category$.next(category);
          this.categories$.next(children);

          return category;
        })
      );
  }

  listCategories(): Observable<Category.IClientDataList> {
    return this._http
      .get<Category.IResponseBodyList>(environment.apiBase + '/categories')
      .pipe(
        debounceTime(250),
        map((body) => {
          const clientDataList: Category.IClientDataList = {
            ...body,
            retrieved: new Date(),
          };

          this.category$.next(null);
          this.categories$.next(clientDataList);

          this.breadcrumbs = [];

          return clientDataList;
        })
      );
  }

  listIcons(): Observable<Icon.IClientDataList> {
    const category = this.category$.value;

    return this._iconsSrv.list(
      this.query ? this.query : undefined,
      category ? category.id : undefined,
      this.page
    );
  }

  clickCategory(id: number): void {
    this.resetCategories();
    this.resetIcons();

    this.breadcrumbs.push(this.category$.value);

    this.retrieveCategory(id).subscribe(() => {
      this.categories$.subscribe(() => {
        this.loadingCategories = false;
        this.listIcons().subscribe((icons) => {
          this.icons$.next(icons);
          this.loadingIcons = false;
        });
      });
    });
  }

  clickBack(): void {
    this.resetCategories();
    this.resetIcons();

    const category = this.breadcrumbs.pop();
    if (category === null) {
      this.listCategories().subscribe(() => {
        this.loadingCategories = false;
        this.listIcons().subscribe(() => (this.loadingIcons = false));
      });
    } else {
      this.retrieveCategory(category.id).subscribe(
        () => (this.loadingCategories = false)
      );
    }
  }

  nextPage($event): void {
    this.resetIcons(false);

    this.categoriesSub = this.categories$.subscribe(() => {
      const page = this.icons$.value.pagination.thisPageNumber;
      this.iconsSub = this.listIcons().subscribe((icons) => {
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
