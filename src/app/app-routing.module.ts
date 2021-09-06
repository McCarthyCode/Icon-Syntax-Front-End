import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AuthGuard } from './auth.guard';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { CreateIconComponent } from './create-icon/create-icon.component';
import { FindComponent } from './find/find.component';
import { ForgotVerifyComponent } from './forgot-verify/forgot-verify.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterVerifyComponent } from './register/verify/verify.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';
import { UpdateIconComponent } from './update-icon/update-icon.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'find',
    pathMatch: 'full',
  },
  {
    path: 'find',
    component: FindComponent,
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
    path: 'category/create',
    component: CreateCategoryComponent,
    canActivate: [AuthGuard],
    data: { allowAdmin: true },
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
