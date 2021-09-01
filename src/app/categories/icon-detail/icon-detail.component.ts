import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AudioPlaybackService } from 'src/app/audio-playback.service';
import { AuthService } from 'src/app/auth.service';
import { CategoriesService } from 'src/app/categories.service';
import { IconDetailService } from 'src/app/icon-detail.service';
import { IWordEntry } from 'src/app/interfaces/word-entry.interface';
import { MerriamWebsterService } from 'src/app/merriam-webster.service';
import { Category } from 'src/app/models/category.model';
import { Icon } from 'src/app/models/icon.model';

@Component({
  selector: 'app-icon-detail',
  templateUrl: './icon-detail.component.html',
  styleUrls: ['./icon-detail.component.scss'],
})
export class IconDetailComponent implements OnInit {
  icon: Icon.IIcon;
  iconSub: Subscription;
  dictSub: Subscription;
  loading = true;
  category: Category.IClientData;

  dictEntries$ = new BehaviorSubject<IWordEntry[]>([]);
  suggestions$ = new BehaviorSubject<string[]>([]);

  constructor(
    private _menuCtrl: MenuController,
    private _iconDetailSrv: IconDetailService,
    private _mwSrv: MerriamWebsterService,
    private _playbackSrv: AudioPlaybackService,
    private _categoriesSrv: CategoriesService,
    private _authSrv: AuthService
  ) {}

  get isAuthenticated(): boolean {
    return Boolean(this._authSrv.credentials$.value);
  }

  ngOnInit() {
    this.iconSub = this._iconDetailSrv.icon$.subscribe((icon) => {
      if (icon) {
        this.icon = icon;
        this._menuCtrl.open('end');

        this._categoriesSrv.retrieve(icon.category).subscribe((category) => {
          this.category = category;

          this.dictSub = this._mwSrv
            .retrieveDict(
              icon.word.replace(/[!@#$%^&*()-=_\+,./<>?~`{}|\\]/g, '')
            )
            .subscribe((data) => {
              if (data.length === 0) {
                this.dictEntries$.next([]);
                this.suggestions$.next([]);
              } else {
                this.dictEntries$.next(
                  typeof data[0] === 'object' ? (data as IWordEntry[]) : []
                );
                this.suggestions$.next(
                  typeof data[0] === 'string' ? (data as string[]) : []
                );
              }

              this.loading = false;
            });
        });
      }
    });
  }

  clickSuggestion(suggestion: string): void {
    this.loading = true;

    this.dictSub = this._mwSrv.retrieveDict(suggestion).subscribe((data) => {
      this.dictEntries$.next(data as IWordEntry[]);
      this.suggestions$.next([]);

      this.loading = false;
    });
  }

  playAudio(
    $event,
    prs: {
      sound?: {
        audio: string;
      };
    }[]
  ) {
    if (prs && prs.length > 0) {
      $event.target.name = 'volume-high';
      for (let pr of prs) {
        if (pr.sound !== undefined && pr.sound.audio !== undefined) {
          this._playbackSrv.play(pr.sound.audio, $event);
          return;
        }
      }
      $event.target.name = 'volume-off';
    } else {
      $event.target.name = 'volume-mute';
    }
  }

  onClose() {
    this._menuCtrl.close('end');
  }
}
