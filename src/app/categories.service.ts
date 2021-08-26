import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Category } from './models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
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
        map((body) => {
          const category: Category.IClientData = {
            ...body,
            retrieved: new Date(),
          };

          return category;
        })
      );
  }

  list(): Observable<Category.IClientDataList> {
    return this._http
      .get<Category.IResponseBodyList>(environment.apiBase + '/categories')
      .pipe(
        debounceTime(250),
        map((body) => {
          const clientDataList: Category.IClientDataList = {
            ...body,
            retrieved: new Date(),
          };

          return clientDataList;
        })
      );
  }

  create(category: Category.IRequestBody): Observable<Category.IClientData> {
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

  update(category: Category.IRequestBody): Observable<Category.IClientData> {
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

  delete(id: number): Observable<HttpResponse<null> | null> {
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

        return this._http.delete<null>(
          `${environment.apiBase}/categories/${id}`,
          { headers: headers, observe: 'response' }
        );
      })
    );
  }
}
