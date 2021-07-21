import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Icon } from '../models/icon.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  query = '';
  results$ = new BehaviorSubject<Icon.IClientData[]>([]);

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _location: Location,
    private _http: HttpClient
  ) {}

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      const query: null | string = paramMap.get('query');
      this.query = query === null ? '' : query;
    });
    this.search().subscribe((results) => {
      this.results$.next(results);
    });
  }

  ionViewWillEnter() {
    this.search();
  }

  update(query: null | string): void {
    this.query = query === null ? '' : query;
    if (query) {
      this.search().subscribe((results) => {
        this.results$.next(results);
      });
    }
    this._location.replaceState(`search${query ? '/' + query : ''}`);
  }

  private search(): Observable<Icon.IClientData[]> {
    // const url = environment.APIBase + '/search/' + this.query$.value;
    const url = environment.APIBase + '/search/' + this.query;
    const retrieved = new Date();

    if (!this.query) {
      return of([]);
    }

    return this._http.get<Icon.IResponseBody>(url).pipe(
      map((response) => {
        const results = response.results.map((result: Icon.IResult) => {
          const clientData = {
            ...result,
            retrieved: retrieved,
          };

          return clientData;
        });

        return results;
      })
    );
  }
}
