import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonInput, ModalController } from '@ionic/angular';
import { PDF } from '../models/pdf.model';
import { PdfCategoriesService } from '../pdf-categories.service';
import { PdfService } from '../pdf.service';
import { SetOps } from '../set-ops';

interface ICategory {
  name: string;
  checked: boolean;
}

// const convertCategoryToInterface: ICategory = (name: string, checked: boolean) => {
//   return {
//     name: name,
//     checked: checked,
//   } as ICategory;
// };

@Component({
  selector: 'app-pdf-edit',
  templateUrl: './pdf-edit.component.html',
  styleUrls: ['./pdf-edit.component.scss'],
})
export class PdfEditComponent {
  @Input() id: number;

  form: FormGroup;
  existingModel: PDF.IModel;

  @ViewChild('addCategory') addCategoryInput: IonInput;

  checkedCategoriesSet = new Set<string>([]);
  get checkedCategoriesArr(): string[] {
    return [...this.checkedCategoriesSet];
  }
  get checkedCategoriesCSV(): string {
    return this.checkedCategoriesArr.join(',');
  }

  uncheckedCategoriesSet = new Set<string>([]);
  get uncheckedCategoriesArr(): string[] {
    return [...this.uncheckedCategoriesSet];
  }
  get uncheckedCategoriesCSV(): string {
    return this.uncheckedCategoriesArr.join(',');
  }

  categoriesSet = new Set<ICategory>([]);

  checked(name: string): ICategory {
    return { name: name, checked: true };
  }

  unchecked(name: string): ICategory {
    return { name: name, checked: false };
  }

  updateCategoriesSet() {
    this.categoriesSet = new Set<ICategory>([
      ...this.checkedCategoriesArr.map(this.checked),
      ...this.uncheckedCategoriesArr.map(this.unchecked),
    ]);
  }

  get categoriesArr(): ICategory[] {
    return [...this.categoriesSet].sort((a, b) =>
      a.name > b.name ? 1 : a.name < b.name ? -1 : 0
    );
  }
  get categoriesCSV(): string {
    return this.categoriesArr.join(',');
  }

  constructor(
    private _pdfSrv: PdfService,
    private _categoriesSrv: PdfCategoriesService,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController
  ) {}

  ionViewWillEnter() {
    this._categoriesSrv
      .list({ pdf: this.id })
      .subscribe((checkedCategories) => {
        this.checkedCategoriesSet = new Set(
          checkedCategories.data.map((category) => category.name)
        );
        this._categoriesSrv.list().subscribe((allCategories) => {
          this.uncheckedCategoriesSet = SetOps.difference(
            new Set(allCategories.data.map((category) => category.name)),
            this.checkedCategoriesSet
          );

          this.updateCategoriesSet();

          this._pdfSrv.retrieve(this.id).subscribe((pdfs) => {
            this.existingModel = pdfs.data;

            this.form = new FormGroup({
              title: new FormControl(this.existingModel.title, {
                updateOn: 'change',
                validators: [Validators.required, Validators.maxLength(160)],
              }),
              categories: new FormControl(this.checkedCategoriesCSV, {
                updateOn: 'change',
                validators: [Validators.required],
              }),
            });
          });
        });
      });
  }

  onCheckboxChange($event: any) {
    const category: string = $event.target.name;

    if ($event.detail.checked === undefined) {
      console.error('There was an error changing the category state.');
    } else if ($event.detail.checked) {
      this.checkedCategoriesSet.add(category);
      this.uncheckedCategoriesSet.delete(category);
    } else {
      this.checkedCategoriesSet.delete(category);
      this.uncheckedCategoriesSet.add(category);
    }

    this.updateCategoriesSet();
    this.form.patchValue({ categories: this.checkedCategoriesCSV });
  }

  onAddCategory(): void {
    const name = `${this.addCategoryInput.value}`;

    if (name) {
      this.checkedCategoriesSet.add(name);
      this.updateCategoriesSet();
      this.form.patchValue({ categories: this.checkedCategoriesCSV });
    }

    this.addCategoryInput.value = '';
  }

  closeModal() {
    this._modalCtrl.dismiss();
  }

  onSubmit() {
    const formData: FormData = this.form.value;

    for (let [key, value] of Object.entries(formData)) {
      if (!value) formData.delete(key);
    }

    this._pdfSrv.partialUpdate(this.existingModel.id, formData).subscribe(
      (clientData: PDF.IClientData) => {
        this._alertCtrl
          .create({
            message: 'PDF updated successfully.',
            buttons: ['Okay'],
          })
          .then((alert) => {
            this._modalCtrl.dismiss();
            this._pdfSrv.refresh().subscribe();
            alert.present();
          });
      },
      (errorResponse: HttpErrorResponse) => {
        console.error(errorResponse);
        this._alertCtrl
          .create({
            message:
              'There was an error editing the PDF details. Please contact the site administrator.',
            buttons: ['Okay'],
          })
          .then((alert) => {
            this._modalCtrl.dismiss();
            alert.present();
          });
      }
    );
  }
}
