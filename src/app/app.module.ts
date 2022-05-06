import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ComponentsModule as IconsModule} from './icons-page/components.module';
import { ComponentsModule as AdobeViewerModule } from './adobe-viewer/components.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { CategoryModalComponent } from './category-modal/category-modal.component';
import { CreateIconComponent } from './create-icon/create-icon.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ForgotVerifyComponent } from './forgot-verify/forgot-verify.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { IconDetailComponent } from './icon-detail/icon-detail.component';
import { IconModalComponent } from './icon-modal/icon-modal.component';
import { IconsPage } from './icons-page/icons-page.page';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { RegisterVerifyComponent } from './register/verify/verify.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';
import { UpdateIconComponent } from './update-icon/update-icon.component';
import { CreatePdfComponent } from './create-pdf/create-pdf.component';
import { PdfCardComponent } from './pdf-card/pdf-card.component';
import { PdfViewComponent } from './pdf-view/pdf-view.component';
import { IconLitComponent } from './pdf-list/icon-lit/icon-lit.component';
import { PdfEditComponent } from './pdf-edit/pdf-edit.component';
import { NotesComponent } from './notes/notes.component';
import { EditPdfCategoriesComponent } from './edit-pdf-categories/edit-pdf-categories.component';
import { PersonalComponent } from './pdf-list/personal/personal.component';
import { AboutComponent } from './pdf-list/about/about.component';
import { SubscribeComponent } from './subscribe/subscribe.component';

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    CategoryModalComponent,
    CreateIconComponent,
    CreatePdfComponent,
    EditPdfCategoriesComponent,
    ForgotComponent,
    ForgotVerifyComponent,
    HomeComponent,
    IconDetailComponent,
    IconLitComponent,
    IconModalComponent,
    IconsPage,
    LoginComponent,
    NotesComponent,
    NotFoundComponent,
    PersonalComponent,
    PdfCardComponent,
    PdfEditComponent,
    PdfViewComponent,
    RegisterComponent,
    RegisterVerifyComponent,
    SubscribeComponent,
    UpdateCategoryComponent,
    UpdateIconComponent,
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
    IconsModule,
    AdobeViewerModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
