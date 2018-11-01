import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { NameValuePairRaw } from '../../../../../models/YipeeFileRaw';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-service-container-ports',
  templateUrl: './k8s-service-container-ports.component.html',
  styleUrls: ['./k8s-service-container-ports.component.css']
})
export class K8sServiceContainerPortsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;

  isComponentExpanded: boolean;

  protocolOptions: NameValuePairRaw[] = [
    { name: 'TCP', value: 'tcp' },
    { name: 'UDP', value: 'udp' }
  ];

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  get port_mappings() {
    return (this.form.get('port_mapping') as FormArray).controls;
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
    this.form.controls.port_mapping.valueChanges.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }
}
