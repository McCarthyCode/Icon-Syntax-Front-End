import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonInput, ModalController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { PDF } from '../models/pdf.model';
import { PdfCategoriesService } from '../pdf-categories.service';
import { PdfService } from '../pdf.service';

@Component({
  selector: 'app-create-pdf',
  templateUrl: './create-pdf.component.html',
  styleUrls: ['./create-pdf.component.scss'],
})
export class CreatePdfComponent implements OnInit {
  form: FormGroup = new FormGroup({});
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
    private _modalController: ModalController,
    private _pdfSrv: PdfService,
    private _alertCtrl: AlertController,
    private _authSrv: AuthService,
    private _router: Router,
    private _categoriesSrv: PdfCategoriesService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(160)],
      }),
      pdf: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      categories: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(160)],
      }),
    });

    this._categoriesSrv.list().subscribe((categories) => {
      this.categoriesSet = new Set<string>(
        categories.data.map((category) => category.name)
      );
    });
  }

  closeModal() {
    this._modalController.dismiss();
  }

  onFileChange($event: any): void {
    const files: File[] = $event.target.files;

    if (files && files.length !== 0) {
      this.form.patchValue({ pdf: files[0] });
    } else {
      this.form.patchValue({ pdf: null });
    }
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
  }

  createCategory(name: string): void {}

  submit(refresh = true): void {
    const formData = new FormData();

    formData.append('title', this.form.get('title').value);
    formData.append(
      'pdf',
      this.form.get('pdf').value,
      this.form.get('pdf').value.name
    );
    formData.append('categories', this.form.get('categories').value);

    this._pdfSrv.create(formData).subscribe((response: PDF.IClientData) => {
      if (response === null) {
        this._alertCtrl
          .create({
            message: 'Please login to continue.',
            buttons: ['Okay'],
          })
          .then((alert) => alert.present());

        return;
      } else if (response?.success) {
        this._alertCtrl
          .create({
            message: response.success,
            buttons: ['Okay'],
          })
          .then((alert) => {
            this._pdfSrv.refresh().subscribe();
            alert.present();
          });
        this._modalController.dismiss();
      } else {
        if (response && response.errors) {
          for (let error of response.errors) console.error(error);
        } else {
          console.error(response);
        }

        this._alertCtrl
          .create({
            message:
              'There was an error processing your request. Please try again later.',
            buttons: ['Okay'],
          })
          .then((alert) => alert.present());

        this._router.navigateByUrl('/icon-lit');
      }
    });
  }
}
