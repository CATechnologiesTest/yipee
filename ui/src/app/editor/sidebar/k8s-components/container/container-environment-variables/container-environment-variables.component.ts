import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { TooltipService } from '../../../../../shared/services/tooltip.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-container-environment-variables',
  templateUrl: './container-environment-variables.component.html',
  styleUrls: ['./container-environment-variables.component.css']
})
export class ContainerEnvironmentVariablesComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Output() addEnvironmentVar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeEnvironmentVar: EventEmitter<number> = new EventEmitter<number>();
  @Output() addConfigMapRef: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeConfigMapRef: EventEmitter<number> = new EventEmitter<number>();
  @Output() addEnvSecretRef: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeEnvSecretRef: EventEmitter<number> = new EventEmitter<number>();

  @Output() addFieldRef: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeFieldRef: EventEmitter<number> = new EventEmitter<number>();
  @Output() addResourceFieldRef: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeResourceFieldRef: EventEmitter<number> = new EventEmitter<number>();

  @Output() toggleBulkEdit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() toggleSortKey: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() toggleSortValue: EventEmitter<boolean> = new EventEmitter<boolean>();

  isComponentExpanded: boolean;
  isKeySortedAscending: boolean;
  isValueSortedAscending: boolean;

  fieldRefOptions = [
    { name: 'Annotations', value: 'metadata.annotations' },
    { name: 'Host IP', value: 'status.hostIP' },
    { name: 'Labels', value: 'metadata.labels' },
    { name: 'Name', value: 'metadata.name' },
    { name: 'Namespace', value: 'metadata.namespace' },
    { name: 'Node Name', value: 'spec.nodeName' },
    { name: 'Pod IP', value: 'status.podIP' },
    { name: 'Service Account Name', value: 'spec.serviceAccountName' }
  ];

  resourceFieldRefOptions = [
    { name: 'Limits CPU', value: 'limits.cpu' },
    { name: 'Limits Ephemeral Storage', value: 'limits.ephemeral-storage' },
    { name: 'Limits Memory', value: 'limits.memory' },
    { name: 'Requests CPU', value: 'requests.cpu' },
    { name: 'Requests Ephemeral Storage', value: 'requests.ephemeral-storage' },
    { name: 'Requests Memory', value: 'requests.memory' }
  ];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public tooltipService: TooltipService
    ) { }

  get environment_var() {
    return (this.form.get('environment_var') as FormArray).controls;
  }

  get config_map_ref() {
    return (this.form.get('config_map_ref') as FormArray).controls;
  }

  get env_secret_ref() {
    return (this.form.get('env_secret_ref') as FormArray).controls;
  }

  get env_field_ref() {
    return (this.form.get('env_field_ref') as FormArray).controls;
  }

  get env_resource_field_ref() {
    return (this.form.get('env_resource_field_ref') as FormArray).controls;
  }

  handleAddEnvironmentVar(): void {
    this.addEnvironmentVar.emit(true);
  }

  handleRemoveEnvironmentVar(index: number): void {
    this.removeEnvironmentVar.emit(index);
  }

  handleOpenBulkEdit(): void {
    this.toggleBulkEdit.emit(true);
  }

  handleToggleSortKey(): void {
    this.isKeySortedAscending ? this.isKeySortedAscending = !this.isKeySortedAscending : this.isKeySortedAscending = true;
    this.toggleSortKey.emit(this.isKeySortedAscending);
  }

  handleToggleSortValue(): void {
    this.isValueSortedAscending ? this.isValueSortedAscending = !this.isValueSortedAscending : this.isValueSortedAscending = true;
    this.toggleSortValue.emit(this.isValueSortedAscending);
  }

  handleAddConfigMapRef(): void {
    this.addConfigMapRef.emit(true);
  }

  handleRemoveConfigMapRef(index: number): void {
    this.removeConfigMapRef.emit(index);
  }

  handleAddEnvSecretRef(): void {
    this.addEnvSecretRef.emit(true);
  }

  handleRemoveEnvSecretRef(index: number): void {
    this.removeEnvSecretRef.emit(index);
  }

  handleAddFieldRef(): void {
    this.addFieldRef.emit(true);
  }

  handleRemoveFieldRef(index: number): void {
    this.removeFieldRef.emit(index);
  }

  handleAddResourceFieldRef(): void {
    this.addResourceFieldRef.emit(true);
  }

  handleRemoveResourceFieldRef(index: number): void {
    this.removeResourceFieldRef.emit(index);
  }

  ngOnInit() {
    const envVarArray = this.form.get('environment_var') as FormArray;
    envVarArray.valueChanges.subscribe((newVal) => {
      this.changeDetectorRef.markForCheck();
    });
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }
}
