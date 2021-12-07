import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from './header/header.component';
import { IconComponent } from '../icon/icon.component';

const components = [HeaderComponent, IconComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule, FormsModule, IonicModule],
  exports: components,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
