import { Component, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { PDF } from '../models/pdf.model';
import { PdfCategoriesService } from '../pdf-categories.service';

const topics = {
  1: 'About',
  2: 'Icon Literature',
  3: 'Personal',
};

@Component({
  selector: 'app-edit-pdf-categories',
  templateUrl: './edit-pdf-categories.component.html',
  styleUrls: ['./edit-pdf-categories.component.scss'],
})
export class EditPdfCategoriesComponent {
  topic: number;
  categories: PDF.Category.IModel[];

  @ViewChild('addCategoryInput') addCategoryInput: any;

  get title(): string {
    return topics[this.topic];
  }

  constructor(
    private _modalCtrl: ModalController,
    public categoriesSrv: PdfCategoriesService,
    public alertCtrl: AlertController
  ) {}

  refreshCategories() {
    this.categoriesSrv
      .list({ topic: this.topic })
      .subscribe((clientDataList) => {
        this.categories = clientDataList.data;
      });
  }

  ionViewWillEnter() {
    this.refreshCategories();
  }

  closeModal(): void {
    this._modalCtrl.dismiss();
  }

  addCategory($event: any): void {
    const name = $event.target.value;

    if (!name) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('topic', String(this.topic));

    this.categoriesSrv
      .create(formData)
      .subscribe((clientData: PDF.Category.IClientData) => {
        this.addCategoryInput.value = '';
        this.categories.push(clientData.data);
      });
  }

  onBlurRenameCategory($event: any, id: number): void {
    this.renameCategory($event.detail.target.value, id);
  }

  onEnterRenameCategory($event: any, id: number): void {
    this.renameCategory($event.target.value, id);
  }

  renameCategory(name: string, id: number): void {
    const formData = new FormData();
    formData.append('name', name);

    this.categoriesSrv
      .partialUpdate(id, formData)
      .subscribe(() => this.refreshCategories());
  }

  deleteCategory(id: number, name: string): void {
    this.alertCtrl
      .create({
        message:
          'Are you sure you want to delete the category titled "' + name + '"?',
        buttons: [
          {
            text: 'Cancel',
            role: 'dismiss',
          },
          {
            text: 'Okay',
            handler: () =>
              this.categoriesSrv.delete(id).subscribe(() => {
                this.refreshCategories();
              }),
          },
        ],
      })
      .then((alert) => alert.present());
  }
}
