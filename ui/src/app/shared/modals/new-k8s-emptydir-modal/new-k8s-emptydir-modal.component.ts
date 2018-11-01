import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { EmptyDirVolume } from '../../../models/common/EmptyDirVolume';
import { CustomValidators } from '../../validators/custom-validators.validators';
import { EditorService } from '../../../editor/editor.service';

@Component({
  selector: 'app-new-k8s-emptydir-modal',
  templateUrl: './new-k8s-emptydir-modal.component.html',
  styleUrls: ['./new-k8s-emptydir-modal.component.css']
})
export class NewK8sEmptyDirModalComponent implements OnInit {

  @Input() show: boolean;
  @Input() isTemplate: boolean;
  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onCreate = new EventEmitter<EmptyDirVolume>();

  form: FormGroup;
  name: string;
  description: string;
  memory: boolean;

  errors = {
    nameTooltipErrors: [],
    descriptionTooltipErrors: []
  };

  errorMessages = [
    { name: 'required', value: 'is Required' },
    { name: 'lowercaseAlphaNumericDashPeriod', value: 'may only contain lowercase letters, numbers, dashes, and periods' },
    { name: 'startsWithDash', value: 'may not begin with a dash' },
    { name: 'endsWithDash', value: 'may not end with a dash' },
    { name: 'startsWithPeriod', value: 'may not begin with a period' },
    { name: 'endsWithPeriod', value: 'may not end with a period' },
    { name: 'duplicateNameValidator', value: 'must be unique, an empty dir already exists with this name' },
    { name: 'maxLength253', value: 'must have fewer than 254 characters' },
    { name: 'maxLength128', value: 'must have fewer than 128 characters' }
  ];

  constructor(private formBuilder: FormBuilder, private editorService: EditorService) {
    this.show = false;
    this.isTemplate = false;
    this.form = this.formBuilder.group({
      name: ['', [
        Validators.required,
        CustomValidators.maxLength253,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithPeriod,
        CustomValidators.duplicateK8sNameValidator(this.editorService, 'empty_dirs')
      ]],
      description: ['', [
        CustomValidators.maxLength128
      ]],
      memory: [false, []]
    });

    this.form.get('name').valueChanges.subscribe(value => {
      this.name = value;
    });

    this.form.get('description').valueChanges.subscribe(value => {
      this.description = value;
    });

    this.form.get('memory').valueChanges.subscribe(value => {
      this.memory = value;
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
    const volume = this.editorService.newK8sEmptyDirVolume();
    volume.name = this.name;
    volume.description = this.description;
    if (this.memory) {
      volume.medium = 'Memory';
    } else {
      volume.medium = '';
    }
    this.onCreate.emit(volume);
    this.reset();
  }

  reset(): void {
    this.form.setValue({
      name: '',
      description: '',
      memory: false
    });
  }

}
