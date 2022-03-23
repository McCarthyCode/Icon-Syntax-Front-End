import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { CreatePdfComponent } from '../create-pdf/create-pdf.component';
import { PDF } from '../models/pdf.model';
import { PdfCategoriesService } from '../pdf-categories.service';
import { PdfEditComponent } from '../pdf-edit/pdf-edit.component';
import { PdfService } from '../pdf.service';

@Component({
  selector: 'app-icon-lit',
  templateUrl: './icon-lit.component.html',
  styleUrls: ['./icon-lit.component.scss'],
})
export class IconLitComponent {
  get pdfs$(): BehaviorSubject<PDF.IClientDataList> {
    return this._pdfSrv.pdfs$;
  }
  get categories$(): BehaviorSubject<PDF.Category.IClientDataList> {
    return this._categoriesSrv.categories$;
  }

  get isAuthenticated(): boolean {
    return this._authSrv.isAuthenticated;
  }
  get isAdmin(): boolean {
    return this._authSrv.isAdmin;
  }

  get pdfs(): PDF.IModel[] {
    const value = this.pdfs$.value;
    return value ? value.data : [];
  }
  get categories(): PDF.Category.IModel[] {
    const value = this.categories$.value;
    return value ? value.data : [];
  }
  set categories(data: PDF.Category.IModel[]) {
    let clientDataList = this.categories$.value;
    clientDataList.data = data;
    this.categories$.next(clientDataList);
  }

  get categoriesCSV(): string {
    return this.categories
      .filter(Boolean)
      .filter((value) => value.selected)
      .map((value) => value.name)
      .join(',');
  }

  constructor(
    private _pdfSrv: PdfService,
    private _modalCtrl: ModalController,
    private _alertCtrl: AlertController,
    private _authSrv: AuthService,
    private _categoriesSrv: PdfCategoriesService
  ) {}

  ionViewWillEnter() {
    this.updateCategories();
  }

  updateCategories() {
    this._categoriesSrv.list().subscribe((clientDataList) => {
      for (let i = 0; i < clientDataList.data.length; i++) {
        clientDataList.data[i]['selected'] = false;
      }

      this.categories$.next(clientDataList);
      this.updatePdfs();
    });
  }

  updatePdfs(params: any = {}) {
    this._pdfSrv.list(params).subscribe((clientDataList) => {
      for (let i = 0; i < clientDataList.data.length; i++) {
        const categoriesCSV = clientDataList.data[i].categories as string;
        clientDataList.data[i].categories = new Set(categoriesCSV.split(','));
      }

      this.pdfs$.next(clientDataList);
    });
  }

  selectAll() {
    for (let category of this.categories) {
      category.selected = true;
    }

    this.updatePdfs();
  }

  selectNone() {
    for (let category of this.categories) {
      category.selected = false;
    }

    this.updatePdfs();
  }

  toggleCategory(name: string) {
    this.categories = this.categories.map((category) => {
      if (category.name === name) {
        category.selected = !category.selected;
      }

      return category;
    });

    this.updatePdfs(
      this.categoriesCSV ? { categories: this.categoriesCSV } : {}
    );
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
      .then((modal) => {
        this._pdfSrv.refresh().subscribe();
        modal.present();
      });
  }

  delete(id: number): void {
    this._pdfSrv.retrieve(id).subscribe(async (clientData) => {
      const title = clientData.data.title;

      this._alertCtrl
        .create({
          message: `Are you sure you want to delete the PDF titled "${title}"?`,
          buttons: [
            { text: 'Cancel', role: 'cancel' },
            {
              text: 'Delete',
              handler: () => {
                this._pdfSrv
                  .delete(id, true)
                  .pipe(switchMap(() => this._pdfSrv.refresh()))
                  .subscribe(() => {
                    this._alertCtrl
                      .create({
                        message:
                          'You have successfully deleted the PDF titled ' +
                          `"${title}".`,
                        buttons: ['Okay'],
                      })
                      .then((successAlert) => {
                        this.updateCategories();
                        successAlert.present();
                      });
                  });
              },
            },
          ],
        })
        .then((confirmAlert) => confirmAlert.present());
    });
  }
}
