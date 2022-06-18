import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { Post } from 'src/app/models/post.model';
import { environment } from 'src/environments/environment';
import { PostModalComponent } from './post-modal/post-modal.component';
import { PostService } from './post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  post: Post.IModel;
  comments: Post.Comment.IModel[] = [];
  commentsLoaded = false;

  commentInput = '';
  commentPage = 1;

  get updated(): boolean {
    if (this.post.created && this.post.updated) {
      const created = new Date(this.post.created);
      const updated = new Date(this.post.updated);

      return updated.getTime() - created.getTime() > 1000;
    }
  }
  get isAuthenticated(): boolean {
    return this._authSrv.isAuthenticated;
  }
  get isAdmin(): boolean {
    return this._authSrv.isAdmin;
  }

  characterLimit = environment.commentLimit;

  get commentLengthValid(): boolean {
    return this.commentInput && this.commentInput.length <= this.characterLimit;
  }

  constructor(
    private _route: ActivatedRoute,
    private _postSrv: PostService,
    private _modalCtrl: ModalController,
    private _alertCtrl: AlertController,
    private _router: Router,
    private _authSrv: AuthService
  ) {}

  ionViewWillEnter() {
    this.refresh();
  }

  refresh() {
    this.post = undefined;
    this.comments = [];

    this.commentsLoaded = false;
    this.commentPage = 1;

    this._route.paramMap.subscribe((paramMap) => {
      this._postSrv.retrieve(+paramMap.get('id')).subscribe((clientData) => {
        this.post = clientData.data;
        this.firstPage();
      });
    });
  }

  update(): void {
    this._modalCtrl
      .create({
        component: PostModalComponent,
        componentProps: {
          mode: 'update',
          post: this.post,
          onRefresh: (post: Post.IModel) => {
            this.post = post;
            this._alertCtrl
              .create({
                message: 'The blog post was updated successfully.',
                buttons: ['Okay']
              })
              .then((alert) => alert.present());
          }
        }
      })
      .then((modal) => modal.present());
  }

  delete(): void {
    this._alertCtrl
      .create({
        message:
          'Are you sure you want to delete the blog post titled "' +
          this.post.title +
          '"?',
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Okay',
            handler: () => {
              this._postSrv.delete(this.post.id).subscribe(() => {
                this._router.navigateByUrl('/blog');
                this._alertCtrl
                  .create({
                    message: 'The blog post was deleted successfully.',
                    buttons: ['Okay']
                  })
                  .then((alert) => alert.present());
              });
            }
          }
        ]
      })
      .then((alert) => alert.present());
  }

  onCommentChange($event: any): void {
    this.commentInput = $event.detail.value;
  }

  comment(): void {
    if (!this.commentInput) {
      this._alertCtrl
        .create({
          message: 'Please enter a comment before submitting.',
          buttons: ['Okay']
        })
        .then((alert) => alert.present());

      return;
    }

    this._postSrv.comment(this.post.id, this.commentInput).subscribe(
      (clientData: Post.Comment.IClientData) => {
        const comment = clientData.data;

        this.commentInput = '';
        this.comments = [comment, ...this.comments];
        this._alertCtrl
          .create({
            message: 'Comment posted successfully.',
            buttons: ['Okay']
          })
          .then((alert) => alert.present());
      },
      (response) => {
        if (response.status === 401)
          this._alertCtrl
            .create(
              this.isAuthenticated
                ? {
                    message: 'You must verify your email to post a comment.',
                    buttons: [{ text: 'Okay', role: 'dismiss' }]
                  }
                : {
                    message:
                      'You must login and verify your email to post a comment.',
                    buttons: [
                      { text: 'Cancel', role: 'dismiss' },
                      {
                        text: 'Okay',
                        handler: () => {
                          this._router.navigate(['/login'], {
                            queryParams: {
                              redirect: `%2Fblog%2F${this.post.id}`
                            }
                          });
                        }
                      }
                    ]
                  }
            )
            .then((alert) => alert.present());
      }
    );
  }

  firstPage(): void {
    if (this.post && !this.commentsLoaded) {
      this._postSrv
        .comments(this.post.id)
        .subscribe((clientData: Post.Comment.IClientDataList) => {
          this.comments.push(...clientData.data);
          this.commentPage = 2;

          if (!clientData.pagination.nextPageExists) {
            this.commentsLoaded = true;
          }
        });
    }
  }

  nextPage($event: any): void {
    if (this.post && !this.commentsLoaded) {
      this._postSrv
        .comments(this.post.id, this.commentPage)
        .subscribe((clientData: Post.Comment.IClientDataList) => {
          this.comments.push(...clientData.data);
          this.commentPage++;

          $event.target.complete();

          if (!clientData.pagination.nextPageExists) {
            this.commentsLoaded = true;
          }
        });
    }
  }
}
