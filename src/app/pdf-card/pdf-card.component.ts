import { Component, Input, OnInit } from '@angular/core';
import { PDF } from '../models/pdf.model';

@Component({
  selector: 'app-pdf-card',
  templateUrl: './pdf-card.component.html',
  styleUrls: ['./pdf-card.component.scss'],
})
export class PdfCardComponent implements OnInit {
  @Input() model: PDF.IModel;

  constructor() {}

  ngOnInit() {}
}
