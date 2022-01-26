import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AuthGuard } from './auth.guard';
import { CreateIconComponent } from './create-icon/create-icon.component';
import { ForgotVerifyComponent } from './forgot-verify/forgot-verify.component';
import { ForgotComponent } from './forgot/forgot.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BookshelfComponent } from './bookshelf/bookshelf.component';
import { RegisterComponent } from './register/register.component';
import { RegisterVerifyComponent } from './register/verify/verify.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';
import { UpdateIconComponent } from './update-icon/update-icon.component';
import { DiaryComponent } from './diary/diary.component';
import { CreatePdfComponent } from './create-pdf/create-pdf.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'icons',
    loadChildren: () =>
      import('./icons-page/icons-page.module').then(
        (m) => m.IconsPageModule
      ),
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'register/:access',
    component: RegisterVerifyComponent,
  },
  {
    path: 'bookshelf',
    component: BookshelfComponent,
  },
  {
    path: 'diary',
    component: DiaryComponent,
  },
  {
    path: 'pdf/create',
    component: CreatePdfComponent,
  },
  {
    path: 'category/update/:id',
    component: UpdateCategoryComponent,
    canActivate: [AuthGuard],
    data: { allowAdmin: true },
  },
  {
    path: 'icon/create',
    component: CreateIconComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'icon/update/:id',
    component: UpdateIconComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotComponent,
  },
  {
    path: 'forgot-password/:access',
    component: ForgotVerifyComponent,
  },
  {
    path: '404',
    component: NotFoundComponent,
  },
  { path: '**', pathMatch: 'full', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
