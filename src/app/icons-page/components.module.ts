import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';


@NgModule({
    declarations: [IconComponent], // Import all component here
    imports: [CommonModule, FormsModule, IonicModule],
    exports: [IconComponent], // Import all component here
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }