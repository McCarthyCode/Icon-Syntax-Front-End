import { Component, Input } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { Post } from 'src/app/models/post.model';
import { environment } from 'src/environments/environment';
import { PostService } from '../post/post.service';

const maxIndent = 3;

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input() comment: Post.Comment.IModel;
  @Input() indentLevel = 0;

  get updated(): boolean {
    if (this.comment?.created && this.comment?.updated) {
      const created = new Date(this.comment.created);
      const updated = new Date(this.comment.updated);

      return updated.getTime() - created.getTime() > 1000;
    }

    return false;
  }
  get indent(): boolean {
    return this.indentLevel < maxIndent;
  }

  characterLimit = environment.commentLimit;

  get replyLengthValid(): boolean {
    return this.replyInput && this.replyInput.length <= this.characterLimit;
  }
  get editLengthValid(): boolean {
    return this.editInput && this.editInput.length <= this.characterLimit;
  }

  get isOwner(): boolean {
    return this._authSrv.credentials$.value?.userId === this.comment.owner?.id;
  }
  get isAdmin(): boolean {
    return this._authSrv.credentials$.value?.isAdmin;
  }

  get username(): string {
    return this.comment.owner?.username;
  }

  visible = true;

  replyInput: string;
  editInput: string;

  replyState = false;
  editState = false;

  constructor(
    private _alertCtrl: AlertController,
    private _postSrv: PostService,
    private _authSrv: AuthService
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
    if (!this.editInput || this.editInput === this.comment.content) {
      this._alertCtrl
        .create({
          message: this.editInput
            ? 'Submitting a duplicate edit is not permitted. Please make changes to your comment before hitting "Edit."'
            : 'Your comment cannot be blank. Please enter some text before submitting.',
          buttons: ['Okay']
        })
        .then((alert) => alert.present());

      return;
    }

    this._postSrv
      .updateComment(this.comment.id, this.editInput)
      .subscribe((comment: Post.Comment.IModel) => {
        this.resetEditState();
        const replies = this.comment.replies;
        this.comment = comment;
        this.comment.replies = replies;

        this._alertCtrl
          .create({
            message: 'Comment updated successfully.',
            buttons: ['Okay']
          })
          .then((alert) => alert.present());
      });
  }

  reply(): void {
    if (!this.replyInput) {
      this._alertCtrl
        .create({
          message: 'Please enter a reply before submitting.',
          buttons: ['Okay']
        })
        .then((alert) => alert.present());

      return;
    }

    this._postSrv
      .comment(this.comment.post, this.replyInput, this.comment.id)
      .subscribe((clientData: Post.Comment.IClientData) => {
        const reply = clientData.data;

        this.resetReplyState();
        this.comment.replies = this.comment.replies
          ? [reply, ...this.comment.replies]
          : [reply];

        this._alertCtrl
          .create({
            message: 'Reply posted successfully.',
            buttons: ['Okay']
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
}
