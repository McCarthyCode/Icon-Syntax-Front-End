import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { GenericService } from 'src/app/generic.service';
import { Post } from 'src/app/models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService extends GenericService<
  Post.IModel,
  Post.IResponseBody,
  Post.IResponseBodyList,
  Post.IClientData,
  Post.IClientDataList
> {
  constructor(
    http: HttpClient,
    authSrv: AuthService,
    modalCtrl: ModalController
  ) {
    super('blog/posts', http, authSrv, modalCtrl);
  }
}

@Injectable({
  providedIn: 'root',
})
export class CommentService extends GenericService<
  Post.Comment.IModel,
  Post.Comment.IResponseBody,
  Post.Comment.IResponseBodyList,
  Post.Comment.IClientData,
  Post.Comment.IClientDataList
> {
  constructor(
    http: HttpClient,
    authSrv: AuthService,
    modalCtrl: ModalController
  ) {
    super('blog/comments', http, authSrv, modalCtrl);
  }
}
