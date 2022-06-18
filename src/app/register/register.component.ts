import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Auth } from '../interfaces/auth.interface';
import { Validators as CustomValidators } from '../validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  errors: {
    username: string[];
    email: string[];
    password: string[];
  };

  constructor(
    private _authSrv: AuthService,
    private _alertCtrl: AlertController,
    private _loadingCtrl: LoadingController
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      email: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        updateOn: 'change',
        validators: [
          Validators.required,
          Validators.minLength(8),
          CustomValidators.containsUppercase(),
          CustomValidators.containsLowercase(),
          CustomValidators.containsNumber(),
          CustomValidators.containsPunctuation()
        ]
      })
    });
  }

  clearErrors(): void {
    this.errors = {
      username: [],
      email: [],
      password: []
    };
  }

  onSubmit(): void {
    this._loadingCtrl
      .create({ message: 'Submitting&hellip;', cssClass: 'loader' })
      .then((loader) => {
        loader.present();
        this._authSrv.register(this.form.value).subscribe({
          next: (response: Auth.ISuccessResponse) => {
            this._alertCtrl
              .create({
                header: 'Email Confirmation Required',
                message: response.success,
                cssClass: 'alert',
                buttons: ['Okay']
              })
              .then((alert) => {
                loader.dismiss();
                alert.present();
              });
          },
          error: (response: HttpErrorResponse) => {
            this.clearErrors();
            Object.keys(response.error).forEach((key) => {
              this.errors[key] = response.error[key];
            });
            loader.dismiss();
          }
        });
      });
  }
}
