import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreatePdfComponent } from '../create-pdf/create-pdf.component';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent implements OnInit {
  constructor(private _modalController: ModalController) {}

  ngOnInit() {}

  async presentModal() {
    const modal = await this._modalController.create({
      component: CreatePdfComponent,
      componentProps: {
        page: 1,
      },
    });

    return await modal.present();
  }
}
