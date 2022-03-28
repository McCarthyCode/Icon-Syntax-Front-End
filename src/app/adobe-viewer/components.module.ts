import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InLineComponent } from './in-line/in-line.component';
import { SizedContainerComponent } from './sized-container/sized-container.component';

const components = [InLineComponent, SizedContainerComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule],
  exports: components,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
