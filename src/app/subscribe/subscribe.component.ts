import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInput } from '@ionic/angular';
import { SubscribeService } from './subscribe.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss'],
})
export class SubscribeComponent {
  @ViewChild('email') emailInput: ElementRef;
  get email(): string {
    return this.emailInput.nativeElement.value;
  }
  error: string;

  constructor(
    private _subscribeSrv: SubscribeService,
    private _alertCtrl: AlertController
  ) {}

  private _errorHandler(response: HttpErrorResponse): void {
    if (response.status === 400) {
      this.error = response.error.email;
    }
  }

  private _simpleAlert(message: string): void {
    this._alertCtrl
      .create({
        message: message,
        buttons: ['Okay'],
      })
      .then((alert) => alert.present());
  }

  subscribe(): void {
    this._subscribeSrv.subscribe(this.email).subscribe(() => {
      this._simpleAlert(
        'Your email address has been saved successfully. Thank you for subscribing to iconSyntax!'
      );
    }, this._errorHandler);
  }

  unsubscribe(): void {
    this._subscribeSrv.unsubscribe(this.email).subscribe(() => {
      this._simpleAlert(
        'Your email address has been removed successfully. Thank you for subscribing to iconSyntax!'
      );
    }, this._errorHandler);
  }
}
