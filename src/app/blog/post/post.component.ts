import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Post } from 'src/app/models/post.model';
import { PostModalComponent } from './post-modal/post-modal.component';
import { PostService } from './post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent {
  post: Post.IModel;
  get updated(): boolean {
    if (this.post.created && this.post.updated) {
      const created = new Date(this.post.created);
      const updated = new Date(this.post.updated);

      return updated.getTime() - created.getTime() > 1000;
    }
  }

  constructor(
    private _route: ActivatedRoute,
    private _postSrv: PostService,
    private _modalCtrl: ModalController,
    private _alertCtrl: AlertController
  ) {}

  ionViewWillEnter() {
    this._route.paramMap.subscribe((paramMap) => {
      this._postSrv
        .retrieve(+paramMap.get('id'))
        .subscribe((clientData) => (this.post = clientData.data));
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
                buttons: ['Okay'],
              })
              .then((alert) => alert.present());
          },
        },
      })
      .then((modal) => modal.present());
  }
}
