import { Component, Input } from '@angular/core';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-post-tile',
  templateUrl: './post-tile.component.html',
  styleUrls: ['./post-tile.component.scss'],
})
export class PostTileComponent {
  previewMax = 500;
  @Input() post: Post.IModel;
  get updated(): boolean {
    if (this.post.created && this.post.updated) {
      const created = new Date(this.post.created);
      const updated = new Date(this.post.updated);

      return updated.getTime() - created.getTime() > 1000;
    }

    return false;
  }
}
