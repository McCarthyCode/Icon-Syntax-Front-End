import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IconsPageRoutingModule } from './icons-page-routing.module';

import { ComponentsModule } from './components.module';

import {
  BrowseComponent,
  CategoryNodeComponent,
} from './browse/browse.component';
import { SearchResultsComponent } from './search-results/search-results.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [
    BrowseComponent,
    SearchResultsComponent,
    CategoryNodeComponent,
  ],
})
export class IconsPageModule {}
