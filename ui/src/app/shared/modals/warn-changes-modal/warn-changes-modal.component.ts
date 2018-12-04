import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-warn-changes-modal',
  templateUrl: './warn-changes-modal.component.html',
  styleUrls: ['./warn-changes-modal.component.css']
})
export class WarnChangesModalComponent implements OnInit {

  @Input() show: boolean;
  @Output() onClose = new EventEmitter<boolean>();
  @Output() onCancel = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    this.show = false;
  }

  navigateHome() {
    this.onClose.emit(true);
  }

  cancel() {
    this.onCancel.emit(false);
  }

}
