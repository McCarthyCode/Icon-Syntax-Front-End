import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { CategoryModalComponent } from './category-modal/category-modal.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';
import { CreateIconComponent } from './create-icon/create-icon.component';
import { IconModalComponent } from './icon-modal/icon-modal.component';
import { UpdateIconComponent } from './update-icon/update-icon.component';
import { FindComponent } from './find/find.component';
import { IconDetailComponent } from './find/icon-detail/icon-detail.component';
import { IconComponent } from './icon/icon.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ForgotVerifyComponent } from './forgot-verify/forgot-verify.component';
import { RegisterVerifyComponent } from './register/verify/verify.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    LoginComponent,
    RegisterComponent,
    RegisterVerifyComponent,
    ForgotComponent,
    ForgotVerifyComponent,
    FindComponent,
    IconDetailComponent,
    CreateCategoryComponent,
    UpdateCategoryComponent,
    CategoryModalComponent,
    CreateIconComponent,
    UpdateIconComponent,
    IconModalComponent,
    IconComponent,
    NotFoundComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
