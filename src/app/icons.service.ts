import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Icon } from './models/icon.model';
import { IPagination } from './models/pagination.interface';

@Injectable({
  providedIn: 'root',
})
export class IconsService {
  list$ = new BehaviorSubject<Icon.IClientDataList>(null);

  constructor(private _http: HttpClient) {}

  list(query?: string, categoryId?: number): Observable<Icon.IClientDataList> {
    let params = {};
    if (categoryId) {
      params = { category: categoryId };
    }
    if (query) {
      params = { ...params, search: query };
    }

    return this._http
      .get<Icon.IResponseBodyList>(environment.apiBase + '/icons', {
        params: params,
      })
      .pipe(
        map((body) => {
          const clientData = {
            ...body,
            retrieved: new Date(),
          };
          this.list$.next(clientData);

          return clientData;
        })
      );
  }

  retrieve(pk: number): Observable<Icon.IClientData> {
    return of(null);
  }
}
