import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FindService } from '../find.service';

@Component({
  selector: 'app-icons-page',
  templateUrl: './icons-page.page.html',
  styleUrls: ['./icons-page.page.scss'],
})
export class IconsPage {
  get browseVisible(): boolean {
    return this._router.url === '/icons/browse';
  }

  get searchResultsVisible(): boolean {
    return this._router.url === '/icons/search-results';
  }

  get allIcons(): boolean {
    return this._findSrv.allIcons;
  }
  set allIcons(checked: boolean) {
    this._findSrv.allIcons = checked;
  }

  get path(): string {
    return this._findSrv.categoryId === undefined ? '' : this._findSrv.path;
  }

  get breadcrumbs(): string {
    let breadcrumbs = [
      'Find Icons',
      this.browseVisible
        ? 'Browse Library'
        : this.searchResultsVisible
        ? 'Search Results'
        : '',
    ].join(' » ');

    if (!this.allIcons && this.path) {
      breadcrumbs = [breadcrumbs, this.path].filter(Boolean).join('<br />');
    }

    return breadcrumbs;
  }

  get count(): string {
    const formatCash = (n) => {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
      if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
      if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
      if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
    };

    return formatCash(this._findSrv.icons$.value.pagination.totalResults);
  }

  get badgeVisible(): boolean {
    return (
      !this._findSrv.emptyQuery &&
      this._findSrv.icons$.value.pagination.totalResults > 0
    );
  }

  constructor(private _router: Router, private _findSrv: FindService) {}

  onAllIconsChange($event: Event): void {
    this._findSrv.onAllIconsChange($event['detail']['checked']);
  }

  onSearchbarChange($event: Event): void {
    this._findSrv.onSearchbar($event['detail']['value']);
  }

  onBrowseClick() {
    if (this.browseVisible) this._findSrv.onCollapseAll();
  }
}
