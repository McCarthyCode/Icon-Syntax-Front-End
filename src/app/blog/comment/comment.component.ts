import { Component, Input } from '@angular/core';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent {
  @Input() comment: Post.Comment.IModel;
  get updated(): boolean {
    if (this.comment.created && this.comment.updated) {
      const created = new Date(this.comment.created);
      const updated = new Date(this.comment.updated);

      return updated.getTime() - created.getTime() > 1000;
    }
  }

  constructor() {}
}
