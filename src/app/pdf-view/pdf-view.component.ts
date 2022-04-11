import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PDF } from '../models/pdf.model';
import { PdfService } from '../pdf.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { AlertController, ModalController } from '@ionic/angular';
import { PdfEditComponent } from '../pdf-edit/pdf-edit.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.scss'],
})
export class PdfViewComponent {
  pdf: PDF.IModel;
  url: SafeResourceUrl;
  title = 'Loading...';

  get isAdmin(): boolean {
    return this._authSrv.isAdmin;
  }

  constructor(
    private _route: ActivatedRoute,
    private _pdfSrv: PdfService,
    private _authSrv: AuthService,
    private _router: Router,
    private _sanitizer: DomSanitizer,
    private _modalCtrl: ModalController,
    private _alertCtrl: AlertController
  ) {}

  ionViewWillEnter(): void {
    this._route.paramMap.subscribe((paramMap) => {
      const id = +paramMap['params']['id'];

      if (id) {
        this._pdfSrv.retrieve(id).subscribe(
          (clientData: PDF.IClientData) => {
            this.pdf = clientData.data;
            this.title = this.pdf.title;
            this.url = this._sanitizer.bypassSecurityTrustResourceUrl(
              environment.urlRoot + clientData.data.pdf
            );
          },
          (errorResponse) => {
            this.title = 'There was an error.';
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

  edit(): void {
    this._modalCtrl
      .create({
        component: PdfEditComponent,
        componentProps: {
          id: this.pdf.id,
          topic: this.pdf.topic,
        },
      })
      .then((modal) => {
        this._pdfSrv.refresh(this.pdf.topic).subscribe();
        modal.present();
      });
  }

  delete(): void {
    const title = this.pdf.title;

    this._alertCtrl
      .create({
        message: `Are you sure you want to delete the PDF titled "${title}"?`,
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Delete',
            handler: () => {
              this._pdfSrv
                .delete(this.pdf.id, true)
                .pipe(switchMap(() => this._pdfSrv.refresh(this.pdf.topic)))
                .subscribe(() => {
                  this._alertCtrl
                    .create({
                      message:
                        'You have successfully deleted the PDF titled ' +
                        `"${title}".`,
                      buttons: ['Okay'],
                    })
                    .then((successAlert) => successAlert.present());
                });
            },
          },
        ],
      })
      .then((confirmAlert) => confirmAlert.present());
  }
}
