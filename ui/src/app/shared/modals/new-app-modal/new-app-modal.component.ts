import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { alphaNumericValidator } from '../../validators/alpha-numeric.validator';
import { firstCharAlphaNumericValidator } from '../../validators/first-char-alpha-numeric.validator';
import { YipeeFileMetadata } from '../../../models/YipeeFileMetadata';

import { YipeeFileService } from '../../services/yipee-file.service';
import { EditorService } from '../../../editor/editor.service';

@Component({
  selector: 'app-new-app-modal',
  templateUrl: './new-app-modal.component.html',
  styleUrls: ['./new-app-modal.component.css']
})
export class NewAppModalComponent implements OnInit {

  @Input() show: boolean;
  @Output() onCreate = new EventEmitter<YipeeFileMetadata>();
  @Output() onCancel = new EventEmitter<boolean>();
  alertText: string[];
  fileType: string;

  model = { applicationName: '' };

  newApplicationForm: FormGroup;

  constructor(
    private editorService: EditorService,
    private yipeeFileService: YipeeFileService
  ) {
    this.show = false;
    this.alertText = [];
  }

  get applicationName() {
    return this.newApplicationForm.get('applicationName');
  }

  createNewApp(formValues) {
    this.model.applicationName = formValues.applicationName;
    const newYipeeFile = this.yipeeFileService.create(this.model.applicationName);
    this.editorService.loadYipeeFile(newYipeeFile).subscribe((response) => {
      this.newApplicationForm.reset();
      this.alertText.length = 0;
      this.onCreate.emit(newYipeeFile);
    });
  }

  cancelNewApp() {
    this.onCancel.emit(false);
    this.alertText = [];
    this.newApplicationForm.reset();
  }


  ngOnInit(): void {
    this.newApplicationForm = new FormGroup({
      'applicationName': new FormControl(this.model.applicationName, [
        Validators.required,
        Validators.maxLength(64),
        // forbiddenNameValidator(this.catalogService, this.userService, this.orgService), // <-- Here's how you pass in the custom validator.
        alphaNumericValidator(),
        firstCharAlphaNumericValidator()
      ])
    });
  }

}
