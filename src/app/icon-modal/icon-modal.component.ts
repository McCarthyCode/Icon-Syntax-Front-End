import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { AuthService } from '../auth.service';
import { IconsService } from '../icons.service';
import { Category } from '../models/category.model';
import { Icon } from '../models/icon.model';

@Component({
  selector: 'app-icon-modal',
  templateUrl: './icon-modal.component.html',
  styleUrls: ['./icon-modal.component.scss'],
})
export class IconModalComponent implements OnInit {
  form: FormGroup;
  icon: Icon.IClientData;

  mode: 'create' | 'update';
  breadcrumbs: Category.IClientData[] = [];
  category: Category.IClientData;

  constructor(
    private _authSrv: AuthService,
    private _iconsSrv: IconsService,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    private _modalCtrl: ModalController,
    private _router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      icon: new FormControl(null, {
        updateOn: 'change',
        validators: this.mode === 'create' ? [Validators.required] : undefined,
      }),
      word: new FormControl(this.icon ? this.icon.word : '', {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(40)],
      }),
      descriptor: new FormControl(this.icon ? this.icon.descriptor : '', {
        updateOn: 'change',
        validators: [Validators.maxLength(80)],
      }),
      category: new FormControl(this.category ? this.category.id : null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    });
  }

  onClose(): void {
    this._modalCtrl.dismiss();
  }

  onFileChange(files: File[]): void {
    if (files.length === 0) {
      this.form.patchValue({ icon: null });
    } else if (files.length === 1) {
      this.form.patchValue({ icon: files[0] });
    }
  }

  onWordChange(word: string): void {
    this.form.patchValue({ word: word });
  }

  onDescriptorChange(descriptor: string): void {
    this.form.patchValue({ descriptor: descriptor });
  }

  onSubmit(): void {
    const redirectFind = () => {
      this._modalCtrl.dismiss();
      this._router.navigateByUrl('/find');
    };

    const http400Handler = (response: { error: Icon.IErrorResponse }) => {
      if (response.error.errors) {
        for (let error of response.error.errors) {
          this._toastCtrl
            .create({
              message: error,
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
    };

    const http500Handler = (response: { error: Icon.IErrorResponse }) => {
      this._alertCtrl
        .create({
          header: 'HTTP 500: Server Error',
          message:
            'There was an error processing your request on our servers. Please try again later.',
          buttons: [
            {
              text: 'Okay',
              handler: redirectFind,
            },
          ],
        })
        .then((alert) => {
          alert.present();
        });
    };

    const errorHandler = (response: {
      status: number;
      error: Icon.IErrorResponse;
    }) => {
      switch (response.status) {
        case 400:
          http400Handler(response);
          break;
        case 401:
          this._router.navigateByUrl('/login');
          break;
        case 500:
          http500Handler(response);
          break;
        default:
          console.error(response);
      }
    };

    if (this.mode === 'create') {
      this._iconsSrv.create(this.form.value).subscribe({
        next: () => {
          const credentials = this._authSrv.credentials$.value;
          this._alertCtrl
            .create({
              header: 'Icon Uploaded Successfully',
              message: `The icon has been entered in our database${
                credentials.isAdmin ? '' : ' and is pending approval'
              }.`,
              buttons: [
                {
                  text: 'Okay',
                  handler: redirectFind,
                },
              ],
            })
            .then((alert) => {
              alert.present();
            });
        },
        error: errorHandler,
      });
    } else if (this.mode === 'update') {
      const body: Icon.IRequestBody = {
        id: this.icon.id,
        ...this.form.value,
      };
      this._iconsSrv.update(body).subscribe({
        next: () => {
          const credentials = this._authSrv.credentials$.value;
          this._alertCtrl
            .create({
              header: 'Icon Updated Successfully',
              message: `The icon has been modified in our database${
                credentials.isAdmin ? '' : ' and is pending approval'
              }.`,
              buttons: [
                {
                  text: 'Okay',
                  handler: redirectFind,
                },
              ],
            })
            .then((alert) => {
              alert.present();
            });
        },
        error: errorHandler,
      });
    }
  }
}
