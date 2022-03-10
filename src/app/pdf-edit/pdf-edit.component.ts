import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AlertController,
  IonRadioGroup,
  ModalController,
} from '@ionic/angular';
import { PDF } from '../models/pdf.model';
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

  categories: string[] = ['Stories', 'Poems', 'Songs', 'Lessons'];

  constructor(
    private _pdfSrv: PdfService,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController
  ) {}

  ionViewWillEnter() {
    this._pdfSrv.retrieve(this.id).subscribe((clientData) => {
      this.existingModel = clientData.data;

      this.form = new FormGroup({
        id: new FormControl(this.existingModel.id),
        title: new FormControl(this.existingModel.title, {
          updateOn: 'change',
          validators: [Validators.required, Validators.maxLength(160)],
        }),
      });
    });
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
