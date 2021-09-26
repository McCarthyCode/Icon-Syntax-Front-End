import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IconDetailService } from '../icon-detail.service';
import { IconsService } from '../icons.service';
import { Category } from '../models/category.model';
import { Icon } from '../models/icon.model';
import { AuthService } from '../auth.service';
import { FindService } from '../find.service';

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.scss'],
})
export class FindComponent implements OnInit {
  // Back-end parameters
  query = '';
  page = 1;

  // DOM Elements
  @ViewChild('library') library: any;

  // Getters/Setters
  get path(): string {
    const path: string = this._findSrv.breadcrumbs
      .filter((category) => Boolean(category))
      .map((category) => category.name)
      .join(' » ');

    return path;
  }

  get category$(): BehaviorSubject<Category.IClientData> {
    return this._findSrv.category$;
  }

  get categories$(): BehaviorSubject<Category.IClientDataList> {
    return this._findSrv.categories$;
  }

  get icons$(): BehaviorSubject<Icon.IClientDataList> {
    return this._findSrv.icons$;
  }

  get loadingCategories(): boolean {
    return this._findSrv.loadingCategories;
  }
  set loadingCategories(value) {
    this._findSrv.loadingCategories = value;
  }

  get loadingIcons(): boolean {
    return this._findSrv.loadingIcons;
  }
  set loadingIcons(value) {
    this._findSrv.loadingIcons = value;
  }

  constructor(
    private _iconsSrv: IconsService,
    private _iconsDetailSrv: IconDetailService,
    private _findSrv: FindService,
    public authSrv: AuthService
  ) {}

  ngOnInit(): void {
    this._findSrv.iconsSub = this._iconsSrv.list().subscribe({
      next: (icons) => {
        this.icons$.next(icons);
        this.loadingIcons = false;
      },
    });
  }

  clickIcon(icon: Icon.IIcon): void {
    this._iconsDetailSrv.click(icon);
  }

  nextPage($event): void {
    if (!this.icons$.value.pagination.nextPageExists) {
      $event.target.complete();
      return;
    }

    this._findSrv.resetIcons(false);

    this.categories$.subscribe(() => {
      const page = this.icons$.value.pagination.thisPageNumber;
      const category = this.category$.value;

      this._findSrv.iconsSub.unsubscribe();
      this._findSrv.iconsSub = this._iconsSrv
        .list(
          this.query ? this.query : undefined,
          category ? category.id : undefined,
          this.page
        )
        .subscribe((icons) => {
          const updated = this.icons$.value;

          if (updated) {
            updated.results.push(...icons.results);
            this.icons$.next(updated);
          } else {
            this.icons$.next(icons);
          }

          $event.target.complete();
          this.loadingIcons = false;
        });
    });
  }
}
