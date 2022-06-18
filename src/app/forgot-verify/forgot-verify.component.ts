import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Auth } from '../interfaces/auth.interface';
import { Validators as CustomValidators } from '../validators';

@Component({
  selector: 'app-forgot-verify',
  templateUrl: './forgot-verify.component.html',
  styleUrls: ['./forgot-verify.component.scss']
})
export class ForgotVerifyComponent implements OnInit {
  form: FormGroup;
  access: string;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
    private _authSrv: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((paramMap) => {
      this.access = paramMap.get('access');
      this.form = new FormGroup({
        password: new FormControl('', {
          updateOn: 'blur',
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
    });
  }

  onSubmit(): void {
    this._loadingCtrl
      .create({ message: 'Loading&hellip;', cssClass: 'loader' })
      .then((loader) => {
        loader.present();

        this._authSrv.verify(this.form.value, this.access).subscribe({
          next: (response: Auth.ISuccessResponse) => {
            this._authSrv.credentials$.next(response.credentials);

            this._alertCtrl
              .create({
                header: 'Password Reset Successfully',
                message: response.success,
                cssClass: 'alert',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => this._router.navigateByUrl('/icons/browse')
                  }
                ]
              })
              .then((alert) => {
                loader.dismiss();
                alert.present();
              });
          },
          error: (response: any) => {
            console.error(response);
            this._alertCtrl
              .create({
                header: 'Error Resetting Password',
                subHeader: response.statusText,
                message: response.error.errors
                  ? response.error.errors.join('\n')
                  : 'An unspecified error occurred.',
                cssClass: 'alert',
                buttons: ['Okay']
              })
              .then((alert) => {
                loader.dismiss();
                alert.present();
              });
          }
        });
      });
  }
}
