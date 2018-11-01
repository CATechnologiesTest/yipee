import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-pod-image-pull-secrets',
  templateUrl: './pod-image-pull-secrets.component.html',
  styleUrls: ['./pod-image-pull-secrets.component.css']
})
export class PodImagePullSecretsComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;
  @Output() addImagePullSecret: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeImagePullSecret: EventEmitter<number> = new EventEmitter<number>();

  isComponentExpanded: boolean;

  constructor() { }

  get image_pull_secrets() {
    return (this.form.get('image_pull_secrets') as FormArray).controls;
  }

  handleAddImagePullSecret() {
    this.addImagePullSecret.emit(true);
  }

  handleRemoveImagePullSecret(index) {
    this.removeImagePullSecret.emit(index);
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }

}
