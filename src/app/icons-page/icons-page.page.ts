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

  constructor(private _router: Router, private _findSrv: FindService) {}

  ngOnInit(): void {}

  onAllIconsChange($event: Event): void {
    this._findSrv.onAllIconsChange($event['detail']['checked']);
  }

  onSearchbarChange($event: Event): void {
    this._findSrv.onSearchbar($event['detail']['value']);
  }
}
