import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  ToastController
} from '@ionic/angular';
import { CategoriesService } from '../categories.service';
import { Category } from '../models/category.model';
import { Model } from '../models/model';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss']
})
export class CategoryModalComponent implements OnInit {
  parent: Category.IClientData;
  category: Partial<Category.IModel>;
  path: string;
  mode: 'create' | 'update';

  form: FormGroup;
  name: string;

  nonFieldErrors: string[] = [];
  nameErrors: string[] = [];

  constructor(
    private _router: Router,
    private _categoriesSrv: CategoriesService,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController,
    private _toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(
        this.mode === 'update' ? this.category?.id : undefined,
        {
          updateOn: 'change',
          validators: this.mode === 'update' ? [Validators.required] : undefined
        }
      ),
      name: new FormControl(this.category ? this.category.name : '', {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(40)]
      }),
      parent: new FormControl(this.parent ? this.parent.data.id : null, {
        updateOn: 'change'
      })
    });
  }

  onInputChange($event: any): void {
    this.form.patchValue({ name: $event.detail.value });
  }

  onSubmit(): void {
    const errorHandler = (response: { error: Model.IErrorResponse }) => {
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
                role: 'cancel'
              }
            ]
          })
          .then((toast) => toast.present());
      }
    };

    if (this.mode === 'create') {
      this._categoriesSrv.create(this.form.value).subscribe({
        next: () => {
          this._alertCtrl
            .create({
              header: 'Category Added',
              message: 'The category has been created successfully.',
              cssClass: 'alert',
              buttons: [
                {
                  text: 'Okay',
                  handler: () => {
                    this._modalCtrl.dismiss();
                    this._router.navigateByUrl('/icons/browse');
                  }
                }
              ]
            })
            .then((alert: HTMLIonAlertElement) => alert.present());
        },
        error: errorHandler
      });
    } else if (this.mode === 'update') {
      this._categoriesSrv.update(this.form.value).subscribe({
        next: () => {
          this._alertCtrl
            .create({
              header: 'Category Updated',
              message: 'The category has been edited successfully.',
              cssClass: 'alert',
              buttons: [
                {
                  text: 'Okay',
                  handler: () => {
                    this._modalCtrl.dismiss();
                    this._router.navigateByUrl('/icons/browse');
                  }
                }
              ]
            })
            .then((alert: HTMLIonAlertElement) => alert.present());
        },
        error: errorHandler
      });
    }
  }

  onClose(): void {
    this._modalCtrl.dismiss();
  }
}
