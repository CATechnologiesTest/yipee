import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { YipeeFileMetadata } from '../../../models/YipeeFileMetadata';
import { alphaNumericValidator } from '../../validators/alpha-numeric.validator';
import { firstCharAlphaNumericValidator } from '../../validators/first-char-alpha-numeric.validator';
import { ImportAppService } from '../../services/import-app.service';
import { YipeeFileErrorResponse } from '../../../models/YipeeFileResponse';
import { EditorService } from '../../../editor/editor.service';
import { YipeeFileService } from '../../services/yipee-file.service';

@Component({
  selector: 'app-import-app-modal',
  templateUrl: './import-app-modal.component.html',
  styleUrls: ['./import-app-modal.component.css']
})
export class ImportAppModalComponent implements OnInit {
  @Input() show: boolean;
  @Output() onCreate = new EventEmitter<YipeeFileMetadata>();
  @Output() onCancel = new EventEmitter<boolean>();

  model = { applicationName: '' };
  alertText: string[];

  importApplicationForm: FormGroup;

  constructor(
    private importAppService: ImportAppService,
    private formBuilder: FormBuilder,
    private editorService: EditorService,
    private yipeeFileService: YipeeFileService
  ) {
    this.show = false;
    this.alertText = [];
  }

  // make request and emit the onCreate response
  importApplication(isK8s, isTgz, data) {
    const applicationName = this.importApplicationForm.get('applicationName').value;

    this.importAppService.importFile(applicationName, data, isK8s, isTgz).subscribe((response) => {
      const importedYipeeFile = this.yipeeFileService.convertServerResponse(response.data[0]);
      importedYipeeFile.flatFile.appInfo.name = applicationName;
      importedYipeeFile.name = applicationName;
      importedYipeeFile.isFlat = true;
      this.editorService.loadYipeeFile(importedYipeeFile).subscribe((response2) => {
        this.alertText.length = 0;
        this.reset();
        this.onCreate.emit(new YipeeFileMetadata(response.data[0]));
      });

    }, (error) => {
      const response = JSON.parse(error._body) as YipeeFileErrorResponse;
      this.alertText = response.data[0].split('\n');
      while (this.alertText[this.alertText.length - 1] === '') {
        this.alertText.pop();
      }
    });
  }

  reset(): void {
    // using the form reset messes up the radio buttons (they get set to null)
    this.importApplicationForm.get('applicationName').setValue('');
    this.importApplicationForm.updateValueAndValidity();
    const uploadFile = document.getElementById('uploadFile') as any;
    uploadFile.value = '';
  }

  selectFile(): void {
    document.getElementById('uploadFile').click();
  }

  // event handler for when a file has been selected in the modal
  fileSelected(event): void {
    this.readFile(event.target);
    event.target.value = '';
  }

  // function to read the imported file into text so that we can submit it to the API
  readFile(inputValue: any): void {
    const file: File = inputValue.files[0];
    const fileReader: FileReader = new FileReader();

    fileReader.onloadend = (e) => {
      const base64Result = btoa(fileReader.result.toString());
      this.importApplication(true, true, base64Result);
    };
    fileReader.readAsBinaryString(file);
    $('#file').val('');
  }

  // cancel the import application and erase the form
  cancelImportApp() {
    this.onCancel.emit(false);
    this.alertText.length = 0;
    this.reset();
  }

  ngOnInit(): void {

    this.importApplicationForm = this.formBuilder.group({
      applicationName: [{ value: this.model.applicationName, disabled: false }, [
        Validators.required,
        Validators.maxLength(64),
        alphaNumericValidator(),
        firstCharAlphaNumericValidator()
      ]]
    });

  }
}
