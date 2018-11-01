import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leftOfForwardSlash'
})
export class LeftOfForwardSlashPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.indexOf('/') > -1) {
      const leftSideString = value.split('/')[0];
      return leftSideString;
    } else {
      return null;
    }

  }

}
