import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { NameValueString } from '../../../../../models/GenericTypes';
import { TooltipService } from '../../../../../shared/services/tooltip.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-container-readiness-probe',
  templateUrl: './container-readiness-probe.component.html',
  styleUrls: ['./container-readiness-probe.component.css']
})
export class ContainerReadinessProbeComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Output() addHealthCmd: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeHealthCmd: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addHttpHeader: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeHttpHeader: EventEmitter<boolean> = new EventEmitter<boolean>();

  isComponentExpanded: boolean;
  protocolOptions: NameValueString[] = [
    { name: '', value: ''},
    { name: 'Exec', value: 'exec' },
    { name: 'HTTP', value: 'http' }
  ];

  schemeOptions: NameValueString[] = [
    { name: 'HTTP', value: 'HTTP' },
    { name: 'HTTPS', value: 'HTTPS' }
  ];

  constructor(public tooltipService: TooltipService) {
  }

  get readinessProbe () { return this.form.get('readinessProbe'); }

  get healthcmds () {
    return (this.form.get('readinessProbe.healthcmd') as FormArray).controls;
  }

  get healthcmdsErrors() {
    return this.form.get('readinessProbe.healthcmd').errors;
  }

  get httpGet () {
    return (this.form.get('readinessProbe.httpGet') as FormGroup);
  }

  get httpHeaders() {
    return (this.httpGet.get('httpHeaders') as FormArray).controls;
  }

  handleAddHealthCmd() {
    this.addHealthCmd.emit(true);
  }

  handleRemoveHealthCmd(index) {
    this.removeHealthCmd.emit(index);
  }

  handleAddHttpHeader() {
    this.addHttpHeader.emit(true);
  }

  handleRemoveHttpHeader(index) {
    this.removeHttpHeader.emit(index);
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }
}
