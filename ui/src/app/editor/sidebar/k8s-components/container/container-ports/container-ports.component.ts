import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { NameValuePairRaw } from '../../../../../models/YipeeFileRaw';
import { TooltipService } from '../../../../../shared/services/tooltip.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-container-ports',
  templateUrl: './container-ports.component.html',
  styleUrls: ['./container-ports.component.css']
})
export class ContainerPortsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  // importing the whole form but you use ONLY development_config and external_config in this component
  @Input() form: FormGroup;
  @Output() addPortMapping: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removePortMapping: EventEmitter<number> = new EventEmitter<number>();

  isComponentExpanded: boolean;

  protocolOptions: NameValuePairRaw[] = [
    { name: 'TCP', value: 'tcp'},
    { name: 'UDP', value: 'udp'}
  ];

  constructor(public tooltipService: TooltipService) {
  }

  get port_mappings() {
    return (this.form.get('port_mapping') as FormArray).controls;
  }

  handleAddMapping(): void {
    this.addPortMapping.emit(true);
  }

  handleRemoveMapping(index: number): void {
    this.removePortMapping.emit(index);
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }
}
