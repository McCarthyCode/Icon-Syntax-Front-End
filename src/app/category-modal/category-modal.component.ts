import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { CategoriesService } from '../categories.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
})
export class CategoryModalComponent implements OnInit {
  parent: Category.IClientData;
  category: Category.IRequestBody;

  get updateMode(): boolean {
    return Boolean(this.category) && Boolean(this.category.id);
  }
  get createMode(): boolean {
    return this.category === undefined;
  }

  form: FormGroup;
  name: string;

  @Output() dismissModalEmitter = new EventEmitter<void>();

  constructor(
    private _categoriesSrv: CategoriesService,
    private _alertCtrl: AlertController,
    private _router: Router,
    private _modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.category ? this.category.name : '', {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    });

    if (!this.category) {
      this.category = {
        name: '',
        parent: this.parent ? this.parent.id : undefined,
      };
    }
  }

  onInputChange(value: string) {
    this.category.name = value;
  }

  onSubmit() {
    this._categoriesSrv.create(this.category).subscribe(() => {
      this._alertCtrl
        .create({
          header: 'Category Added',
          message: 'The category has been created successfully.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this._modalCtrl.dismiss();
                this._router.navigateByUrl('/find');
              },
            },
          ],
        })
        .then((alert: HTMLIonAlertElement) => alert.present());
    });
  }
}
