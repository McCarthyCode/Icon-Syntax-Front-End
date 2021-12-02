import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FindService } from '../find.service';

@Component({
  selector: 'app-icons-page',
  templateUrl: './icons-page.page.html',
  styleUrls: ['./icons-page.page.scss'],
})
export class IconsPage implements OnInit {
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
    return this._findSrv.icons$.value.pagination.totalResults > 0;
  }

  constructor(private _router: Router, private _findSrv: FindService) {}

  ngOnInit(): void {}

  onAllIconsChange($event: Event): void {
    this._findSrv.onAllIconsChange($event['detail']['checked']);
  }

  onSearchbarChange($event: Event): void {
    this._findSrv.onSearchbar($event['detail']['value']);
  }
}
