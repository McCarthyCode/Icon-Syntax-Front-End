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

  get page(): number {
    return this._findSrv.page;
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
          this._findSrv.query,
          this._findSrv.categoryId,
          this._findSrv.page + 1
        )
        .subscribe((icons) => {
          const updated = this.icons$.value;

          if (updated) {
            updated.results.push(...icons.results);
            updated.pagination = icons.pagination;
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
