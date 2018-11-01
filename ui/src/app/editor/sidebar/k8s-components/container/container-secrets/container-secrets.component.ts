import { Component, OnInit, EventEmitter, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { NameStringValue } from '../../../../../models/common/Generic';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-container-secrets',
  templateUrl: './container-secrets.component.html',
  styleUrls: ['./container-secrets.component.css']
})
export class ContainerSecretsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Input() secretOptions: NameStringValue[];
  @Output() addSecretRef: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeSecretRef: EventEmitter<number> = new EventEmitter<number>();

  isComponentExpanded: boolean;

  constructor() { }

  get secret_ref() {
    return (this.form.get('secret_ref') as FormArray).controls;
  }

  get k8s_secret_ref() {
    return (this.form.get('k8s_secret_ref') as FormArray).controls;
  }

  handleAddSecretRef(): void {
    this.addSecretRef.emit(true);
  }

  handleRemoveSecretRef(index: number): void {
    this.removeSecretRef.emit(index);
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }

}
