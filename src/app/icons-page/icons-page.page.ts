import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private _router: Router) {}

  ngOnInit() {}
}
