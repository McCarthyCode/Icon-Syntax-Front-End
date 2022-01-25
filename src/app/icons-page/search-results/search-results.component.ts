import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FindService } from 'src/app/find.service';
import { IconDetailService } from 'src/app/icon-detail.service';
import { IconsService } from 'src/app/icons.service';
import { Category } from 'src/app/models/category.model';
import { Icon } from 'src/app/models/icon.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent {
  // Getters/Setters
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

  get page(): number {
    return this._findSrv.page;
  }

  get emptyQuery(): boolean {
    return this._findSrv.emptyQuery;
  }

  get notFound(): boolean {
    return this._findSrv.notFound;
  }

  get broadenSearch(): boolean {
    return this._findSrv.broadenSearch;
  }

  get categoryId(): number {
    return this._findSrv.categoryId;
  }

  get allIcons(): boolean {
    return this._findSrv.allIcons;
  }

  constructor(
    private _iconsSrv: IconsService,
    private _iconsDetailSrv: IconDetailService,
    private _findSrv: FindService
  ) {}

  clickIcon(icon: Icon.IIcon): void {
    this._iconsDetailSrv.click(icon);
  }

  nextPage($event): void {
    if (!this._iconsSrv.pagination.nextPageExists) {
      $event.target.complete();
      return;
    }

    this._findSrv.resetIcons(false);

    this.categories$.subscribe(() => {
      const page = this._iconsSrv.pagination.thisPageNumber;

      this._findSrv.iconsSub.unsubscribe();
      this._findSrv.iconsSub = this._iconsSrv
        .list({
          search: this._findSrv.query,
          category: this._findSrv.categoryId || 0,
          page: this._findSrv.page + 1,
        })
        .subscribe((icons) => {
          const updated = this.icons$.value;

          if (updated) {
            updated.data.push(...icons.data);
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
