import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutLiteracyComponent } from '../pdf-list/about-literacy/about-literacy.component';
import { AboutSyntaxComponent } from '../pdf-list/about-syntax/about-syntax.component';
import { AboutUsComponent } from '../pdf-list/about-us/about-us.component';

import { AboutPage } from './about.page';

const routes: Routes = [
  {
    path: '',
    component: AboutPage,
    children: [
      {
        path: '',
        redirectTo: 'us',
      },
      {
        path: 'us',
        component: AboutUsComponent,
      },
      {
        path: 'syntax',
        component: AboutSyntaxComponent,
      },
      {
        path: 'literacy',
        component: AboutLiteracyComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutPageRoutingModule {}
