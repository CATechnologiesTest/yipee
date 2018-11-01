import { Component, OnInit, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-container-advanced',
  templateUrl: './container-advanced.component.html',
  styleUrls: ['./container-advanced.component.css']
})
export class ContainerAdvancedComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;

  isComponentExpanded: boolean;
  imagePullPolicyOptions = [
    { name: 'Always', value: 'Always' },
    { name: 'If Not Present', value: 'IfNotPresent' },
    { name: 'Never', value: 'Never' }
  ];

  constructor() {
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }

}
