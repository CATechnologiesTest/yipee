import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { Service } from '../../../models/k8s/Service';
import { CustomValidators } from '../../validators/custom-validators.validators';
import { EditorService } from '../../../editor/editor.service';
import { NameValuePairRaw } from '../../../models/YipeeFileRaw';

@Component({
  selector: 'app-new-k8s-service-modal',
  templateUrl: './new-k8s-service-modal.component.html',
  styleUrls: ['./new-k8s-service-modal.component.css']
})
export class NewK8sServiceModalComponent implements OnInit {

  @Input() show: boolean;
  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onCreate = new EventEmitter<Service>();

  form: FormGroup;
  name: string;
  service_type: string;

  serviceTypeOptions: NameValuePairRaw[] = [
    { name: 'ClusterIP', value: 'ClusterIP' },
    { name: 'NodePort', value: 'NodePort' },
    { name: 'LoadBalancer', value: 'LoadBalancer' },
    { name: 'ExternalName', value: 'ExternalName' }
  ];

  errors = {
    nameTooltipErrors: []
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
        CustomValidators.duplicateK8sNameValidator(this.editorService, 'services')
      ]],
      service_type: ['ClusterIP', [ /* dropdown - validation not necessary */ ]]
    });

    this.form.get('name').valueChanges.subscribe(value => {
      this.name = value;
    });

    this.form.get('service_type').valueChanges.subscribe(value => {
      this.service_type = value;
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
    const service = this.editorService.newK8sService();
    service.name = this.name;
    service.service_type = this.service_type;
    this.onCreate.emit(service);
    this.reset();
  }

  reset(): void {
    this.form.setValue({
      name: '',
      service_type: 'ClusterIP'
    });
  }

}
