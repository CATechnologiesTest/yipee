import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { NameValuePairRaw } from '../../../../../models/YipeeFileRaw';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-service-service-ports',
  templateUrl: './k8s-service-service-ports.component.html',
  styleUrls: ['./k8s-service-service-ports.component.css']
})
export class K8sServiceServicePortsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  // importing the whole form but you use ONLY development_config and external_config in this component
  @Input() form: FormGroup;
  @Output() addServicePortMapping: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeServicePortMapping: EventEmitter<number> = new EventEmitter<number>();

  isComponentExpanded: boolean;

  protocolOptions: NameValuePairRaw[] = [
    { name: 'TCP', value: 'tcp'},
    { name: 'UDP', value: 'udp'}
  ];

  constructor() {
  }

  get service_port_mappings() {
    return (this.form.get('service_port_mapping') as FormArray).controls;
  }

  handleAddMapping(): void {
    this.addServicePortMapping.emit(true);
  }

  handleRemoveMapping(index: number): void {
    this.removeServicePortMapping.emit(index);
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }
}
