import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmDeleteModalComponent implements OnInit {

  @Input() show: boolean;
  @Input() objectType: string;
  @Input() objectName: string;
  @Output() onDelete = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
    this.show = false;
  }

  deleteObject() {
    this.onDelete.emit(true);
  }

  cancelDelete() {
    this.onCancel.emit(false);
  }

}
