import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from './models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private _http: HttpClient) { }

  retrieve(id: number): Observable<Category.IClientData> {
    return this._http
      .get<Category.IResponseBody>(environment.apiBase + '/categories/' + id)
      .pipe(
        debounceTime(250),
        map((body) => {
          const category: Category.IClientData = {
            ...body,
            retrieved: new Date(),
          };

          return category;
        })
      );
  }

  list(): Observable<Category.IClientDataList> {
    return this._http
      .get<Category.IResponseBodyList>(environment.apiBase + '/categories')
      .pipe(
        debounceTime(250),
        map((body) => {
          const clientDataList: Category.IClientDataList = {
            ...body,
            retrieved: new Date(),
          };

          return clientDataList;
        })
      );
  }
}