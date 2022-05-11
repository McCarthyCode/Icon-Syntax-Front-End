import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { PostService } from './post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent {
  post: Post.IModel;

  constructor(private _route: ActivatedRoute, private _postSrv: PostService) {}

  ionViewWillEnter() {
    this._route.paramMap.subscribe((paramMap) => {
      this._postSrv
        .retrieve(+paramMap.get('id'))
        .subscribe((clientData) => (this.post = clientData.data));
    });
  }
}
