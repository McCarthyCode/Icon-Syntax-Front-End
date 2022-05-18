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

  visible = true;

  replyInput: string;
  editInput: string;

  replyState = false;
  editState = false;

  constructor(
    private _alertCtrl: AlertController,
    private _postSrv: PostService
  ) {}

  resetEditState(): void {
    if (this.editState) {
      this.editInput = '';
      this.editState = false;
    }
  }

  resetReplyState(): void {
    if (this.replyState) {
      this.replyInput = '';
      this.replyState = false;
    }
  }

  toggleEdit(): void {
    this.resetReplyState();
    this.editState = !this.editState;

    if (this.editState) this.editInput = this.comment.content;
  }

  toggleReply(): void {
    this.resetEditState();
    this.replyState = !this.replyState;

    if (this.replyState) this.replyInput = '';
  }

  onEditChange($event: any): void {
    this.editInput = $event.detail.value;
  }

  onReplyChange($event: any): void {
    this.replyInput = $event.detail.value;
  }

  edit(): void {
    console.debug(this.editInput);
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
        this.resetReplyState();
        this.comment.replies = [reply, ...this.comment.replies];

        this._alertCtrl
          .create({
            message: 'Reply posted successfully.',
            buttons: ['Okay'],
          })
          .then((alert) => alert.present());
      });
  }

  delete(): void {
    this._alertCtrl
      .create({
        message:
          'Are you sure you want to delete this comment? This will also remove any replies.',
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Okay',
            handler: () => {
              this._postSrv.deleteComment(this.comment.id).subscribe(() => {
                this.visible = false;
                this._alertCtrl
                  .create({
                    message: 'You have successfully deleted this comment.',
                    buttons: ['Okay'],
                  })
                  .then((alert) => alert.present());
              });
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
}
