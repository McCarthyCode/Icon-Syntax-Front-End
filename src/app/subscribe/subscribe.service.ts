import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Subscription } from '../models/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscribeService {
  constructor(private http: HttpClient, private authSrv: AuthService) {}

  subscribe(
    email: string
  ): Observable<Subscription.IModel | HttpErrorResponse> {
    const body = { email: email };

    return this.http
      .post<Subscription.IModel>(environment.apiBase + 'auth/subscribe', body)
      .pipe(debounceTime(250));
  }

  unsubscribe(email: string): Observable<HttpResponse<null>> {
    return this.authSrv.authHeader$.pipe(
      switchMap((headers: HttpHeaders) => {
        if (headers === null) {
          return of(null);
        }

        return this.lookup(email).pipe(
          switchMap((id: number) => {
            return this._unsubscribe(id, headers);
          })
        );
      })
    );
  }

  private _unsubscribe(
    id: number,
    headers: HttpHeaders,
    refresh = true
  ): Observable<HttpResponse<null>> {
    return this.http
      .delete<null>(environment.apiBase + 'auth/unsubscribe/' + id, {
        headers: headers
      })
      .pipe(
        debounceTime(250),
        catchError((response: HttpErrorResponse) => {
          if (refresh && response.status === 401) {
            return this.authSrv
              .refresh()
              .pipe(switchMap(() => this._unsubscribe(id, headers, false)));
          }

          return of(null);
        })
      );
  }

  list(
    detail = false,
    header = false,
    ext: 'json' | 'csv' | 'txt' = 'json'
  ): Observable<Subscription.IModel[]> {
    return this.http
      .get<any>(environment.apiBase + 'auth/subscriptions.' + ext, {
        params: { detail: detail, header: header }
      })
      .pipe(debounceTime(250));
  }

  retrieve(id: number): Observable<Subscription.IModel> {
    return this.http
      .get<Subscription.IModel>(
        environment.apiBase + 'auth/subscriptions/' + id
      )
      .pipe(debounceTime(250));
  }

  lookup(
    email: string,
    detail = false
  ): Observable<number | Subscription.IModel> {
    return this.http
      .get<number | Subscription.IModel>(
        environment.apiBase + 'auth/subscriptions/lookup',
        { params: { email: email, detail: detail } }
      )
      .pipe(debounceTime(250));
  }
}
