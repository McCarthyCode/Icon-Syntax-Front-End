import { Component, ElementRef, ViewChild } from '@angular/core';
import { FindService } from 'src/app/find.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  get path(): string {
    return [
      'Library',
      this._findSrv.browseVisible
        ? 'Browse Library'
        : this._findSrv.searchResultsVisible
        ? 'Search Results'
        : ''
    ].join(' » ');
  }
  get breadcrumbs(): string {
    if (!this._findSrv.allIcons && this._findSrv.breadcrumbs) {
      return this._findSrv.breadcrumbs;
    }

    return 'All Icons';
  }

  get allIcons(): boolean {
    return this._findSrv.allIcons;
  }

  get query(): string {
    return this._findSrv.query;
  }

  constructor(private _findSrv: FindService) {}

  onSearchbarChange($event: Event): void {
    this._findSrv.onSearchbar($event['detail']['value']);
  }

  onAllIconsChange($event: Event): void {
    this._findSrv.onAllIconsChange($event['detail']['checked']);
  }
}
