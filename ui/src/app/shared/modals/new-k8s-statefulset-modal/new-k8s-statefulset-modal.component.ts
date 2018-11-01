import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ContainerGroup } from '../../../models/common/ContainerGroup';
import { CustomValidators } from '../../validators/custom-validators.validators';
import { EditorService } from '../../../editor/editor.service';

@Component({
  selector: 'app-new-k8s-statefulset-modal',
  templateUrl: './new-k8s-statefulset-modal.component.html',
  styleUrls: ['./new-k8s-statefulset-modal.component.css']
})
export class NewK8sStatefulSetModalComponent implements OnInit {

  @Input() show: boolean;
  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onCreate = new EventEmitter<ContainerGroup>();

  /** TODO test are duplicated from the side panel, they should be the same */

  updateStrategyOptions = [
    { name: 'Rolling Update', value: 'RollingUpdate' },
    { name: 'On Delete', value: 'OnDelete' }
  ];

  podManagementOptions = [
    { name: 'Ordered Ready', value: 'OrderedReady' },
    { name: 'Parallel', value: 'Parallel' }
  ];

  form: FormGroup;
  name: string;
  description: string;
  grace_period: number;
  replicas: number;
  update_strategy: string;
  pod_management: string;

  errors = {
    nameTooltipErrors: [],
    descriptionTooltipErrors: [],
    gracePeriodTooltipErrors: [],
    replicasTooltipErrors: [],
  };

  errorMessages = [
    { name: 'required', value: 'is Required' },
    { name: 'lowercaseAlphaNumericDashPeriod', value: 'may only contain lowercase letters, numbers, dashes, and periods' },
    { name: 'startsWithDash', value: 'may not begin with a dash' },
    { name: 'endsWithDash', value: 'may not end with a dash' },
    { name: 'startsWithPeriod', value: 'may not begin with a period' },
    { name: 'endsWithPeriod', value: 'may not end with a period' },
    { name: 'duplicateNameValidator', value: 'must be unique, a controller already exists with this name' },
    { name: 'maxLength253', value: 'must have fewer than 254 characters' },
    { name: 'maxLength128', value: 'must have fewer than 128 characters' }
  ];

  constructor(private formBuilder: FormBuilder, private editorService: EditorService) {
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
      ]],
      grace_period: [30, [
        Validators.required
      ]],
      replicas: [1, [
        Validators.required
      ]],
      update_strategy: ['RollingUpdate', []],
      pod_management: ['OrderedReady', []],
    });

    this.form.get('name').valueChanges.subscribe(value => {
      this.name = value;
    });

    this.form.get('description').valueChanges.subscribe(value => {
      this.description = value;
    });

    this.form.get('grace_period').valueChanges.subscribe(value => {
      this.grace_period = value;
    });

    this.form.get('replicas').valueChanges.subscribe(value => {
      this.replicas = value;
    });

    this.form.get('update_strategy').valueChanges.subscribe(value => {
      this.update_strategy = value;
    });

    this.form.get('pod_management').valueChanges.subscribe(value => {
      this.pod_management = value;
    });

  }

  checkFormValidity() {

    // reset all of the errors in the error object
    Object.entries(this.errors).forEach((errorInArray) => {
      this.errors[errorInArray[0]] = [];
    });

    // get errors for the name field
    if (this.form.get('name').errors) {
      const activeErrors = this.form.get('name').errors;
      this.getErrorMessage(activeErrors).forEach((errorMessage) => {
        this.errors.nameTooltipErrors.push(`Name ${errorMessage}`);
      });
    }

    // get errors for the description field
    if (this.form.get('description').errors) {
      const activeErrors = this.form.get('description').errors;
      this.getErrorMessage(activeErrors).forEach((errorMessage) => {
        this.errors.descriptionTooltipErrors.push(`Description ${errorMessage}`);
      });
    }

    // get errors for the grace_period field
    if (this.form.get('grace_period').errors) {
      const activeErrors = this.form.get('grace_period').errors;
      this.getErrorMessage(activeErrors).forEach((errorMessage) => {
        this.errors.gracePeriodTooltipErrors.push(`Termination grace period ${errorMessage}`);
      });
    }

    // get errors for the replicas field
    if (this.form.get('replicas').errors) {
      const activeErrors = this.form.get('replicas').errors;
      this.getErrorMessage(activeErrors).forEach((errorMessage) => {
        this.errors.replicasTooltipErrors.push(`Replicas ${errorMessage}`);
      });
    }
  }

  // iterate through the errorArray and compare it with the active errors
  // create a mega error message combine all active errors
  getErrorMessage(activeErrors) {
    const errorMessages = [];

    this.errorMessages.forEach((error) => {
      if (activeErrors[error.name] && (activeErrors[error.name] === true)) {
        errorMessages.push(error.value);
      }
    });

    return errorMessages;
  }

  ngOnInit() {
    this.reset();
  }

  cancel(): void {
    this.onCancel.emit(false);
    this.reset();
  }

  create(): void {
    const controller = this.editorService.newContainerGroup();
    controller.name = this.name;
    controller.description = this.description;
    controller.deployment_spec.controller_type = 'StatefulSet';
    controller.deployment_spec.termination_grace_period = this.grace_period;
    controller.deployment_spec.count = this.replicas;
    controller.deployment_spec.update_strategy = this.update_strategy;
    controller.deployment_spec.pod_management_policy = this.pod_management;
    this.onCreate.emit(controller);
    this.reset();
  }

  reset(): void {
    this.form.setValue({
      name: '',
      description: '',
      grace_period: 30,
      replicas: 1,
      update_strategy: 'RollingUpdate',
      pod_management: 'OrderedReady'
    });
  }

}
