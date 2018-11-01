import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { NameStringValue } from '../../../../../models/common/Generic';

@Component({
  selector: 'k8s-ingress-tls',
  templateUrl: './ingress-tls.component.html',
  styleUrls: ['./ingress-tls.component.css']
})
export class IngressTlsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Input() serviceOptions: NameStringValue[];
  @Output() addTLS: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeTLS: EventEmitter<number> = new EventEmitter<number>();

  isComponentExpanded: boolean;

  constructor() {
  }

  get tls() {
    return (this.form.get('tls') as FormArray).controls;
  }

  handleAddTLS() {
    this.addTLS.emit(true);
  }

  handleRemoveTLS(index) {
    this.removeTLS.emit(index);
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }
}
