import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { GenericService } from './generic.service';
import { PDF } from './models/pdf.model';

@Injectable({
  providedIn: 'root'
})
export class PdfCategoriesService extends GenericService<
  PDF.Category.IModel,
  PDF.Category.IResponseBody,
  PDF.Category.IResponseBodyList,
  PDF.Category.IClientData,
  PDF.Category.IClientDataList
> {
  categories$ = new BehaviorSubject<PDF.Category.IClientDataList>({
    retrieved: new Date(),
    data: []
  });

  constructor(
    private http: HttpClient,
    private authSrv: AuthService,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    super('pdfs/categories', http, authSrv, modalCtrl);
  }
}
