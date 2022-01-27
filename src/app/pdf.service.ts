import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(http: HttpClient, authSrv: AuthService, router: Router) {
    super('pdf', http, authSrv, router);
  }
}
