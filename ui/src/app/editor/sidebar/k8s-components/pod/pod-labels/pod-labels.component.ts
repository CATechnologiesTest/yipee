import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'k8s-pod-labels',
  templateUrl: './pod-labels.component.html',
  styleUrls: ['./pod-labels.component.css']
})
export class PodLabelsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Output() addLabel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeLabel: EventEmitter<number> = new EventEmitter<number>();
  @Output() toggleBulkEdit: EventEmitter<boolean> = new EventEmitter<boolean>();

  isComponentExpanded: boolean;

  constructor() {
  }

  handleOpenBulkEdit(): void {
    this.toggleBulkEdit.emit(true);
  }

  get label() {
    return (this.form.get('label') as FormArray).controls;
  }

  handleAddLabel() {
    this.addLabel.emit(true);
  }

  handleRemoveLabel(index) {
    this.removeLabel.emit(index);
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }
}
