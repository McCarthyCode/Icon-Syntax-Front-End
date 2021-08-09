import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IWordEntry } from './interfaces/word-entry.interface';

@Injectable({
  providedIn: 'root',
})
export class MerriamWebsterService {
  constructor(private _http: HttpClient) {}

  retrieveDict(word: string): Observable<Array<IWordEntry | string>> {
    return this._http.get<any>(
      'https://dictionaryapi.com/api/v3/references/collegiate/json/' +
        `${encodeURI(word)}?key=${environment.apiKeys.mwDict}`
    );
  }

  retrieveThes(word: string): Observable<Array<IWordEntry | string>> {
    return this._http.get<any>(
      'https://dictionaryapi.com/api/v3/references/thesaurus/json/' +
        `${encodeURI(word)}?key=${environment.apiKeys.mwThes}`
    );
  }
}
