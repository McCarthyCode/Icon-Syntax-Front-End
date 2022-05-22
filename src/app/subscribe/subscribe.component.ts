import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { SubscribeService } from './subscribe.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss'],
})
export class SubscribeComponent implements OnInit {
  get isAdmin(): boolean {
    return this._authSrv.isAdmin;
  }

  error: string;
  downloadUrl = environment.apiBase + 'auth/subscriptions';
  form: FormGroup;

  constructor(
    private _subscribeSrv: SubscribeService,
    private _alertCtrl: AlertController,
    private _authSrv: AuthService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required, Validators.email],
      }),
    });
  }

  subscribe(): void {
    this._subscribeSrv.subscribe(this.form.value.email).subscribe(
      () => {
        this.error = '';
        this._alertCtrl
          .create({
            message:
              'Your email address has been saved successfully. Thank you for subscribing to iconSyntax!',
            buttons: ['Okay'],
          })
          .then((alert) => alert.present());
      },
      (response: HttpErrorResponse) => {
        if (response.status === 400) {
          this.error = response.error.email[0];
        }
      }
    );
  }
}
