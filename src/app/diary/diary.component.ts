import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { CreatePdfComponent } from '../create-pdf/create-pdf.component';
import { PDF } from '../models/pdf.model';
import { PdfEditComponent } from '../pdf-edit/pdf-edit.component';
import { PdfService } from '../pdf.service';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent {
  get pdfs$(): BehaviorSubject<PDF.IClientDataList> {
    return this._pdfSrv.pdfs$;
  }

  get isAuthenticated(): boolean {
    return this._authSrv.isAuthenticated;
  }

  get isAdmin(): boolean {
    return this._authSrv.isAdmin;
  }

  constructor(
    private _authSrv: AuthService,
    private _pdfSrv: PdfService,
    private _modalCtrl: ModalController,
    private _alertCtrl: AlertController
  ) {}

  ionViewWillEnter() {
    this._pdfSrv.list().subscribe((clientDataList) => {
      this.pdfs$.next(clientDataList);
    });
  }

  presentModal() {
    this._modalCtrl
      .create({ component: CreatePdfComponent })
      .then((modal) => modal.present());
  }

  edit(id: number): void {
    this._modalCtrl
      .create({
        component: PdfEditComponent,
        componentProps: {
          id: id,
        },
      })
      .then((modal) => modal.present());
  }

  delete(id: number): void {
    this._pdfSrv.retrieve(id).subscribe(async (clientData) => {
      const title = clientData.data.title;

      const confirmAlert = await this._alertCtrl.create({
        message: `Are you sure you want to delete the PDF titled "${title}"?`,
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Delete',
            handler: () => {
              this._pdfSrv
                .delete(id, true)
                .pipe(
                  tap(() => {
                    this._pdfSrv.refresh().subscribe();
                  })
                )
                .subscribe(async () => {
                  const successAlert = await this._alertCtrl.create({
                    message:
                      'You have successfully deleted the PDF titled ' +
                      `"${title}".`,
                    buttons: ['Okay'],
                  });
                  return await successAlert.present();
                });
            },
          },
        ],
      });

      return await confirmAlert.present();
    });
  }
}
