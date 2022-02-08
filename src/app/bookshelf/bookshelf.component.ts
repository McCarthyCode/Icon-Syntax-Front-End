import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';
import { CreatePdfComponent } from '../create-pdf/create-pdf.component';
import { PDF } from '../models/pdf.model';
import { PdfService } from '../pdf.service';

@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.scss'],
})
export class BookshelfComponent {
  get pdfs$(): BehaviorSubject<PDF.IClientDataList> {
    return this._pdfSrv.pdfs$;
  }

  get isAuthenticated(): boolean {
    return this._authSrv.isAuthenticated;
  }

  get pdfs(): PDF.IClientDataList {
    return this.pdfs$.value;
  }

  constructor(
    private _pdfSrv: PdfService,
    private _modalController: ModalController,
    private _authSrv: AuthService
  ) {}

  ionViewWillEnter() {
    this._pdfSrv.list({ topic: 3 }).subscribe((clientDataList) => {
      this.pdfs$.next(clientDataList);
    });
  }

  async presentModal() {
    const modal = await this._modalController.create({
      component: CreatePdfComponent,
      componentProps: {
        topic: 3,
      },
    });

    return await modal.present();
  }
}
