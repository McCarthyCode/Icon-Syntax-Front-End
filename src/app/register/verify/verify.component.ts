import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { Auth } from 'src/app/interfaces/auth.interface';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class RegisterVerifyComponent implements OnInit {
  loading = true;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _alertCtrl: AlertController,
    private _authSrv: AuthService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((paramMap) => {
      this._authSrv.registerVerify(paramMap.get('access')).subscribe({
        next: (response: Auth.ISuccessResponse) => {
          this._authSrv.credentials$.next(response.credentials);

          this._alertCtrl
            .create({
              header: 'Registration Complete',
              message:
                'You have successfully completed the registration process.',
              cssClass: 'alert',
              buttons: [
                {
                  text: 'Okay',
                  handler: () => this._router.navigateByUrl('/'),
                },
              ],
            })
            .then((alert) => {
              this.loading = false;
              alert.present();
            });
        },
        error: (response) => console.error(response),
      });
    });
  }
}
