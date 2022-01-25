import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { IPagination } from './interfaces/pagination.interface';
import { Model } from './models/model';

export abstract class GenericService<
  IModel extends Model.IModel,
  IRequestBody extends Model.IRequestBody,
  IResponseBody extends Model.IResponseBody<IModel>,
  IResponseBodyList extends Model.IResponseBodyList<IModel>,
  IClientData extends Model.IClientData<IModel>,
  IClientDataList extends Model.IClientDataList<IModel>
> {
  constructor(
    private _path: string,
    private _http: HttpClient,
    private _authSrv: AuthService,
    private _router: Router
  ) {}

  private pagination$ = new BehaviorSubject<IPagination>(null);
  get pagination(): IPagination {
    return this.pagination$.value;
  }
  set pagination(value: IPagination) {
    this.pagination$.next(value);
  }

  convert(result: IResponseBody): IClientData {
    return {
      data: result.data,
      retrieved: new Date(),
    } as unknown as IClientData;
  }

  convertList(results: IResponseBodyList): IClientDataList {
    return {
      data: results.data,
      retrieved: new Date(),
    } as unknown as IClientDataList;
  }

  retrieve(id: number): Observable<IClientData> {
    return this._http
      .get<IResponseBody>([environment.apiBase, this._path, id].join('/'))
      .pipe(debounceTime(250), map(this.convert));
  }

  list(params: HttpParams | {} = {}): Observable<IClientDataList> {
    return this._http
      .get<IResponseBodyList>([environment.apiBase, this._path].join('/'), {
        params: params,
      })
      .pipe(debounceTime(250), map(this.convertList));
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
      .post<IResponseBody>([environment.apiBase, this._path].join('/'), body, {
        headers: headers,
      })
      .pipe(debounceTime(250), map(this.convert));
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
        [environment.apiBase, this._path, body['id']].join('/'),
        body,
        { headers: headers }
      )
      .pipe(debounceTime(250), map(this.convert));
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
        [environment.apiBase, this._path, body['id']].join('/'),
        body,
        { headers: headers }
      )
      .pipe(debounceTime(250), map(this.convert));
  }

  delete(id: number, auth = false): Observable<HttpResponse<null>> {
    return this._authWrapperId(id, this._delete, auth);
  }

  _delete(id: number, headers: HttpHeaders) {
    return this._http
      .delete<null>([environment.apiBase, this._path, id].join('/'), {
        headers: headers,
      })
      .pipe(debounceTime(250));
  }
}
