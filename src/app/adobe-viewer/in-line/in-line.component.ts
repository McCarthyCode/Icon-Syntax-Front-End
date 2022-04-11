/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe.

Edited 2022
Matt McCarthy
*/

import { Component, AfterViewInit, Input } from '@angular/core';
import { PDF } from 'src/app/models/pdf.model';
import { ViewSDKClient } from '../view-sdk.service';

@Component({
  selector: 'pdf-in-line',
  templateUrl: './in-line.component.html',
  styleUrls: ['./in-line.component.scss'],
})
export class InLineComponent implements AfterViewInit {
  @Input() pdf: PDF.IModel;

  constructor(private viewSDKClient: ViewSDKClient) {}

  ngAfterViewInit(): void {
    this.viewSDKClient.ready().then(() => {
      /* Invoke file preview */
      this.viewSDKClient.previewFile(this.pdf, {
        /* Pass the embed mode option here */
        embedMode: 'IN_LINE',
      });
    });
  }
}
