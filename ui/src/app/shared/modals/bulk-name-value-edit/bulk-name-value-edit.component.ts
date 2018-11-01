import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SeparatorNameValuePair } from '../../../models/GenericTypes';

@Component({
  selector: 'app-bulk-name-value-edit',
  templateUrl: './bulk-name-value-edit.component.html',
  styleUrls: ['./bulk-name-value-edit.component.css']
})
export class BulkNameValueEditComponent implements OnInit {
  @Input() show: boolean;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() body: string;
  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onReplace = new EventEmitter<string[][]>();
  @Output() onAppend = new EventEmitter<string[][]>();
  content: string;

  constructor() { }

  ngOnInit() {
    this.content = '';
  }

  // clear content and trigger the parent to close the modal
  handleCancel(): void {
    this.content = '';
    this.onCancel.emit(false);
  }

  // parse string of name value pairs into array of arrays where index0 is and index1 is value
  parseBulkContent(bulkNameValuePairs: string): string[][] {
    const splitPairArray = [];
    if (bulkNameValuePairs) {
      const nameValuePairArray = bulkNameValuePairs.split(/\n/);
      for (const nameValuePair of nameValuePairArray) {
        splitPairArray.push(new SeparatorNameValuePair('=', nameValuePair).toArray());
      }
    }
    return splitPairArray;
  }

  // emit the replace event with the split array of name value pairs
  handleReplace(): void {
    this.onReplace.emit(this.parseBulkContent(this.content));
    this.content = '';
  }

  // emit the append event with the split array of name value pairs
  handleAppend(): void {
    this.onAppend.emit(this.parseBulkContent(this.content));
    this.content = '';
  }

}
