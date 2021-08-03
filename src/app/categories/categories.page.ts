import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IconsService } from '../icons.service';
import { Category } from '../models/category.model';
import { Icon } from '../models/icon.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  // Behavior Subjects
  category$ = new BehaviorSubject<Category.IClientData>(null);
  categories$ = new BehaviorSubject<Category.IClientDataList>(null);
  icons$ = new BehaviorSubject<Icon.IClientDataList>({
    results: [],
    pagination: {
      totalResults: 0,
      maxResultsPerPage: 100,
      numResultsThisPage: 0,
      thisPageNumber: 1,
      totalPages: 0,
      prevPageExists: false,
      nextPageExists: false,
    },
    retrieved: new Date(),
  });

  // Subscriptions
  iconsSub: Subscription;
  categoriesSub: Subscription;

  // Misc.
  loading = true;
  breadcrumbs: Category.IClientData[] = [];
  query = '';

  constructor(private _http: HttpClient, private _iconsSrv: IconsService) {}

  ngOnInit() {
    this.categoriesSub = this.listCategories().subscribe(() => {
      this.iconsSub = this.listIcons().subscribe((icons) => {
        this.icons$.next(icons);
        this.loading = false;
      });
    });
  }

  searchbar(query: string): void {
    this.loading = true;
    this.query = query;
    this.categoriesSub = this.category$.subscribe(() => {
      this.iconsSub = this.listIcons().subscribe((icons) => {
        this.icons$.next(icons);
        this.loading = false;
      });
    });
  }

  retrieveCategory(id: number): Observable<Category.IClientData> {
    this.loading = true;

    return this._http
      .get<Category.IResponseBody>(environment.apiBase + '/categories/' + id)
      .pipe(
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
    this.loading = true;
    return this._http
      .get<Category.IResponseBodyList>(environment.apiBase + '/categories')
      .pipe(
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
    this.loading = true;
    const category = this.category$.value;

    return this._iconsSrv.list(
      this.query ? this.query : undefined,
      category ? category.id : undefined
    );
  }

  clickCategory(id: number): void {
    this.breadcrumbs.push(this.category$.value);

    this.retrieveCategory(id).subscribe(() => {
      this.categories$.subscribe(() =>
        this.listIcons().subscribe((icons) => {
          this.icons$.next(icons);
          this.loading = false;
        })
      );
    });
  }

  clickBack(): void {
    const category = this.breadcrumbs.pop();

    if (category === null) {
      this.listCategories().subscribe(() =>
        this.listIcons().subscribe(() => (this.loading = false))
      );
    } else {
      this.retrieveCategory(category.id).subscribe(
        () => (this.loading = false)
      );
    }
  }
}
