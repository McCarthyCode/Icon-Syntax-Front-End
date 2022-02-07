import { Component, OnInit } from '@angular/core';
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
export class DiaryComponent implements OnInit {
  pdfs$ = new BehaviorSubject<PDF.IClientDataList>(null);

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

  ngOnInit() {
    this._pdfSrv.list({ topic: 2, page: 1 }).subscribe((clientDataList) => {
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
