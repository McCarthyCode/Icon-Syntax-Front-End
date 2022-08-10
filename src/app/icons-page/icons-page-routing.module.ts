import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IconsPage } from './icons-page.page';
import { BrowseComponent } from './browse/browse.component';
import { SearchResultsComponent } from './search-results/search-results.component';

const routes: Routes = [
  {
    path: '',
    component: IconsPage,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/icons/browse' },
      { path: 'browse', component: BrowseComponent },
      { path: 'search-results', component: SearchResultsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IconsPageRoutingModule {}
