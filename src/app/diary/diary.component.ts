import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';
import { CreatePdfComponent } from '../create-pdf/create-pdf.component';
import { PDF } from '../models/pdf.model';
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

  constructor(
    private _pdfSrv: PdfService,
    private _modalController: ModalController,
    private _authSrv: AuthService
  ) {}

  ionViewWillEnter() {
    this._pdfSrv.list({ topic: 2 }).subscribe((clientDataList) => {
      this.pdfs$.next(clientDataList);
    });
  }

  async presentModal() {
    const modal = await this._modalController.create({
      component: CreatePdfComponent,
      componentProps: {
        topic: 2,
      },
    });

    return await modal.present();
  }
}
