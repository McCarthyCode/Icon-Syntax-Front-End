import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  MenuController,
  ModalController,
  ToastController
} from '@ionic/angular';
import { AuthService } from '../auth.service';
import { IconsService } from '../icons.service';
import { Category } from '../models/category.model';
import { Icon } from '../models/icon.model';

@Component({
  selector: 'app-icon-modal',
  templateUrl: './icon-modal.component.html',
  styleUrls: ['./icon-modal.component.scss']
})
export class IconModalComponent implements OnInit {
  form: FormGroup;
  icon: Icon.IModel;

  mode: 'create' | 'update';
  category: Category.IModel;

  constructor(
    private _authSrv: AuthService,
    private _iconsSrv: IconsService,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    private _menuCtrl: MenuController,
    private _modalCtrl: ModalController,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      icon: new FormControl(null, {
        updateOn: 'change',
        validators: this.mode === 'create' ? [Validators.required] : undefined
      }),
      word: new FormControl(this.icon ? this.icon.word : '', {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(40)]
      }),
      descriptor: new FormControl(this.icon ? this.icon.descriptor : '', {
        updateOn: 'change',
        validators: [Validators.maxLength(80)]
      }),
      category: new FormControl(this.category ? this.category.id : null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  onClose(): void {
    this._modalCtrl.dismiss();
  }

  onFileChange($event: any): void {
    const files: File[] = $event.target.files;

    if (files.length === 0) {
      this.form.patchValue({ icon: null });
    } else if (files.length === 1) {
      this.form.patchValue({ icon: files[0] });
    }
  }

  onWordChange($event: any): void {
    this.form.patchValue({ word: $event.detail.value });
  }

  onDescriptorChange($event: any): void {
    this.form.patchValue({ descriptor: $event.detail.value });
  }

  onSubmit(refresh = true): void {
    const redirectLibrary = () => {
      this._modalCtrl.dismiss();
      this._menuCtrl.close('end');
      this._router.navigateByUrl('/icons/browse');
    };

    const http400Handler = (response: HttpErrorResponse) => {
      if (response.error) {
        Object.entries(response.error).forEach(([key, value]) => {
          this._toastCtrl
            .create({
              message: value[0],
              position: 'top',
              color: 'danger',
              duration: 5000,
              cssClass: 'toast',
              buttons: [
                {
                  text: 'Close',
                  role: 'cancel'
                }
              ]
            })
            .then((toast) => toast.present());
        });
      }
    };

    const http500Handler = (response: HttpErrorResponse) => {
      this._alertCtrl
        .create({
          header: 'HTTP 500: Server Error',
          message:
            'There was an error processing your request on our servers. Please try again later.',
          cssClass: 'alert',
          buttons: [
            {
              text: 'Okay',
              handler: redirectLibrary
            }
          ]
        })
        .then((alert) => {
          alert.present();
        });
    };

    const errorHandler = (response: HttpErrorResponse) => {
      switch (response.status) {
        case 400:
          http400Handler(response);
          break;
        case 500:
          http500Handler(response);
          break;
        default:
          console.error(response);
      }
    };

    if (this.mode === 'create') {
      const formData = new FormData();

      formData.append(
        'icon',
        this.form.get('icon').value,
        this.form.get('icon').value.name
      );

      for (let key of ['word', 'descriptor', 'category']) {
        const value = this.form.get(key).value;
        if (value) formData.append(key, value);
      }

      this._iconsSrv.create(formData).subscribe({
        next: () => {
          const credentials = this._authSrv.credentials$.value;
          this._alertCtrl
            .create({
              header: 'Icon Uploaded Successfully',
              message: `The icon has been entered in our database${
                credentials.isAdmin ? '' : ' and is pending approval'
              }.`,
              cssClass: 'alert',
              buttons: [
                {
                  text: 'Okay',
                  handler: redirectLibrary
                }
              ]
            })
            .then((alert) => {
              alert.present();
            });
        },
        error: errorHandler
      });
    } else if (this.mode === 'update') {
      const formData = new FormData();
      for (let key of ['word', 'descriptor']) {
        if (this.form.get(key) !== null) {
          const value = this.form.get(key).value;

          if (value) {
            formData.append(key, value);
          }
        } else {
          console.error(`Key "${key}" not added to request. Ignoring.`);
        }
      }

      this._iconsSrv.partialUpdate(this.icon.id, formData).subscribe({
        next: () => {
          const credentials = this._authSrv.credentials$.value;
          this._alertCtrl
            .create({
              header: 'Icon Updated Successfully',
              message: `The icon has been modified in our database${
                credentials.isAdmin ? '' : ' and is pending approval'
              }.`,
              cssClass: 'alert',
              buttons: [
                {
                  text: 'Okay',
                  role: 'cancel'
                }
              ]
            })
            .then((alert) => {
              alert.present().then(redirectLibrary);
            });
        },
        error: errorHandler
      });
    }
  }
}
