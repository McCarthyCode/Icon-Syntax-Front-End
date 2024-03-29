import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { GenericService } from 'src/app/generic.service';
import { Post } from 'src/app/models/post.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
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
    private authSrv: AuthService,
    private router: Router,
    modalCtrl: ModalController
  ) {
    super('blog/posts', http, authSrv, modalCtrl);
  }

  convertComment(result: Post.Comment.IModel): Post.Comment.IClientData {
    return { data: result, retrieved: new Date() };
  }

  comment(
    post: number,
    content: string,
    parent: number = undefined,
    refresh = true
  ): Observable<Post.Comment.IClientData | HttpErrorResponse> {
    return this.authSrv.authHeader$.pipe(
      switchMap((headers) => {
        if (headers === null) {
          return of(null);
        }

        const formData = new FormData();

        formData.append('post', String(post));
        formData.append('content', content);
        if (parent) formData.append('parent', String(parent));

        return this.http
          .post<Post.Comment.IModel>(
            environment.apiBase + 'blog/comments',
            formData,
            { headers: headers }
          )
          .pipe(
            debounceTime(250),
            map(this.convertComment),
            catchError((response) => {
              if (refresh && response.status === 401)
                return this.authSrv
                  .refresh()
                  .pipe(
                    switchMap(() => this.comment(post, content, parent, false))
                  );

              return of(null);
            })
          );
      })
    );
  }

  comments(post: number, page = 1): Observable<Post.Comment.IClientDataList> {
    return this.http
      .get<Post.Comment.IClientDataList>(
        environment.apiBase + 'blog/comments',
        { params: { post: post, page: page } }
      )
      .pipe(debounceTime(250));
  }

  updateComment(
    commentId: number,
    content: string,
    refresh = true
  ): Observable<Post.Comment.IModel> {
    return this.authSrv.authHeader$.pipe(
      switchMap((headers) => {
        if (headers === null) {
          return of(null);
        }

        const formData = new FormData();

        formData.append('content', content);

        return this.http
          .patch<Post.Comment.IModel>(
            environment.apiBase + 'blog/comments/' + commentId,
            formData,
            { headers: headers }
          )
          .pipe(
            debounceTime(250),
            catchError((response) => {
              if (refresh && response.status === 401)
                return this.authSrv
                  .refresh()
                  .pipe(
                    switchMap(() =>
                      this.updateComment(commentId, content, false)
                    )
                  );

              return of(null);
            })
          );
      })
    );
  }

  deleteComment(comment: number, refresh = true): Observable<null> {
    return this.authSrv.authHeader$.pipe(
      switchMap((headers) => {
        if (headers === null) {
          return of(null);
        }

        return this.http
          .delete<null>(environment.apiBase + 'blog/comments/' + comment, {
            headers: headers
          })
          .pipe(
            debounceTime(250),
            catchError((response) => {
              if (refresh && response.status === 401)
                return this.authSrv
                  .refresh()
                  .pipe(switchMap(() => this.deleteComment(comment, false)));

              return of(null);
            })
          );
      })
    );
  }
}
