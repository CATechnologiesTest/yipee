import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-env-bulk-add-modal',
  templateUrl: './env-bulk-add-modal.component.html',
  styleUrls: ['./env-bulk-add-modal.component.css']
})
export class EnvBulkAddModalComponent implements OnInit, OnChanges {

  @Input() show: boolean;
  @Input() content: string;
  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onReplace = new EventEmitter<string>();
  @Output() onAppend = new EventEmitter<string>();

  oldContent: string;

  constructor() { }

  ngOnInit() {
    this.oldContent = this.content;
  }

  ngOnChanges() {
    this.oldContent = this.content;
  }

  handleCancel(): void {
    this.onCancel.emit(false);
    this.content = this.oldContent;
  }

  handleReplace(): void {
    this.onReplace.emit(this.content);
    this.oldContent = this.content;
  }

  handleAppend(): void {
    this.onAppend.emit(this.content);
    this.oldContent = this.content;
  }

}
