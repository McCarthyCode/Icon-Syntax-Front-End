import { HttpClient } from '@angular/common/http';
import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';
import { SearchbarChangeEventDetail } from '@ionic/core/dist/types/components/searchbar/searchbar-interface.d';
import { Icon } from '../../models/icon.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements AfterViewChecked {
  @Input() icons: Icon.IClientData[] = [];
  @Input() query = '';
  @Output() queryEmitter = new EventEmitter<string>();
  @ViewChild('searchbar') searchbar: IonSearchbar;

  constructor(private _route: ActivatedRoute, private _http: HttpClient) {}

  ngAfterViewChecked(): void {
    if (this.query) {
      this.searchbar.setFocus();
    }
  }

  onChange($event: CustomEvent<SearchbarChangeEventDetail>): void {
    const query = $event.detail.value;
    this.query = query;
    this.queryEmitter.emit(query);
  }

  clear(): void {
    this.queryEmitter.emit('');
  }
}
