import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Auth } from '../interfaces/auth.interface';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent implements OnInit {
  form: FormGroup;

  constructor(
    private _authSrv: AuthService,
    private _alertCtrl: AlertController,
    private _loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    });
  }

  onSubmit(): void {
    this._loadingCtrl
      .create({ message: 'Sending email&hellip;' })
      .then((loader) => {
        loader.present();

        this._authSrv
          .forgot(this.form.value)
          .subscribe((response: Auth.ISuccessResponse) => {
            this._alertCtrl
              .create({
                header: 'Password Reset Link Sent to Email',
                message: response.success,
                buttons: ['Okay'],
              })
              .then((alert) => {
                loader.dismiss();
                alert.present();
              });
          });
      });
  }
}
