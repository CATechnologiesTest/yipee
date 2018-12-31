import { Component, OnInit, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { NameStringValue } from '../../../../../models/common/Generic';
import { TooltipService } from '../../../../../shared/services/tooltip.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-container-configs',
  templateUrl: './container-configs.component.html',
  styleUrls: ['./container-configs.component.css']
})
export class ContainerConfigsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Input() configOptions: NameStringValue[];
  @Output() addConfigRef: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeConfigRef: EventEmitter<number> = new EventEmitter<number>();

  isComponentExpanded: boolean;

  constructor(public tooltipService: TooltipService) { }

  get config_ref() {
    return (this.form.get('config_ref') as FormArray).controls;
  }

  handleAddConfigRef(): void {
    this.addConfigRef.emit(true);
  }

  handleRemoveConfigRef(index: number): void {
    this.removeConfigRef.emit(index);
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }

}
