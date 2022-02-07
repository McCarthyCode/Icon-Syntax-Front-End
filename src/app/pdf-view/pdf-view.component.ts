import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PDF } from '../models/pdf.model';
import { PdfService } from '../pdf.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.scss'],
})
export class PdfViewComponent implements OnInit {
  pdf: PDF.IModel;
  url: SafeResourceUrl;
  title = 'Loading...';

  constructor(
    private _route: ActivatedRoute,
    private _pdfSrv: PdfService,
    private _router: Router,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this._route.paramMap.subscribe((paramMap) => {
      const id = +paramMap['params']['id'];

      if (id) {
        this._pdfSrv.retrieve(id).subscribe(
          (clientData: PDF.IClientData) => {
            this.pdf = clientData.data;
            this.title = this.pdf.title;
            this.url = this._sanitizer.bypassSecurityTrustResourceUrl(
              environment.mediaBase + '/' + clientData.data.pdf
            );
          },
          (errorResponse) => {
            this.title = 'There was an error.'
            console.error(errorResponse);
            this._router.navigateByUrl('/404');
          }
        );
      } else {
        this.title = id ? `"${id}" is an invalid ID.` : 'No ID specified.';
        console.error(this.title);
        this._router.navigateByUrl('/404');
      }
    });
  }
}
