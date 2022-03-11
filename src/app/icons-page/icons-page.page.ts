import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FindService } from '../find.service';

@Component({
  selector: 'app-icons-page',
  templateUrl: './icons-page.page.html',
  styleUrls: ['./icons-page.page.scss'],
})
export class IconsPage {
  get count(): string {
    const formatCash = (n) => {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
      if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
      if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
      if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
    };

    return formatCash(this._findSrv.iconsPagination$.value.totalResults);
  }

  get badgeVisible(): boolean {
    return (
      !this._findSrv.emptyQuery &&
      this._findSrv.iconsPagination$.value?.totalResults > 0
    );
  }

  constructor(private _router: Router, private _findSrv: FindService) {}

  onBrowseClick() {
    if (this._findSrv.browseVisible) this._findSrv.onReset();
  }
}
