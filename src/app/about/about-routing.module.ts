import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutPage } from './about.page';
import { LiteracyComponent } from './literacy/literacy.component';
import { SyntaxComponent } from './syntax/syntax.component';
import { UsComponent } from './us/us.component';

const routes: Routes = [
  {
    path: '',
    component: AboutPage,
    children: [
      {
        path: '',
        redirectTo: 'us'
      },
      {
        path: 'us',
        component: UsComponent
      },
      {
        path: 'syntax',
        component: SyntaxComponent
      },
      {
        path: 'literacy',
        component: LiteracyComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutPageRoutingModule {}
