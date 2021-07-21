import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IonSearchbar } from '@ionic/angular';
import { SearchbarChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
})
export class PromptComponent {
  @Output() queryEmitter = new EventEmitter<string>();
  @ViewChild('searchbar') searchbar: IonSearchbar;
  @Input() query: string;

  constructor() {}

  ngAfterViewChecked(): void {
    if (!this.query) {
      this.searchbar.setFocus();
    }
  }

  onChange($event: CustomEvent<SearchbarChangeEventDetail>): void {
    this.queryEmitter.emit($event.detail.value);
  }
}
