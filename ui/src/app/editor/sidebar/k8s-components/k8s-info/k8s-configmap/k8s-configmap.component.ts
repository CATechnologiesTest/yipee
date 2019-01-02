import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { TooltipService } from '../../../../../shared/services/tooltip.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-configmap',
  templateUrl: './k8s-configmap.component.html',
  styleUrls: ['./k8s-configmap.component.css']
})
export class K8sConfigmapComponent implements OnInit {

  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Output() addConfigmap: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeConfigmap: EventEmitter<string>  = new EventEmitter<string>();

  isComponentExpanded: boolean;

  constructor(public tooltipService: TooltipService) { }

  get configmaps() {
    return (this.form.get('configs') as FormArray).controls;
  }

  handleAddConfigmap() {
    this.addConfigmap.emit(true);
  }

  handleRemoveConfigmap(configId) {
    this.removeConfigmap.emit(configId);
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }

}
