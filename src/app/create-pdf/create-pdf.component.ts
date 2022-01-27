import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-pdf',
  templateUrl: './create-pdf.component.html',
  styleUrls: ['./create-pdf.component.scss'],
})
export class CreatePdfComponent implements OnInit {
  @Input() page: number;

  constructor(private _modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this._modalController.dismiss();
  }

  submit() {
    console.log(this.page);
  }
}
