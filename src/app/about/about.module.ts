import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutPageRoutingModule } from './about-routing.module';

import { AboutPage } from './about.page';
import { ComponentsModule } from '../icons-page/components.module';
import { AboutUsComponent } from '../pdf-list/about-us/about-us.component';
import { AboutLiteracyComponent } from '../pdf-list/about-literacy/about-literacy.component';
import { AboutSyntaxComponent } from '../pdf-list/about-syntax/about-syntax.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AboutPageRoutingModule,
  ],
  declarations: [
    AboutPage,
    AboutUsComponent,
    AboutLiteracyComponent,
    AboutSyntaxComponent,
  ],
})
export class AboutPageModule {}
