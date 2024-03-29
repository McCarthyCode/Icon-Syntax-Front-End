/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe.

Edited 2022
*/

import { Injectable } from '@angular/core';
import { PDF } from 'src/app/models/pdf.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ViewSDKClient {
  readyPromise: Promise<void> = new Promise((resolve) => {
    if (window.AdobeDC) {
      resolve();
    } else {
      /* Wait for Adobe Document Services PDF Embed API to be ready */
      document.addEventListener('adobe_dc_view_sdk.ready', () => {
        resolve();
      });
    }
  });
  adobeDCView: any;

  ready() {
    return this.readyPromise;
  }

  previewFile(
    pdf: PDF.IModel,
    viewerConfig: any,
    divId: string = 'pdf-div',
    parentDivId: string = 'pdf-parent-div'
  ) {
    const config: any = {
      /* Pass your registered client id */
      clientId: environment.apiKeys.adobe,
    };
    if (divId) {
      /* Optional only for Light Box embed mode */
      /* Pass the div id in which PDF should be rendered */
      config.divId = divId;
    }
    if (parentDivId) {
      /* Optional only for Light Box embed mode */
      /* Pass the parent id of the PDF container div */
      config.parentDivId = parentDivId;
    }
    /* Initialize the AdobeDC View object */
    this.adobeDCView = new window.AdobeDC.View(config);

    /* Invoke the file preview API on Adobe DC View object */
    const previewFilePromise = this.adobeDCView.previewFile(
      {
        /* Pass information on how to access the file */
        content: {
          /* Location of file where it is hosted */
          location: {
            url: environment.urlRoot + pdf.pdf,
            /*
            If the file URL requires some additional headers, then it can be passed as follows:-
            */
            // headers: [
            //   {
            //     key: '<HEADER_KEY>',
            //     value: '<HEADER_VALUE>',
            //   },
            // ],
          },
        },
        /* Pass meta data of file */
        metaData: {
          /* file name */
          fileName: `${pdf.title}.pdf`,
          /* file ID */
          id: pdf.md5,
        },
      },
      viewerConfig
    );

    return previewFilePromise;
  }

  // previewFileUsingFilePromise(
  //   divId: string,
  //   filePromise: Promise<string | ArrayBuffer>,
  //   fileName: any
  // ) {
  //   /* Initialize the AdobeDC View object */
  //   this.adobeDCView = new window.AdobeDC.View({
  //     /* Pass your registered client id */
  //     clientId: '8c0cd670273d451cbc9b351b11d22318',
  //     /* Pass the div id in which PDF should be rendered */
  //     divId,
  //   });

  //   /* Invoke the file preview API on Adobe DC View object */
  //   this.adobeDCView.previewFile(
  //     {
  //       /* Pass information on how to access the file */
  //       content: {
  //         /* pass file promise which resolve to arrayBuffer */
  //         promise: filePromise,
  //       },
  //       /* Pass meta data of file */
  //       metaData: {
  //         /* file name */
  //         fileName,
  //       },
  //     },
  //     {}
  //   );
  // }

  // registerSaveApiHandler() {
  //   /* Define Save API Handler */
  //   const saveApiHandler = (metaData: any, content: any, options: any) => {
  //     console.log(metaData, content, options);
  //     return new Promise((resolve) => {
  //       /* Dummy implementation of Save API, replace with your business logic */
  //       setTimeout(() => {
  //         const response = {
  //           code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
  //           data: {
  //             metaData: Object.assign(metaData, {
  //               updatedAt: new Date().getTime(),
  //             }),
  //           },
  //         };
  //         resolve(response);
  //       }, 2000);
  //     });
  //   };

  //   this.adobeDCView.registerCallback(
  //     window.AdobeDC.View.Enum.CallbackType.SAVE_API,
  //     saveApiHandler,
  //     {}
  //   );
  // }

  // registerEventsHandler() {
  //   /* Register the callback to receive the events */
  //   this.adobeDCView.registerCallback(
  //     /* Type of call back */
  //     window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
  //     /* call back function */
  //     (event: any) => {
  //       console.log(event);
  //     },
  //     /* options to control the callback execution */
  //     {
  //       /* Enable PDF analytics events on user interaction. */
  //       enablePDFAnalytics: true,
  //     }
  //   );
  // }
}
