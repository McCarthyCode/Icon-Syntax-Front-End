import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  category$ = new BehaviorSubject<Category.IClientData>(null);
  children$ = new BehaviorSubject<Category.IClientDataList>(null);

  loading = true;
  breadcrumbs: Category.IClientData[] = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _http: HttpClient
  ) {}

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((paramMap) => {
      const id: string = paramMap.get('id');

      if (id === null) {
        this.list().subscribe(() => {
          this.loading = false;
        });
      } else {
        this.retrieve(parseInt(id)).subscribe(() => {
          this.loading = false;
        });
      }
    });
  }

  list(): Observable<Category.IClientDataList> {
    this.loading = true;
    return this._http
      .get<Category.IResponseBodyList>(environment.apiBase + '/categories')
      .pipe(
        map((body) => {
          const clientData = {
            ...body,
            retrieved: new Date(),
          };

          this.category$.next(null);
          this.children$.next(clientData);

          this.breadcrumbs = [];

          return clientData;
        })
      );
  }

  retrieve(id: number): Observable<Category.IClientData> {
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
    this.retrieve(id).subscribe((category) => {
      const children: Category.IClientDataList = {
        results: category['children'] ? category['children'] : [],
        retrieved: new Date(),
      };
      this.children$.subscribe(() => (this.loading = false));
    });
  }

  clickBack(): void {
    const category = this.breadcrumbs.pop();

    if (category === null) {
      this.list().subscribe(() => (this.loading = false));
    } else {
      this.retrieve(category.id).subscribe(() => (this.loading = false));
    }
  }
}
