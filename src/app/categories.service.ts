import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { IPagination } from './interfaces/pagination.interface';
import { Category } from './models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  pagination$ = new BehaviorSubject<IPagination>(null);

  constructor(
    private _http: HttpClient,
    private _authSrv: AuthService,
    private _router: Router
  ) {}

  retrieve(id: number): Observable<Category.IClientData> {
    return this._http
      .get<Category.IResponseBody>(environment.apiBase + '/categories/' + id)
      .pipe(
        debounceTime(250),
        map((body) => ({ data: body.data, retrieved: new Date() }))
      );
  }

  list(parentId: number = undefined): Observable<Category.IClientDataList> {
    let params;
    if (parentId) {
      params = { parent: parentId };
    } else {
      params = {};
    }

    return this._http
      .get<Category.IResponseBodyList>(environment.apiBase + '/categories', {
        params: params,
      })
      .pipe(
        debounceTime(250),
        map((body) => {
          this.pagination$.next(body.pagination);

          return { data: body.data, retrieved: new Date() };
        })
      );
  }

  create(
    category: Category.IRequestBody,
    refresh = true
  ): Observable<Category.IClientData> {
    return this._authSrv.credentials$.pipe(
      switchMap((credentials) => {
        if (!credentials) {
          this._router.navigateByUrl('/login');
          return of(null);
        }

        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${credentials.tokens.access}`
        );

        return this._http
          .post<Category.IResponseBody>(
            environment.apiBase + '/categories',
            category,
            { headers: headers }
          )
          .pipe(
            map((data) => {
              return { ...data, retrieved: new Date() };
            })
          );
      })
    );
  }

  update(
    category: Category.IRequestBody,
    refresh = true
  ): Observable<Category.IClientData> {
    return this._authSrv.credentials$.pipe(
      switchMap((credentials) => {
        if (!credentials) {
          this._router.navigateByUrl('/login');
          return of(null);
        }

        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${credentials.tokens.access}`
        );

        return this._http
          .put<Category.IResponseBody>(
            `${environment.apiBase}/categories/${category.id}`,
            category,
            { headers: headers }
          )
          .pipe(
            map((data) => {
              return { ...data, retrieved: new Date() };
            })
          );
      })
    );
  }

  delete(id: number, refresh = true): Observable<HttpResponse<null> | null> {
    return this._authSrv.credentials$.pipe(
      switchMap((credentials) => {
        if (!credentials) {
          this._router.navigateByUrl('/login');
          return of(null);
        }

        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${credentials.tokens.access}`
        );

        return this._http
          .delete<null>(`${environment.apiBase}/categories/${id}`, {
            headers: headers,
            observe: 'response',
          })
          .pipe(
            map((data) => {
              return { ...data, retrieved: new Date() };
            })
          );
      })
    );
  }
}
