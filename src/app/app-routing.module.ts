import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CreateIconComponent } from './create-icon/create-icon.component';
// import { ForgotVerifyComponent } from './forgot-verify/forgot-verify.component';
// import { ForgotComponent } from './forgot/forgot.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { IconLitComponent } from './pdf-list/icon-lit/icon-lit.component';
// import { RegisterComponent } from './register/register.component';
// import { RegisterVerifyComponent } from './register/verify/verify.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';
import { UpdateIconComponent } from './update-icon/update-icon.component';
import { CreatePdfComponent } from './create-pdf/create-pdf.component';
import { PdfViewComponent } from './pdf-view/pdf-view.component';
import { NotesComponent } from './notes/notes.component';
import { AboutComponent } from './pdf-list/about/about.component';
import { PersonalComponent } from './pdf-list/personal/personal.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { BlogComponent } from './blog/blog.component';
import { PostComponent } from './blog/post/post.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'personal',
    component: PersonalComponent,
  },
  {
    path: 'icons',
    loadChildren: () =>
      import('./icons-page/icons-page.module').then((m) => m.IconsPageModule),
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  // {
  //   path: 'register',
  //   component: RegisterComponent,
  // },
  // {
  //   path: 'register/:access',
  //   component: RegisterVerifyComponent,
  // },
  {
    path: 'icon-lit',
    component: IconLitComponent,
  },
  {
    path: 'notes',
    component: NotesComponent,
  },
  {
    path: 'pdfs/create',
    component: CreatePdfComponent,
  },
  {
    path: 'category/update/:id',
    component: UpdateCategoryComponent,
    canActivate: [AuthGuard],
    data: { allowAdmin: true },
  },
  {
    path: 'icons/create',
    component: CreateIconComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'icons/update/:id',
    component: UpdateIconComponent,
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'forgot-password',
  //   component: ForgotComponent,
  // },
  // {
  //   path: 'forgot-password/:access',
  //   component: ForgotVerifyComponent,
  // },
  {
    path: 'pdfs/:id',
    component: PdfViewComponent,
    loadChildren: () =>
      import('./adobe-viewer/components.module').then(
        (m) => m.ComponentsModule
      ),
  },
  {
    path: 'subscribe',
    component: SubscribeComponent,
  },
  {
    path: 'blog',
    component: BlogComponent,
  },
  {
    path: 'blog/:id',
    component: PostComponent,
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
