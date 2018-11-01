import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { CustomValidators } from '../../validators/custom-validators.validators';
import { EditorService } from '../../../editor/editor.service';
import { NameValuePairRaw } from '../../../models/YipeeFileRaw';
import { Ingress } from '../../../models/k8s/Ingress';

@Component({
  selector: 'app-new-k8s-ingress-modal',
  templateUrl: './new-k8s-ingress-modal.component.html',
  styleUrls: ['./new-k8s-ingress-modal.component.css']
})
export class NewK8sIngressModalComponent implements OnInit {

  @Input() show: boolean;
  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onCreate = new EventEmitter<Ingress>();

  form: FormGroup;
  name: string;
  description: string;

  errors = {
    nameTooltipErrors: [],
    descriptionTooltipErrors: []
  };

  errorMessages = [
    { name: 'required', value: 'is Required'},
    { name: 'lowercaseAlphaNumericDashPeriod', value: 'may only contain lowercase letters, numbers, dashes, and periods'},
    { name: 'startsWithDash', value: 'may not begin with a dash'},
    { name: 'endsWithDash', value: 'may not end with a dash'},
    { name: 'startsWithPeriod', value: 'may not begin with a period'},
    { name: 'endsWithPeriod', value: 'may not end with a period'},
    { name: 'duplicateNameValidator', value: 'must be unique, a service already exists with this name'},
    { name: 'maxLength253', value: 'must have fewer than 254 characters'},
    { name: 'maxLength128', value: 'must have fewer than 128 characters'}
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
        CustomValidators.duplicateK8sNameValidator(this.editorService, 'ingress')
      ]],
      description: ['', [ /*Validators go here*/ ]]
    });

    this.form.get('name').valueChanges.subscribe(value => {
      this.name = value;
    });

    this.form.get('description').valueChanges.subscribe(value => {
      this.description = value;
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
    const ingress = this.editorService.newK8sIngress();
    ingress.name = this.name;
    ingress.description = this.description;
    this.onCreate.emit(ingress);
    this.reset();
  }

  reset(): void {
    this.form.setValue({
      name: '',
      description: ''
    });
  }

}
