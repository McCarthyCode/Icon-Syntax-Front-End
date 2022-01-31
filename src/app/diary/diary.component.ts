import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { CreatePdfComponent } from '../create-pdf/create-pdf.component';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent implements OnInit {
  constructor(
    private _modalController: ModalController,
    private _authSrv: AuthService
  ) {}

  get isAuthenticated(): boolean {
    return this._authSrv.isAuthenticated;
  }

  ngOnInit() {}

  async presentModal() {
    const modal = await this._modalController.create({
      component: CreatePdfComponent,
      componentProps: {
        page: 2,
      },
    });

    return await modal.present();
  }
}
