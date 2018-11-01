import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rightOfForwardSlash'
})
export class RightOfForwardSlashPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.indexOf('/') > -1) {
      const rightSideString = value.split('/')[1];
      return rightSideString;
    } else {
      return value;
    }

  }

}
