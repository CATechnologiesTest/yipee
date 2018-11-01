import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'k8s-ingress-labels',
  templateUrl: './ingress-labels.component.html',
  styleUrls: ['./ingress-labels.component.css']
})
export class IngressLabelsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Output() addLabel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeLabel: EventEmitter<number> = new EventEmitter<number>();

  isComponentExpanded: boolean;

  constructor() {
  }

  get labels() {
    return (this.form.get('labels') as FormArray).controls;
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
