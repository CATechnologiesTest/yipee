import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-pod-top-labels',
  templateUrl: './pod-top-labels.component.html',
  styleUrls: ['./pod-top-labels.component.css']
})
export class PodTopLabelsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Output() addTopLabel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeTopLabel: EventEmitter<number> = new EventEmitter<number>();
  @Output() toggleBulkEdit: EventEmitter<boolean> = new EventEmitter<boolean>();


  isComponentExpanded: boolean;

  constructor() { }

  get topLabel() {
    return (this.form.get('top_label') as FormArray).controls;
  }

  handleOpenBulkEdit(): void {
    this.toggleBulkEdit.emit(true);
  }

  handleAddTopLabel() {
    this.addTopLabel.emit(true);
  }

  handleRemoveTopLabel(index) {
    this.removeTopLabel.emit(index);
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }

}
