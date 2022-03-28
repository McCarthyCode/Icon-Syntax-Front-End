import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Auth } from './interfaces/auth.interface';

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  credentials$ = new BehaviorSubject<Auth.ICredentials>(null);

  get authHeader$(): Observable<HttpHeaders> {
    return this.credentials$.pipe(
      map((credentials) => {
        if (!credentials) {
          this._router.navigateByUrl('/login');

          return null;
        }

        return new HttpHeaders({
          Authorization: `Bearer ${credentials.tokens.access}`,
        });
      })
    );
  }

  get isAuthenticated(): boolean {
    return Boolean(this.credentials$.value);
  }

  get isAdmin(): boolean {
    return this.credentials$.value?.isAdmin;
  }

  constructor(private _http: HttpClient, private _router: Router) {
    if (!environment.production) {
      this.login(
        environment.login.username,
        environment.login.password
      ).subscribe();
    }
  }

  register(body: {
    username: string;
    email: string;
    password: string;
  }): Observable<Auth.IResponse> {
    return this._http
      .post<Auth.ISuccessResponse>(environment.apiBase + 'auth/register', body)
      .pipe(debounceTime(250));
  }

  registerVerify(access: string): Observable<Auth.IResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${access}`,
    });

    return this._http.post<Auth.ISuccessResponse>(
      environment.apiBase + 'auth/register/verify',
      {},
      { headers: headers }
    );
  }

  login(username: string, password: string): Observable<Auth.IResponse> {
    return this._http
      .post<Auth.ISuccessResponse>(
        environment.apiBase + 'auth/login',
        emailRegex.test(username)
          ? { email: username, password: password }
          : { username: username, password: password }
      )
      .pipe(
        tap((response: Auth.ISuccessResponse) => {
          this.credentials$.next(response.credentials);
        })
      );
  }

  refresh(): Observable<Auth.IResponse> {
    return this._http
      .post<Auth.IResponse>(environment.apiBase + 'auth/refresh', {
        refresh: this.credentials$.value.tokens.refresh,
      })
      .pipe(
        tap((response: Auth.ISuccessResponse) => {
          this.credentials$.next(response.credentials);
        })
      );
  }

  logout(refresh = true): Observable<Auth.IResponse | HttpErrorResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.credentials$.value.tokens.access}`,
    });

    return this._http
      .post<Auth.ISuccessResponse>(
        environment.apiBase + 'auth/logout',
        {},
        { headers: headers }
      )
      .pipe(
        catchError((response: HttpErrorResponse) => {
          if (refresh && response.status === 401) {
            return this.refresh().pipe(switchMap(() => this.logout(false)));
          } else {
            return of(response);
          }
        })
      );
  }

  forgot(body: { email: string }): Observable<Auth.IResponse> {
    return this._http.post<Auth.ISuccessResponse>(
      environment.apiBase + 'auth/password/forgot',
      body
    );
  }

  verify(
    body: { password: string },
    access: string
  ): Observable<Auth.IResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${access}`,
    });

    return this._http.post(
      environment.apiBase + 'auth/password/forgot/verify',
      body,
      { headers: headers }
    );
  }
}
