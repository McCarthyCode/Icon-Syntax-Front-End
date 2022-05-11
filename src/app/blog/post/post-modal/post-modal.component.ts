import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Post } from 'src/app/models/post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.scss'],
})
export class PostModalComponent implements OnInit {
  mode: 'create' | 'update';

  form: FormGroup;

  constructor(
    private _modalCtrl: ModalController,
    private _postSrv: PostService,
    private _alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(80)],
      }),
      content: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    });
  }

  close(): void {
    this._modalCtrl.dismiss();
  }

  submit(): void {
    const formData = new FormData();
    const formValues = this.form.value;

    formData.append('title', formValues.title);
    formData.append('content', formValues.content);

    this._postSrv.create(formData).subscribe(() => {
      this._modalCtrl.dismiss();
      this._alertCtrl
        .create({
          message: 'Blog post submitted successfully.',
          buttons: ['Okay'],
        })
        .then((alert) => alert.present());
    });
  }
}
