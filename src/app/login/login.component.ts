import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';
import { Auth } from '../interfaces/auth.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  errors$: BehaviorSubject<{ identifier: string[]; password: string[] }>;
  redirect: string;

  constructor(
    private _authSrv: AuthService,
    private _loadingCtrl: LoadingController,
    private _toastCtrl: ToastController,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe((params) => {
      this.redirect = params.redirect;
    });

    this.form = new FormGroup({
      identifier: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      password: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    });
    this.errors$ = new BehaviorSubject({
      identifier: [],
      password: [],
    });
  }

  onSubmit(): void {
    if (!this.form) {
      console.error('Form must be initialized before submitting.');

      return;
    }

    this._loadingCtrl
      .create({
        message: 'Logging in&hellip;',
        cssClass: 'loader',
      })
      .then((loader: HTMLIonLoadingElement) => {
        loader.present();

        this._authSrv
          .login(
            this.form.get('identifier').value,
            this.form.get('password').value
          )
          .subscribe(
            (response: Auth.ISuccessResponse) =>
              this.loginSuccessHandler(response, loader),
            (response: HttpErrorResponse) =>
              this.loginErrorHandler(response, loader)
          );
      });
  }

  loginSuccessHandler(
    response: Auth.ISuccessResponse,
    loader: HTMLIonLoadingElement
  ): void {
    this._toastCtrl
      .create({
        message: response.success,
        position: 'top',
        color: 'success',
        duration: 5000,
        cssClass: 'toast',
        buttons: [
          {
            text: 'Close',
            role: 'cancel',
          },
        ],
      })
      .then((toast) => {
        this.form.reset();
        this.errors$.next({ identifier: [], password: [] });

        this._router.navigateByUrl(
          this.redirect ? this.redirect : '/icons/browse'
        );

        loader.dismiss();
        toast.present();
      });
  }

  loginErrorHandler(
    response: HttpErrorResponse,
    loader: HTMLIonLoadingElement
  ) {
    console.error(response);

    const error = response.error as Auth.IErrorResponse;
    const errors = error.errors;

    if (errors) {
      for (let err of errors) {
        this._toastCtrl
          .create({
            message: err,
            position: 'top',
            color: 'danger',
            duration: 5000,
            cssClass: 'toast',
            buttons: [
              {
                text: 'Close',
                role: 'cancel',
              },
            ],
          })
          .then((toast) => toast.present());
      }
    }

    const identifier: string[] = error.username
      ? error.username
      : error.email
      ? error.email
      : [];
    const password = error.password ? error.password : [];

    this.errors$.next({ identifier: identifier, password: password });

    loader.dismiss();
  }
}
