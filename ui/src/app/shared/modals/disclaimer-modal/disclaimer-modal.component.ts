import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-disclaimer-modal',
  templateUrl: './disclaimer-modal.component.html',
  styleUrls: ['./disclaimer-modal.component.css']
})
export class DisclaimerModalComponent implements OnInit {

  @Input() show: boolean;
  @Output() onClose = new EventEmitter<boolean>();

  constructor() {
    this.show = false;
  }

  ngOnInit() {
  }

  closeDisclaimer() {
    this.onClose.emit(false);
  }

}
