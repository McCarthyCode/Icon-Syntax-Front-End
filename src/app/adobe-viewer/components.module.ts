import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InLineComponent } from './in-line/in-line.component';

@NgModule({
  declarations: [InLineComponent],
  imports: [CommonModule],
  exports: [InLineComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
