import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { GenericService } from './generic.service';
import { PDF } from './models/pdf.model';

@Injectable({
  providedIn: 'root',
})
export class PdfService extends GenericService<
  PDF.IModel,
  PDF.IRequestBody,
  PDF.IResponseBody,
  PDF.IResponseBodyList,
  PDF.IClientData,
  PDF.IClientDataList
> {
  constructor(
    private http: HttpClient,
    private authSrv: AuthService,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    super('pdf', http, authSrv, router, modalCtrl);
  }

  upload(group: FormGroup): Observable<PDF.IClientData | HttpErrorResponse> {
    const formData = new FormData();

    formData.append('title', group.get('title').value);
    formData.append('pdf', group.get('pdf').value, group.get('pdf').value.name);

    const pageNum = group.get('page').value;
    formData.append('page', pageNum);

    let url = '/login?redirect=%2F';
    switch (pageNum) {
      case '1':
      case 1:
        url += 'about';
        break;
      case '2':
      case 2:
        url += 'diary';
        break;
      case '3':
      case 3:
        url += 'bookshelf';
        break;
    }

    return super.create(formData, true).pipe(
      tap((res) => {
        if (res === null) {
          this.router.navigateByUrl(url);
        }
      })
    );
  }
}
