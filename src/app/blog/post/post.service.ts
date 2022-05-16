import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { GenericService } from 'src/app/generic.service';
import { Post } from 'src/app/models/post.model';
import { environment } from 'src/environments/environment';

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
    private http: HttpClient,
    authSrv: AuthService,
    modalCtrl: ModalController
  ) {
    super('blog/posts', http, authSrv, modalCtrl);
  }

  comment(
    post: number,
    content: string,
    parent: number = undefined
  ): Observable<Post.Comment.IModel> {
    const formData = new FormData();

    formData.append('post', String(post));
    formData.append('content', content);
    if (parent) formData.append('parent', String(parent));

    return this.http.post<Post.Comment.IModel>(
      environment.apiBase + 'blog/comments',
      formData
    );
  }
}
