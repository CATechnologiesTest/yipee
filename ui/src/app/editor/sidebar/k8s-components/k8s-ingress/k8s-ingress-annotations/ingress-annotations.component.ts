import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'k8s-ingress-annotations',
  templateUrl: './ingress-annotations.component.html',
  styleUrls: ['./ingress-annotations.component.css']
})
export class IngressAnnotationsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Output() addAnnotation: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeAnnotation: EventEmitter<number> = new EventEmitter<number>();

  isComponentExpanded: boolean;

  constructor() {
  }

  get annotations() {
    return (this.form.get('annotations') as FormArray).controls;
  }

  handleAddAnnotation() {
    this.addAnnotation.emit(true);
  }

  handleRemoveAnnotation(index) {
    this.removeAnnotation.emit(index);
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }
}
