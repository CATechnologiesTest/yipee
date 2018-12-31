import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { NameValueString } from '../../../../../models/GenericTypes';
import { TooltipService } from '../../../../../shared/services/tooltip.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-container-liveness-probe',
  templateUrl: './container-liveness-probe.component.html',
  styleUrls: ['./container-liveness-probe.component.css']
})
export class ContainerLivenessProbeComponent implements OnInit {
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

  get livenessProbe () { return this.form.get('livenessProbe'); }

  get healthcmds () {
    return (this.form.get('livenessProbe.healthcmd') as FormArray).controls;
  }

  get healthcmdsErrors() {
    return this.form.get('livenessProbe.healthcmd').errors;
  }

  get httpGet () {
    return (this.form.get('livenessProbe.httpGet') as FormGroup);
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
