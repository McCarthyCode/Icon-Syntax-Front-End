import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linebreaks',
})
export class LineBreaksPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\n/g, '<br/>');
  }
}
