import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Icon } from './models/icon.model';

@Injectable({
  providedIn: 'root'
})
export class IconDetailService {
  icon$ = new BehaviorSubject<Icon.IModel>(null);

  click(icon: Icon.IModel): void {
    this.icon$.next(icon);
  }

  refresh(): void {
    this.icon$.next(null);
  }
}
