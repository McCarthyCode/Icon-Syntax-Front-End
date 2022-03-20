import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutPageRoutingModule } from './about-routing.module';

import { AboutPage } from './about.page';
import { ComponentsModule } from '../icons-page/components.module';
import { UsComponent } from './us/us.component';
import { LiteracyComponent } from './literacy/literacy.component';
import { SyntaxComponent } from './syntax/syntax.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AboutPageRoutingModule,
  ],
  declarations: [AboutPage, UsComponent, LiteracyComponent, SyntaxComponent],
})
export class AboutPageModule {}
