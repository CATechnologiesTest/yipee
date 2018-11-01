import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { NameStringValue } from '../../../../../models/common/Generic';
import { Ingress } from '../../../../../models/k8s/Ingress';


@Component({
  selector: 'k8s-ingress-backend',
  templateUrl: './ingress-backend.component.html',
  styleUrls: ['./ingress-backend.component.css']
})
export class IngressBackendComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Input() serviceOptions: NameStringValue[];
  @Input() ingress: Ingress;

  isComponentExpanded: boolean;

  constructor() {
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;

    this.ingress.onServiceMapChange.subscribe(() => {
      if (this.ingress.backend.service_id === null) {
        this.form.get('backend_service_id').setValue('-- Select a service --');
      }
    });
  }
}
