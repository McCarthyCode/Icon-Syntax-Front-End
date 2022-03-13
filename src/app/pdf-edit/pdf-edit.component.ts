import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonInput, ModalController } from '@ionic/angular';
import { PDF } from '../models/pdf.model';
import { PdfCategoriesService } from '../pdf-categories.service';
import { PdfService } from '../pdf.service';

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

  private categoriesSet = new Set<string>([]);
  get categoriesArr(): string[] {
    return [...this.categoriesSet];
  }
  get categoriesCSV(): string {
    return this.categoriesArr.join(',');
  }

  private checkedCategoriesSet = new Set<string>([]);
  get checkedCategoriesArr(): string[] {
    return [...this.checkedCategoriesSet];
  }
  get checkedCategoriesCSV(): string {
    return this.checkedCategoriesArr.join(',');
  }

  constructor(
    private _pdfSrv: PdfService,
    private _categoriesSrv: PdfCategoriesService,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController
  ) {}

  ionViewWillEnter() {
    this._categoriesSrv.list({ pdf: this.id }).subscribe((categories) => {
      this.checkedCategoriesSet = this.categoriesSet = new Set(
        categories.data.map((category) => category.name)
      );

      this._pdfSrv.retrieve(this.id).subscribe((pdfs) => {
        this.existingModel = pdfs.data;

        this.form = new FormGroup({
          id: new FormControl(this.existingModel.id),
          title: new FormControl(this.existingModel.title, {
            updateOn: 'change',
            validators: [Validators.required, Validators.maxLength(160)],
          }),
          categories: new FormControl(this.categoriesCSV, {
            updateOn: 'change',
            validators: [Validators.required],
          }),
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
    } else {
      this.checkedCategoriesSet.delete(category);
    }

    this.form.patchValue({ categories: this.checkedCategoriesCSV });
  }

  onAddCategory(): void {
    const value = `${this.addCategoryInput.value}`;

    if (value) this.categoriesSet.add(value);
    this.addCategoryInput.value = '';

    this.form.patchValue({ categories: this.checkedCategoriesCSV });
  }

  closeModal() {
    this._modalCtrl.dismiss();
  }

  onSubmit() {
    const formData: FormData = this.form.value;

    for (let [key, value] of Object.entries(formData)) {
      if (!value) formData.delete(key);
    }

    this._pdfSrv.partialUpdate(formData).subscribe(
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
