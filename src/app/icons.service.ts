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
  data$ = new BehaviorSubject<Icon.IClientData>(null);
  private _pagination$ = new BehaviorSubject<IPagination>(null);

  constructor(private _http: HttpClient) {}

  search(query: string): Observable<Icon.IClientData> {
    return this._http
      .get<Icon.IResponseBody>(environment.apiBase + '/search/' + query)
      .pipe(
        map((body) => {
          const clientData = {
            ...body,
            retrieved: new Date(),
          };

          this.data$.next(clientData);
          this._pagination$.next(body.pagination);

          return clientData;
        })
      );
  }

  retrieve(pk: number): Observable<Icon.IClientData> {
    return of(null);
  }
}
