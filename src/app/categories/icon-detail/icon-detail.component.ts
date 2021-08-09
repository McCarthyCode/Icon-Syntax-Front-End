import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IconDetailService } from 'src/app/icon-detail.service';
import { IWordEntry } from 'src/app/interfaces/word-entry.interface';
import { MerriamWebsterService } from 'src/app/merriam-webster.service';
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

  dictEntries$ = new BehaviorSubject<IWordEntry[]>([]);
  suggestions$ = new BehaviorSubject<string[]>([]);

  constructor(
    private _menuCtrl: MenuController,
    private _iconDetailSrv: IconDetailService,
    private _mwSrv: MerriamWebsterService
  ) {}

  ngOnInit() {
    this.iconSub = this._iconDetailSrv.icon$.subscribe((icon) => {
      if (icon) {
        this.icon = icon;
        this._menuCtrl.open('end');

        this.dictSub = this._mwSrv.retrieveDict(icon.word).subscribe((data) => {
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
}
