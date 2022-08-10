import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { GenericService } from './generic.service';
import { PDF } from './models/pdf.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService extends GenericService<
  PDF.IModel,
  PDF.IResponseBody,
  PDF.IResponseBodyList,
  PDF.IClientData,
  PDF.IClientDataList
> {
  pdfs$ = new BehaviorSubject<PDF.IClientDataList>(null);
  private categoriesSet = new Set<number>();

  get categoriesCSV(): string {
    return [...this.categoriesSet].join(',');
  }

  constructor(
    private http: HttpClient,
    private authSrv: AuthService,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    super('pdfs', http, authSrv, modalCtrl);
  }

  refresh(topic: number): Observable<PDF.IClientDataList | HttpErrorResponse> {
    const obs$ =
      this.categoriesSet.size > 0
        ? this.list({ categories: this.categoriesCSV, topic: topic })
        : this.list({ topic: topic });

    return obs$.pipe(
      catchError(() => null),
      tap((list: PDF.IClientDataList) => {
        this.pdfs$.next(list);
      })
    );
  }

  upload(group: FormGroup): Observable<PDF.IClientData | HttpErrorResponse> {
    const formData = new FormData();

    formData.append('title', group.get('title').value);
    formData.append('pdf', group.get('pdf').value, group.get('pdf').value.name);

    return super.create(formData);
  }
}
