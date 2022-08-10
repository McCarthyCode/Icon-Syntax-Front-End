import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Post } from 'src/app/models/post.model';
import { environment } from 'src/environments/environment';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.scss']
})
export class PostModalComponent implements OnInit {
  mode: 'create' | 'update';

  @Output() refresh: EventEmitter<Post.IModel> = new EventEmitter();
  @Input() onRefresh: (post: Post.IModel) => void;

  post: Post.IModel;
  form: FormGroup;

  get contentLength(): number {
    return this.form.value.content.length;
  }
  get contentLimit(): number {
    return environment.postLimit;
  }
  get contentValid(): boolean {
    return this.contentLength > 0 && this.contentLength <= this.contentLimit;
  }

  constructor(
    private _modalCtrl: ModalController,
    private _postSrv: PostService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(this.mode === 'create' ? '' : this.post?.title, {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(80)]
      }),
      content: new FormControl(
        this.mode === 'create' ? '' : this.post?.content,
        {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.maxLength(this.contentLimit)
          ]
        }
      )
    });

    this.refresh.subscribe(this.onRefresh);
  }

  close(): void {
    this._modalCtrl.dismiss();
  }

  submit(): void {
    this._modalCtrl.dismiss();

    const formData = new FormData();
    const formValues = this.form.value;

    formData.append('title', formValues.title);
    formData.append('content', formValues.content);

    if (this.mode === 'create') this.create(formData);
    else if (this.mode === 'update') this.update(formData);
  }

  create(formData: FormData): void {
    this._postSrv.create(formData).subscribe((clientData: Post.IClientData) => {
      this.refresh.emit(clientData.data);
    });
  }

  update(formData: FormData): void {
    this._postSrv
      .update(this.post.id, formData)
      .subscribe((clientData: Post.IClientData) => {
        this.refresh.emit(clientData.data);
      });
  }
}
