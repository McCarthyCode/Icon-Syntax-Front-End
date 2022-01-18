import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Model } from './models/model';

const path = require('path');

export abstract class GenericService<
  IModel extends Model.IModel,
  IRequestBody extends Model.IRequestBody,
  IResponseBody extends Model.IResponseBody,
  IResponseBodyList extends Model.IResponseBodyList,
  IClientData extends Model.IClientData,
  IClientDataList extends Model.IClientDataList
> {
  constructor(
    private _path: string,
    private _http: HttpClient,
    private _authSrv: AuthService,
    private _router: Router
  ) {}

  private _convert(result: IResponseBody): IClientData {
    return {
      data: result.data,
      retrieved: new Date(),
    } as unknown as IClientData;
  }

  private _convertList(results: IResponseBodyList): IClientDataList {
    let data: IModel[] = [];

    for (const datum in results.data) {
      let obj: IModel;

      for (const [key, value] of Object.entries(datum)) {
        obj = { ...obj, key: value };
      }

      data = [...data, obj];
    }

    return {
      data: data,
      pagination: results.pagination,
      retrieved: new Date(),
    } as unknown as IClientDataList;
  }

  retrieve(id: number): Observable<IClientData> {
    return this._http
      .get<IResponseBody>(path.join(environment.apiBase, this._path, id))
      .pipe(debounceTime(250), map(this._convert));
  }

  list(params: IRequestBody): Observable<IClientDataList> {
    return this._http
      .get<IResponseBodyList>(path.join(environment.apiBase, this._path), {
        params: params,
      })
      .pipe(debounceTime(250), map(this._convertList));
  }

  private _authWrapperId(
    id: number,
    privateMethod: (
      id: number,
      headers?: HttpHeaders
    ) => Observable<IClientData | HttpErrorResponse>,
    auth = false
  ) {
    if (auth) {
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

          return privateMethod(id, headers);
        })
      );
    }

    return privateMethod(id);
  }

  private _authWrapperBody(
    body: IRequestBody,
    privateMethod: (
      body: IRequestBody,
      headers?: HttpHeaders
    ) => Observable<IClientData | IClientDataList | HttpErrorResponse>,
    auth = false
  ) {
    if (auth) {
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

          return privateMethod(body, headers);
        })
      );
    }

    return privateMethod(body);
  }

  create(body: IRequestBody, auth = false) {
    return this._authWrapperBody(body, this._create, auth);
  }

  private _create(
    body: IRequestBody,
    headers: HttpHeaders = undefined
  ): Observable<IClientData | HttpErrorResponse> {
    return this._http
      .post<IResponseBody>(path.join(environment.apiBase, this._path), body, {
        headers: headers,
      })
      .pipe(debounceTime(250), map(this._convert));
  }

  update(body: IRequestBody, auth = false) {
    return this._authWrapperBody(body, this._update, auth);
  }

  private _update(
    body: IRequestBody,
    headers: HttpHeaders = undefined
  ): Observable<IClientData | HttpErrorResponse> {
    return this._http
      .put<IResponseBody>(
        path.join(environment.apiBase, this._path, body['id']),
        body,
        { headers: headers }
      )
      .pipe(debounceTime(250), map(this._convert));
  }

  partialUpdate(body: IRequestBody, auth = false) {
    return this._authWrapperBody(body, this._partialUpdate, auth);
  }

  private _partialUpdate(
    body: IRequestBody,
    headers: HttpHeaders = undefined
  ): Observable<IClientData | HttpErrorResponse> {
    return this._http
      .patch<IResponseBody>(
        path.join(environment.apiBase, this._path, body['id']),
        body,
        { headers: headers }
      )
      .pipe(debounceTime(250), map(this._convert));
  }

  delete(id: number, auth = false): Observable<HttpResponse<null>> {
    return this._authWrapperId(id, this._delete, auth);
  }

  _delete(id: number, headers: HttpHeaders) {
    return this._http
      .delete<null>(path.join(environment.apiBase, this._path, id), {
        headers: headers,
      })
      .pipe(debounceTime(250));
  }
}
