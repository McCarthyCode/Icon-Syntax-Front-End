import { Component, Input, OnInit } from '@angular/core';
import { Icon } from '../models/icon.model';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() icon: Icon.IIcon;

  constructor() {}
}
