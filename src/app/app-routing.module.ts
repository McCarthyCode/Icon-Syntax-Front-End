import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CategoriesPage } from './categories/categories.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'find',
    pathMatch: 'full',
  },
  {
    path: 'find',
    loadChildren: () => import('./categories/categories.module').then( m => m.CategoriesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
