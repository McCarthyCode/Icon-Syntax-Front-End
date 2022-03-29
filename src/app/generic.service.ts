import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { IPagination } from './interfaces/pagination.interface';
import { Model } from './models/model';

export abstract class GenericService<
  IModel extends Model.IModel,
  IResponseBody extends Model.IResponseBody<IModel>,
  IResponseBodyList extends Model.IResponseBodyList<IModel>,
  IClientData extends Model.IClientData<IModel>,
  IClientDataList extends Model.IClientDataList<IModel>
> {
  constructor(
    private _path: string,
    private _http: HttpClient,
    private _authSrv: AuthService,
    private _modalCtrl: ModalController
  ) {}

  pagination$ = new BehaviorSubject<IPagination>(null);
  get pagination(): IPagination {
    return this.pagination$.value;
  }
  set pagination(value: IPagination) {
    this.pagination$.next(value);
  }

  convert(result: IResponseBody): IClientData {
    const clientData = {
      data: result.data,
      retrieved: new Date(),
    } as unknown;

    if (result.success) clientData['success'] = result.success;
    if (result.errors) clientData['errors'] = result.errors;

    return clientData as IClientData;
  }

  convertList(results: IResponseBodyList): IClientDataList {
    const clientDataList = {
      data: results.data,
      retrieved: new Date(),
    } as unknown;

    if (results.success) clientDataList['success'] = results.success;
    if (results.errors) clientDataList['errors'] = results.errors;

    return clientDataList as IClientDataList;
  }

  retrieve(id: number): Observable<IClientData> {
    return this._http
      .get<IResponseBody>(environment.apiBase + [this._path, id].join('/'))
      .pipe(debounceTime(250), map(this.convert));
  }

  list(params: any = {}): Observable<IClientDataList> {
    return this._http
      .get<IResponseBodyList>(environment.apiBase + this._path, {
        params: params,
      })
      .pipe(
        debounceTime(250),
        tap((responseBodyList) =>
          this.pagination$.next(responseBodyList.pagination)
        ),
        map(this.convertList)
      );
  }

  create(
    formData: FormData,
    auth = true
  ): Observable<IClientData | HttpErrorResponse> {
    if (auth) {
      return this._authSrv.authHeader$.pipe(
        switchMap((headers: HttpHeaders) => {
          if (headers === null) {
            this._modalCtrl.dismiss();
            return of(null);
          }

          return this._create(formData, headers);
        })
      );
    }

    return this._create(formData);
  }

  private _create(
    formData: FormData,
    headers: HttpHeaders = undefined,
    refresh = true
  ): Observable<IClientData | HttpErrorResponse> {
    return this._http
      .post<IResponseBody>(environment.apiBase + this._path, formData, {
        headers: headers,
      })
      .pipe(
        debounceTime(250),
        catchError((response: HttpErrorResponse) => {
          if (refresh && response.status === 401) {
            return this._authSrv
              .refresh()
              .pipe(switchMap(() => this._create(formData, headers, false)));
          }

          return of(null);
        }),
        map(this.convert)
      );
  }

  update(
    formData: FormData,
    auth = true
  ): Observable<IClientData | HttpErrorResponse> {
    if (auth) {
      return this._authSrv.authHeader$.pipe(
        switchMap((headers: HttpHeaders) => {
          if (headers === null) {
            return of(null);
          }

          return this._update(formData, headers);
        })
      );
    }

    return this._update(formData);
  }

  private _update(
    formData: FormData,
    headers: HttpHeaders = undefined,
    refresh = true
  ): Observable<IClientData | HttpErrorResponse> {
    return this._http
      .put<IResponseBody>(
        environment.apiBase + [this._path, formData['id']].join('/'),
        formData,
        { headers: headers }
      )
      .pipe(
        debounceTime(250),
        catchError((response: HttpErrorResponse) => {
          if (refresh && response.status === 401) {
            return this._authSrv
              .refresh()
              .pipe(switchMap(() => this._update(formData, headers, false)));
          }

          return of(null);
        }),
        map(this.convert)
      );
  }

  partialUpdate(
    id: number,
    formData: FormData,
    auth = true
  ): Observable<IClientData | HttpErrorResponse> {
    if (auth) {
      return this._authSrv.authHeader$.pipe(
        switchMap((headers: HttpHeaders) => {
          if (headers === null) {
            return of(null);
          }

          return this._partialUpdate(id, formData, headers);
        })
      );
    }

    return this._partialUpdate(id, formData);
  }

  private _partialUpdate(
    id: number,
    formData: FormData,
    headers: HttpHeaders = undefined,
    refresh = true
  ): Observable<IClientData | HttpErrorResponse> {
    return this._http
      .patch<IResponseBody>(
        environment.apiBase + [this._path, id].join('/'),
        formData,
        { headers: headers }
      )
      .pipe(
        debounceTime(250),
        catchError((response: HttpErrorResponse) => {
          if (refresh && response.status === 401) {
            return this._authSrv
              .refresh()
              .pipe(
                switchMap(() =>
                  this._partialUpdate(id, formData, headers, false)
                )
              );
          }

          return of(null);
        }),
        map(this.convert)
      );
  }

  delete(id: number, auth = true): Observable<HttpResponse<null>> {
    if (auth) {
      return this._authSrv.authHeader$.pipe(
        switchMap((headers: HttpHeaders) => {
          if (headers === null) {
            return of(null);
          }

          return this._delete(id, headers);
        })
      );
    }

    return this._delete(id);
  }

  private _delete(
    id: number,
    headers: HttpHeaders = undefined,
    refresh = true
  ): Observable<HttpResponse<null>> {
    return this._http
      .delete<null>(environment.apiBase + [this._path, id].join('/'), {
        headers: headers,
      })
      .pipe(
        debounceTime(250),
        catchError((response: HttpErrorResponse) => {
          if (refresh && response.status === 401) {
            return this._authSrv
              .refresh()
              .pipe(switchMap(() => this._delete(id, headers, false)));
          }

          return of(null);
        })
      );
  }
}
