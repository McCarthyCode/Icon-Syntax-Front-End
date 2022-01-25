import {
  HttpClient
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { GenericService } from './generic.service';
import { Category } from './models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService extends GenericService<
  Category.ICategory,
  Category.IRequestBody,
  Category.IResponseBody,
  Category.IResponseBodyList,
  Category.IClientData,
  Category.IClientDataList
> {
  constructor(http: HttpClient, authSrv: AuthService, router: Router) {
    super('categories', http, authSrv, router);
  }
  /*
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
          const clientDataList: Category.IClientDataList = {
            ...body,
            retrieved: new Date(),
          };

          return clientDataList;
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
            }),
            catchError((response: HttpErrorResponse) => {
              if (refresh && response.status === 401) {
                return this._authSrv
                  .refresh()
                  .pipe(switchMap(() => this.create(category, false)));
              } else {
                return of(response);
              }
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
            }),
            catchError((response: HttpErrorResponse) => {
              if (refresh && response.status === 401) {
                return this._authSrv
                  .refresh()
                  .pipe(switchMap(() => this.update(category, false)));
              } else {
                return of(response);
              }
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
            }),
            catchError((response: HttpErrorResponse) => {
              if (refresh && response.status === 401) {
                return this._authSrv
                  .refresh()
                  .pipe(switchMap(() => this.delete(id, false)));
              } else {
                return of(response);
              }
            })
          );
      })
    );
  }
  */
}
