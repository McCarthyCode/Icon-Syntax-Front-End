import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FindService {
  query$ = new BehaviorSubject<string>('');

  constructor() {}
}
