import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Auth } from './interfaces/auth.interface';

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  credentials$ = new BehaviorSubject<Auth.ICredentials>(null);
  isAuthenticated = false;
  // get isAuthenticated(): boolean {
  //   return Boolean(this.credentials$.value);
  // }

  constructor(private _http: HttpClient, private _router: Router) {}

  /*
  register(
    username: string,
    email: string,
    password: string
  ): Observable<Auth.IResponse> {
    return this._http
      .post<Auth.ISuccessResponse>(environment.apiBase + '/auth/login', {
        username: username,
        email: email,
        password: password,
      })
      .pipe(
        catchError((response: Auth.IErrorResponse) => {
          for (let error in response.errors ? response.errors : []) {
            console.error(error);
          }
          if (response.username) {
            console.error('username', response.username);
          }
          if (response.email) {
            console.error('email', response.email);
          }
          if (response.password) {
            console.error('password', response.password);
          }

          return of(response);
        })
      );
  }
  */

  mockLogin(): Observable<Auth.IResponse> {
    this.isAuthenticated = true;

    return of({
      success: 'You have successfully logged in.',
    });
  }

  login(username: string, password: string): Observable<Auth.IResponse> {
    return this.mockLogin();
    return this._http
      .post<Auth.ISuccessResponse>(
        environment.apiBase + '/auth/login',
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
}
