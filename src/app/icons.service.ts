import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Icon } from './models/icon.model';

@Injectable({
  providedIn: 'root',
})
export class IconsService {
  constructor(private _http: HttpClient) {}

  list(
    query?: string,
    categoryId?: number,
    page: number = 1
  ): Observable<Icon.IClientDataList> {
    let params = {};
    if (categoryId) {
      params = { category: categoryId };
    }
    if (query) {
      params = { ...params, search: query };
    }
    if (page) {
      params = { ...params, page: page };
    }

    return this._http
      .get<Icon.IResponseBodyList>(environment.apiBase + '/icons', {
        params: params,
      })
      .pipe(
        debounceTime(250),
        map((body) => {
          const clientData = {
            ...body,
            retrieved: new Date(),
          };

          return clientData;
        })
      );
  }

  retrieve(pk: number): Observable<Icon.IClientData> {
    return of(null);
  }
}
