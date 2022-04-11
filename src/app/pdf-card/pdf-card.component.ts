import { Component, Input } from '@angular/core';
import { PDF } from '../models/pdf.model';

@Component({
  selector: 'app-pdf-card',
  templateUrl: './pdf-card.component.html',
  styleUrls: ['./pdf-card.component.scss'],
})
export class PdfCardComponent {
  @Input() model: PDF.IModel;
}
