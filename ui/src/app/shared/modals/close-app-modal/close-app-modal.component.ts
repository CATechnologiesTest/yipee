import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { YipeeFileMetadata } from '../../../models/YipeeFileMetadata';

@Component({
  selector: 'app-close-app-modal',
  templateUrl: './close-app-modal.component.html',
  styleUrls: ['./close-app-modal.component.css']
})
export class CloseAppModalComponent implements OnInit {

  @Input() show: boolean;
  @Input() metadata: YipeeFileMetadata;
  @Output() onIgnore = new EventEmitter<YipeeFileMetadata>();
  @Output() onCancel = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  ignoreChanges() {
    this.onIgnore.emit(this.metadata);
  }

  cancelClose() {
    this.onCancel.emit(false);
  }

}
