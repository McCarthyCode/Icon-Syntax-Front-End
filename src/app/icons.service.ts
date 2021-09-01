import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Icon } from './models/icon.model';

@Injectable({
  providedIn: 'root',
})
export class IconsService {
  constructor(
    private _http: HttpClient,
    private _authSrv: AuthService,
    private _router: Router
  ) {}

  list(
    query?: string,
    categoryId?: number,
    page: number = 1
  ): Observable<Icon.IClientDataList> {
    let params = {};
    if (categoryId) {
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

  create(body: Icon.IRequestBody): Observable<Icon.IClientData> {
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
            })
          );
      })
    );
  }

  update(body: Icon.IRequestBody): Observable<Icon.IClientData> {
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

        return this._http.delete<null>(`${environment.apiBase}/icons/${id}`, {
          headers: headers,
          observe: 'response',
        });
      })
    );
  }
}
