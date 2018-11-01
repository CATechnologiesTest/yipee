import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { Volume } from '../../../models/common/Volume';
import { CustomValidators } from '../../validators/custom-validators.validators';
import { EditorService } from '../../../editor/editor.service';

@Component({
  selector: 'app-new-k8s-volume-modal',
  templateUrl: './new-k8s-volume-modal.component.html',
  styleUrls: ['./new-k8s-volume-modal.component.css']
})
export class NewK8sVolumeModalComponent implements OnInit {

  @Input() show: boolean;
  @Input() isTemplate: boolean;
  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onCreate = new EventEmitter<Volume>();

  form: FormGroup;
  name: string;
  description: string;
  volume_mode: string;
  storage_class: string;
  storage: string;

  /** TODO make this a constant somewhere as they are duplicated from the side panel */

  volumeModeOptions = [
    { name: 'Filesystem', value: 'Filesystem' },
    { name: 'Block Device', value: 'Block' }
  ];

  errors = {
    nameTooltipErrors: [],
    descriptionTooltipErrors: [],
    storageClassTooltipErrors: [],
    storageTooltipErrors: []
  };

  errorMessages = [
    { name: 'required', value: 'is Required' },
    { name: 'lowercaseAlphaNumericDashPeriod', value: 'may only contain lowercase letters, numbers, dashes, and periods' },
    { name: 'startsWithDash', value: 'may not begin with a dash' },
    { name: 'endsWithDash', value: 'may not end with a dash' },
    { name: 'startsWithPeriod', value: 'may not begin with a period' },
    { name: 'endsWithPeriod', value: 'may not end with a period' },
    { name: 'duplicateNameValidator', value: 'must be unique, a volume already exists with this name' },
    { name: 'maxLength253', value: 'must have fewer than 254 characters' },
    { name: 'maxLength128', value: 'must have fewer than 128 characters' },
    { name: 'volumeStorageValidator', value: 'value must match standard Kubernetes notation, a number followed by (E, P, T, G, M, K, or Ei, Pi, Ti, Gi, Mi, Ki)'}
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
        CustomValidators.duplicateK8sNameValidator(this.editorService, 'volumes')
      ]],
      description: ['', [
        CustomValidators.maxLength128
      ]],
      volume_mode: ['Filesystem', []],
      storage_class: ['', []],
      storage: ['', [
        Validators.required,
        CustomValidators.volumeStorageValidator
      ]],
    });

    this.form.get('name').valueChanges.subscribe(value => {
      this.name = value;
    });

    this.form.get('description').valueChanges.subscribe(value => {
      this.description = value;
    });

    this.form.get('volume_mode').valueChanges.subscribe(value => {
      this.volume_mode = value;
    });

    this.form.get('storage_class').valueChanges.subscribe(value => {
      this.storage_class = value;
    });

    this.form.get('storage').valueChanges.subscribe(value => {
      this.storage = value;
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

    // get errors for the storage class field
    if (this.form.get('storage_class').errors) {
      const activeErrors = this.form.get('storage_class').errors;
      this.getErrorMessage(activeErrors).forEach((errorMessage) => {
        this.errors.storageClassTooltipErrors.push(`Storage class ${errorMessage}`);
      });
    }

    // get errors for the storage field
    if (this.form.get('storage').errors) {
      const activeErrors = this.form.get('storage').errors;
      this.getErrorMessage(activeErrors).forEach((errorMessage) => {
        this.errors.storageTooltipErrors.push(`Storage ${errorMessage}`);
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
    const volume = this.editorService.newK8sVolume();
    volume.name = this.name;
    volume.description = this.description;
    volume.volume_mode = this.volume_mode;
    volume.storage_class = this.storage_class;
    volume.storage = this.storage;
    volume.access_modes = [];
    volume.is_template = this.isTemplate;
    this.onCreate.emit(volume);
    this.reset();
  }

  reset(): void {
    this.form.setValue({
      name: '',
      description: '',
      volume_mode: 'Filesystem',
      storage_class: '',
      storage: ''
    });
  }

}
