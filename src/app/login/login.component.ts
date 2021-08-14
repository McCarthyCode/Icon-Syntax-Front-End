import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { BehaviorSubject, of } from 'rxjs';
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

  constructor(
    private _authSrv: AuthService,
    private _loadingCtrl: LoadingController,
    private _toastCtrl: ToastController,
    private _router: Router
  ) {}

  ngOnInit() {
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

  onSubmit() {
    if (!this.form) {
      console.error('Form must be initialized before submitting.');
      return;
    }

    this._loadingCtrl
      .create({
        message: 'Logging in&hellip;',
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
  ) {
    const redirect = response.redirect ? response.redirect : '/find';
    this._router.navigateByUrl(redirect);

    this.form.reset();
    this.errors$.next({ identifier: [], password: [] });

    loader.dismiss();
  }

  async loginErrorHandler(
    response: HttpErrorResponse,
    loader: HTMLIonLoadingElement
  ) {
    console.error(response);

    const error: Auth.IErrorResponse = response.error;
    const errors = error.errors;

    if (errors) {
      for (let err of errors) {
        const toast = await this._toastCtrl.create({
          message: err,
          position: 'top',
          buttons: [
            {
              text: 'Close',
              role: 'cancel',
            },
          ],
        });
        toast.present();
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
