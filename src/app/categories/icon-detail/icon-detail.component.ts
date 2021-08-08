import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { IconDetailService } from 'src/app/icon-detail.service';
import { Icon } from 'src/app/models/icon.model';

@Component({
  selector: 'app-icon-detail',
  templateUrl: './icon-detail.component.html',
  styleUrls: ['./icon-detail.component.scss'],
})
export class IconDetailComponent implements OnInit {
  icon: Icon.IIcon;

  constructor(
    private _menuCtrl: MenuController,
    private _iconDetailSrv: IconDetailService
  ) {}

  ngOnInit() {
    this._iconDetailSrv.icon$.subscribe((icon) => {
      if (icon) {
        this.icon = icon;
        this._menuCtrl.open('end');
      }
    });
  }
}
