import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

import { EmptyDirVolume } from '../../../../models/common/EmptyDirVolume';
import { CustomValidators } from '../../../../shared/validators/custom-validators.validators';
import { EditorService } from '../../../editor.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-empty-dir',
  templateUrl: './k8s-empty-dir.component.html',
  styleUrls: ['./k8s-empty-dir.component.css']
})

export class K8sEmptyDirComponent implements OnInit {
  @Input() emptydir: EmptyDirVolume;

  form: FormGroup;
  isReadOnly = false;

  constructor(
    private formBuilder: FormBuilder,
    private editorService: EditorService
  ) { }

  ngOnInit() {
    /* ***************************** */
    /* CONTAINER REACTIVE FORM MODEL */
    /* ***************************** */
    this.form = this.formBuilder.group({
      name: [{ value: this.emptydir.name, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.maxLength253,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithPeriod,
        CustomValidators.duplicateK8sNameValidator(this.editorService, 'empty_dirs')
      ]],
      description: [{ value: this.emptydir.description, disabled: this.isReadOnly }, [
        Validators.maxLength(128)
      ]],
      medium: [{ value: true, disabled: this.isReadOnly }, [ /* checkbox no validations */ ]]
    });
    /* ********************************* */
    /* END CONTAINER REACTIVE FORM MODEL */
    /* ********************************* */

    // set the param 'medium' based on the emptydir's medium param string
    if (this.emptydir.medium === 'Memory') {
      (this.form.get('medium') as FormControl).setValue(true);
    } else {
      (this.form.get('medium') as FormControl).setValue(false);
    }

    /* ********************************************* */
    /* EMTPY DIR REACTIVE FORM VALUE CHANGE HANDLERS */
    /* ********************************************* */
    this.form.get('name').valueChanges.subscribe((newVal: string) => this.emptydir.name = newVal);
    this.form.get('description').valueChanges.subscribe((newVal: string) => this.emptydir.description = newVal);
    this.form.get('medium').valueChanges.subscribe((newVal: boolean) => {
      if (newVal === true) {
        this.emptydir.medium = 'Memory';
      } else {
        this.emptydir.medium = '';
      }
    });
    /* ************************************************* */
    /* END EMTPY DIR REACTIVE FORM VALUE CHANGE HANDLERS */
    /* ************************************************* */

    /* ****************************************** */
    /* SET DIRTY FLAG ONCE FORM HAS VALUE CHANGES */
    /* ****************************************** */
    this.form.valueChanges.subscribe(() => {
      if (this.form.dirty) {
        this.editorService.dirty = this.form.dirty;
      }

      // this name of this fn is misleading. We report validity on every form change in order to report freshly vlidated forms
      this.editorService.reportInvalidForm(this.emptydir.id , this.form.invalid);
    });
    /* ********************************************** */
    /* END SET DIRTY FLAG ONCE FORM HAS VALUE CHANGES */
    /* ********************************************** */

    this.form.get('name').updateValueAndValidity();
  }

}
