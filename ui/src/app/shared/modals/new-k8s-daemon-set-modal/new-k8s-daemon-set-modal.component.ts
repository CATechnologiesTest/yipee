import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ContainerGroup } from '../../../models/common/ContainerGroup';
import { CustomValidators } from '../../validators/custom-validators.validators';
import { EditorService } from '../../../editor/editor.service';

@Component({
  selector: 'app-new-k8s-daemon-set-modal',
  templateUrl: './new-k8s-daemon-set-modal.component.html',
  styleUrls: ['./new-k8s-daemon-set-modal.component.css']
})
export class NewK8sDaemonSetModalComponent implements OnInit {

  @Input() show: boolean;
  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onCreate = new EventEmitter<ContainerGroup>();

  form: FormGroup;
  name: string;
  description: string;

  constructor(
    private formBuilder: FormBuilder,
    private editorService: EditorService
  ) {
    this.show = false;
    this.form = this.formBuilder.group({
      name: ['', [
        Validators.required,
        CustomValidators.maxLength253,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithPeriod,
        CustomValidators.duplicateK8sNameValidator(this.editorService, 'containerGroups')
      ]],
      description: ['', [
        CustomValidators.maxLength128
      ]]
    });

    this.form.get('name').valueChanges.subscribe(value => {
      this.name = value;
    });

    this.form.get('description').valueChanges.subscribe(value => {
      this.description = value;
    });
  }

  cancel(): void {
    this.onCancel.emit(false);
    this.reset();
  }

  create(): void {
    const controller = this.editorService.newContainerGroup();
    controller.name = this.name;
    controller.description = this.description;
    controller.deployment_spec.controller_type = 'DaemonSet';
    controller.deployment_spec.mode = 'allnodes';
    this.onCreate.emit(controller);
    this.reset();
  }

  reset(): void {
    this.form.setValue({
      name: '',
      description: ''
    });
  }

  ngOnInit() {
    this.reset();
  }

}
