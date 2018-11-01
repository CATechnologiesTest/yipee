import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ContainerGroup } from '../../../models/common/ContainerGroup';
import { CustomValidators } from '../../validators/custom-validators.validators';
import { EditorService } from '../../../editor/editor.service';

@Component({
  selector: 'app-new-k8s-cron-job-modal',
  templateUrl: './new-k8s-cron-job-modal.component.html',
  styleUrls: ['./new-k8s-cron-job-modal.component.css']
})
export class NewK8sCronJobModalComponent implements OnInit {

  @Input() show: boolean;
  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onCreate = new EventEmitter<ContainerGroup>();

  form: FormGroup;
  name: string;
  backoffLimit: number;
  activeDeadlineSeconds: number;
  startingDeadlineSeconds: number;
  completions: number;
  parallelism: number;
  concurrencyPolicy: string;
  schedule: string;
  description: string;

  concurrencyPolicyOptions = [
    { name: 'Allow', value: 'Allow'},
    { name: 'Forbid', value: 'Forbid'},
    { name: 'Replace', value: 'Replace'}
  ];

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
      ]],
      backoffLimit: [6, [ Validators.required, CustomValidators.numericOneOrGreater ]],
      activeDeadlineSeconds: [1, [ Validators.required, CustomValidators.numericOneOrGreater ]],
      startingDeadlineSeconds: [1, [ CustomValidators.numericOneOrGreater ]],
      completions: [1, [ CustomValidators.numericOneOrGreater ]],
      parallelism: [1, [ CustomValidators.numericOneOrGreater ]],
      concurrencyPolicy: ['Allow', [ /* dropdown, no validations */ ]],
      schedule: ['* * * * *', [ Validators.required, CustomValidators.cronTimeValidator ]]
    });

    this.form.get('name').valueChanges.subscribe(value => {
      this.name = value;
    });

    this.form.get('description').valueChanges.subscribe(value => {
      this.description = value;
    });

    this.form.valueChanges.subscribe(value => {
      this.name = value.name;
      this.description = value.description;
      this.backoffLimit = value.backoffLimit;
      this.activeDeadlineSeconds = value.activeDeadlineSeconds;
      this.startingDeadlineSeconds = value.startingDeadlineSeconds;
      this.completions = value.completions;
      this.parallelism = value.parallelism;
      this.concurrencyPolicy = value.concurrencyPolicy;
      this.schedule = value.schedule;
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
    controller.deployment_spec.controller_type = 'CronJob';
    controller.cronjob_data.backoffLimit = this.backoffLimit;
    controller.cronjob_data.activeDeadlineSeconds = this.activeDeadlineSeconds;
    controller.cronjob_data.startingDeadlineSeconds = this.startingDeadlineSeconds;
    controller.cronjob_data.completions = this.completions;
    controller.cronjob_data.parallelism = this.parallelism;
    controller.cronjob_data.concurrencyPolicy = this.concurrencyPolicy;
    controller.cronjob_data.schedule = this.schedule;

    this.onCreate.emit(controller);
    this.reset();
  }

  reset(): void {
    this.form.setValue({
      name: '',
      description: '',
      backoffLimit: 6,
      activeDeadlineSeconds: 1,
      startingDeadlineSeconds: 1,
      completions: 1,
      parallelism: 1,
      concurrencyPolicy: 'Allow',
      schedule: '* * * * *'
    });
  }

  ngOnInit() {
    this.reset();
  }

}
