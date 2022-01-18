import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { GenericService } from './generic.service';
import { Icon } from './models/icon.model';

@Injectable({
  providedIn: 'root',
})
export class IconsService extends GenericService<
  Icon.IIcon,
  Icon.IRequestBody,
  Icon.IResponseBody,
  Icon.IResponseBodyList,
  Icon.IClientData,
  Icon.IClientDataList
> {
  constructor(http: HttpClient, authSrv: AuthService, router: Router) {
    super('icons', http, authSrv, router);
  }

  /*
  list(
    query?: string,
    categoryId?: number,
    page: number = 1
  ): Observable<Icon.IClientDataList> {
    let params = {};
    if (categoryId !== undefined) {
      params = { category: categoryId };
    }
    if (query) {
      params = { ...params, search: query };
    }
    if (page) {
      params = { ...params, page: page };
    }

    return this._http
      .get<Icon.IResponseBodyList>(environment.apiBase + '/icons', {
        params: params,
      })
      .pipe(
        debounceTime(250),
        map((body) => {
          const clientData = {
            ...body,
            retrieved: new Date(),
          };

          return clientData;
        })
      );
  }

  retrieve(pk: number): Observable<Icon.IClientData> {
    return this._http
      .get<Icon.IResponseBody>(`${environment.apiBase}/icons/${pk}`)
      .pipe(
        debounceTime(250),
        map((body) => {
          const clientData = {
            ...body,
            retrieved: new Date(),
          };

          return clientData;
        })
      );
  }

  create(
    body: Icon.IRequestBody,
    refresh = true
  ): Observable<Icon.IClientData> {
    return this._authSrv.credentials$.pipe(
      switchMap((credentials) => {
        if (!credentials) {
          this._router.navigateByUrl('/login');
          return of(null);
        }

        const headers = new HttpHeaders({
          Authorization: `Bearer ${credentials.tokens.access}`,
        });

        const formData = new FormData();
        for (let attr of ['icon', 'word', 'descriptor', 'category']) {
          formData.append(attr, body[attr]);
        }

        return this._http
          .post<Icon.IResponseBody>(
            environment.apiBase + '/icons/upload',
            formData,
            {
              headers: headers,
              observe: 'response',
            }
          )
          .pipe(
            map((body) => {
              const clientData = {
                ...body,
                retrieved: new Date(),
              };

              return clientData;
            }),
            catchError((response: HttpErrorResponse) => {
              if (refresh && response.status === 401) {
                return this._authSrv
                  .refresh()
                  .pipe(switchMap(() => this.create(body, false)));
              } else {
                return of(response);
              }
            })
          );
      })
    );
  }

  update(
    body: Icon.IRequestBody,
    refresh = true
  ): Observable<Icon.IClientData> {
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
          .put<Icon.IResponseBody>(
            `${environment.apiBase}/icons/update/${body.id}`,
            body,
            {
              headers: headers,
              observe: 'response',
            }
          )
          .pipe(
            map((body) => {
              const clientData = {
                ...body,
                retrieved: new Date(),
              };

              return clientData;
            }),
            catchError((response: HttpErrorResponse) => {
              if (refresh && response.status === 401) {
                return this._authSrv
                  .refresh()
                  .pipe(switchMap(() => this.update(body, false)));
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
          .delete<null>(`${environment.apiBase}/icons/delete/${id}`, {
            headers: headers,
            observe: 'response',
          })
          .pipe(
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
