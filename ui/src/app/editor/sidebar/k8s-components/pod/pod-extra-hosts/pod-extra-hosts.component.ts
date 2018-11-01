import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-pod-extra-hosts',
  templateUrl: './pod-extra-hosts.component.html',
  styleUrls: ['./pod-extra-hosts.component.css']
})
export class PodExtraHostsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Output() addExtraHost: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeExtraHost: EventEmitter<number> = new EventEmitter<number>();

  isComponentExpanded: boolean;

  constructor() {
  }

  get extra_hosts() {
    return (this.form.get('extra_hosts') as FormArray).controls;
  }

  handleAddExtraHost() {
    this.addExtraHost.emit(true);
  }

  handleRemoveExtraHost(index) {
    this.removeExtraHost.emit(index);
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }
}
