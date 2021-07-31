import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.model';
import { Icon } from '../models/icon.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  category$ = new BehaviorSubject<Category.IClientData>(null);
  children$ = new BehaviorSubject<Category.IClientDataList>(null);
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

  loading = true;
  breadcrumbs: Category.IClientData[] = [];
  search = '';

  constructor(private _http: HttpClient) {}

  ngOnInit() {
    this.listCategories().subscribe(() => {
      this.listIcons().subscribe(() => {
        this.loading = false;
      });
    });
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
          this.children$.next(clientDataList);

          this.breadcrumbs = [];

          return clientDataList;
        })
      );
  }

  listIcons(): Observable<Icon.IClientDataList> {
    this.loading = true;

    let params = {};
    const category = this.category$.value;
    if (category !== null) {
      params = { ...params, category: category.id };
    }
    if (this.search) {
      params = { ...params, search: this.search };
    }

    return this._http
      .get<Icon.IResponseBodyList>(environment.apiBase + '/icons', {
        params: params,
      })
      .pipe(
        map((body) => {
          const clientDataList: Icon.IClientDataList = {
            ...body,
            retrieved: new Date(),
          };

          this.icons$.next(clientDataList);

          return clientDataList;
        })
      );
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
          this.children$.next(children);

          return category;
        })
      );
  }

  clickChild(id: number): void {
    this.breadcrumbs.push(this.category$.value);

    this.retrieveCategory(id).subscribe(() => {
      this.children$.subscribe(() =>
        this.listIcons().subscribe(() => (this.loading = false))
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
