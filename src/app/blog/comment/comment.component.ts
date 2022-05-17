import { Component, Input } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Post } from 'src/app/models/post.model';
import { PostService } from '../post/post.service';

const maxIndent = 3;

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent {
  @Input() comment: Post.Comment.IModel;
  @Input() indentLevel = 0;

  get updated(): boolean {
    if (this.comment.created && this.comment.updated) {
      const created = new Date(this.comment.created);
      const updated = new Date(this.comment.updated);

      return updated.getTime() - created.getTime() > 1000;
    }
  }
  get indent(): boolean {
    return this.indentLevel < maxIndent;
  }

  replyInput: string;
  replyState = false;

  constructor(
    private _alertCtrl: AlertController,
    private _postSrv: PostService
  ) {}

  toggleReply(): void {
    this.replyState = !this.replyState;
  }

  onReplyChange($event: any): void {
    this.replyInput = $event.detail.value;
  }

  reply(): void {
    if (!this.replyInput) {
      this._alertCtrl
        .create({
          message: 'Please enter a reply before submitting.',
          buttons: ['Okay'],
        })
        .then((alert) => alert.present());

      return;
    }

    this._postSrv
      .comment(this.comment.post, this.replyInput, this.comment.id)
      .subscribe((reply: Post.Comment.IModel) => {
        this.replyInput = '';
        this.replyState = false;
        this.comment.replies = [reply, ...this.comment.replies];

        this._alertCtrl
          .create({
            message: 'Reply posted successfully.',
            buttons: ['Okay'],
          })
          .then((alert) => alert.present());
      });
  }

  edit(): void {
    console.debug('EDIT');
  }

  delete(): void {
    console.debug('DELETE');
  }
}
