import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Post } from '../models/post.model';
import { PostModalComponent } from './post/post-modal/post-modal.component';
import { PostService } from './post/post.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  get isAdmin() {
    return this._authSrv.isAdmin;
  }

  posts: Post.IModel[];
  page = 1;
  postsLoaded = false;

  constructor(
    private _authSrv: AuthService,
    private _modalCtrl: ModalController,
    private _postSrv: PostService,
    private _alertCtrl: AlertController
  ) {}

  ionViewWillEnter(): void {
    this.refresh();
  }

  refresh() {
    this.page = 1;
    this.postsLoaded = false;
    this.posts = [];

    this._postSrv.list().subscribe((clientData: Post.IClientDataList) => {
      this.posts = clientData.data;
      this.page = 2;

      if (!clientData.pagination.nextPageExists) {
        this.postsLoaded = true;
      }
    });
  }

  create(): void {
    this._modalCtrl
      .create({
        component: PostModalComponent,
        componentProps: {
          mode: 'create',
          onRefresh: () => {
            this._modalCtrl.dismiss();
            this._alertCtrl
              .create({
                message: 'Blog post submitted successfully.',
                buttons: ['Okay']
              })
              .then((alert) => {
                alert.present();
                this.refresh();
              });
          }
        }
      })
      .then((modal) => modal.present());
  }

  nextPage($event: any): void {
    if (!this.postsLoaded) {
      this._postSrv
        .list({ page: this.page })
        .subscribe((clientData: Post.IClientDataList) => {
          this.posts.push(...clientData.data);
          this.page++;

          $event.target.complete();

          if (!clientData.pagination.nextPageExists) {
            this.postsLoaded = true;
          }
        });
    }
  }
}
