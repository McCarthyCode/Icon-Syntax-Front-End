import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from './auth.service';
import { GenericService } from './generic.service';
import { Icon } from './models/icon.model';

@Injectable({
  providedIn: 'root'
})
export class IconsService extends GenericService<
  Icon.IModel,
  Icon.IResponseBody,
  Icon.IResponseBodyList,
  Icon.IClientData,
  Icon.IClientDataList
> {
  constructor(
    private http: HttpClient,
    private authSrv: AuthService,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    super('icons', http, authSrv, modalCtrl);
  }
}
