import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { PDF } from '../models/pdf.model';
import { PdfService } from '../pdf.service';

@Component({
  selector: 'app-create-pdf',
  templateUrl: './create-pdf.component.html',
  styleUrls: ['./create-pdf.component.scss'],
})
export class CreatePdfComponent implements OnInit {
  @Input() page: number;

  form: FormGroup;

  constructor(
    private _modalController: ModalController,
    private _pdfSrv: PdfService,
    private _alertCtrl: AlertController,
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      pdf: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      title: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(160)],
      }),
      page: new FormControl(this.page, {
        validators: [Validators.required],
      }),
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

  submit(): void {
    this._pdfSrv.upload(this.form).subscribe(
      (response: PDF.IClientData) => {
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
            .then((alert) => alert.present());
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
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }
}
