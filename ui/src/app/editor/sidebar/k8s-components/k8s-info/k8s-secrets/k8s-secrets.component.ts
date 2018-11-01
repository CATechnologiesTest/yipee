import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-secrets',
  templateUrl: './k8s-secrets.component.html',
  styleUrls: ['./k8s-secrets.component.css']
})
export class K8sSecretsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Output() addSecretVolume: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeSecretVolume: EventEmitter<string>  = new EventEmitter<string>();
  @Output() addSecretVolumeSecret: EventEmitter<number> = new EventEmitter<number>();
  @Output() removeSecretVolumeSecret: EventEmitter<object>  = new EventEmitter<object>();

  isComponentExpanded: boolean;

  constructor() { }

  get secrets() {
    return (this.form.get('secrets') as FormArray).controls;
  }

  handleAddSecretVolume() {
    this.addSecretVolume.emit(true);
  }

  handleRemoveSecretVolume(secretId) {
    this.removeSecretVolume.emit(secretId);
  }

  handleAddSecretVolumeSecret(index) {
    this.addSecretVolumeSecret.emit(index);
  }

  handleRemoveSecretVolumeSecret(volIndex: number, refIndex: number) {
    const secretIndexes = {
      volIndex: volIndex,
      refIndex: refIndex
    };
    this.removeSecretVolumeSecret.emit(secretIndexes);
  }

  trackSecretVolumeSecret(index, secref) {
    return secref ? secref.id : undefined;
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }

}
