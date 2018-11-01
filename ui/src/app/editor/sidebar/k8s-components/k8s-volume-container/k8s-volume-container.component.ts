import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

import { Volume } from '../../../../models/common/Volume';
import { CustomValidators } from '../../../../shared/validators/custom-validators.validators';
import { EditorService } from '../../../editor.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-volume-container',
  templateUrl: './k8s-volume-container.component.html',
  styleUrls: ['./k8s-volume-container.component.css']
})
export class K8sVolumeContainerComponent implements OnInit {
  @Input() volume: Volume;

  form: FormGroup;
  isReadOnly = false;

  accessModeOptions = [
    { name: 'Read Only Many', value: 'ReadOnlyMany' },
    { name: 'Read Write Once', value: 'ReadWriteOnce' },
    { name: 'Read Write Many', value: 'ReadWriteMany' }
  ];

  volumeModeOptions = [
    { name: 'Filesystem', value: 'Filesystem' },
    { name: 'Block Device', value: 'Block' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private editorService: EditorService
  ) { }

  /* ************ */
  /* ACCESS_MODES */
  /* ************ */
  loadAccessModes() {
    if (this.volume.access_modes) {
      if (this.volume.access_modes.length === 0) { this.volume.access_modes = ['ReadWriteOnce']; }
      if (this.volume.access_modes.includes('ReadOnlyMany') === true) { (this.form.get('access_modes_ReadOnlyMany') as FormControl).setValue(true); }
      if (this.volume.access_modes.includes('ReadWriteOnce') === true) { (this.form.get('access_modes_ReadWriteOnce') as FormControl).setValue(true); }
      if (this.volume.access_modes.includes('ReadWriteMany') === true) { (this.form.get('access_modes_ReadWriteMany') as FormControl).setValue(true); }

      // start value change handlers
      this.form.get('access_modes_ReadOnlyMany').valueChanges.subscribe(() => {
        this.updateAccessModes();
      });
      this.form.get('access_modes_ReadWriteOnce').valueChanges.subscribe(() => {
        this.updateAccessModes();
      });
      this.form.get('access_modes_ReadWriteMany').valueChanges.subscribe(() => {
        this.updateAccessModes();
      });
    }
  }

  updateAccessModes() {
    const accessModesArray: string[] = [];
    if ((this.form.get('access_modes_ReadOnlyMany') as FormControl).value === true) { accessModesArray.push('ReadOnlyMany'); }
    if ((this.form.get('access_modes_ReadWriteOnce') as FormControl).value === true) { accessModesArray.push('ReadWriteOnce'); }
    if ((this.form.get('access_modes_ReadWriteMany') as FormControl).value === true) { accessModesArray.push('ReadWriteMany'); }
    this.volume.access_modes = accessModesArray;
    if (this.volume.access_modes.length === 0) {
      this.form.get('access_modes_ReadOnlyMany').setErrors({'noneChecked': true});
    } else {
      this.form.get('access_modes_ReadOnlyMany').setErrors(null);
    }
  }
  /* **************** */
  /* END ACCESS_MODES */
  /* **************** */

  ngOnInit() {
    /* ***************************** */
    /* CONTAINER REACTIVE FORM MODEL */
    /* ***************************** */
    this.form = this.formBuilder.group({
      name: [{ value: this.volume.name, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.maxLength253,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithPeriod,
        CustomValidators.duplicateK8sNameValidator(this.editorService, 'volumes')
      ]],
      description: [{ value: this.volume.description, disabled: this.isReadOnly }, [
        Validators.maxLength(128)
      ]],
      volume_mode: [{ value: this.volume.volume_mode, disabled: this.isReadOnly }, [ /* dropdown - no validations */ ]],
      storage_class: [{ value: this.volume.storage_class, disabled: this.isReadOnly } , [ /* add validations */ ]],
      storage: [{ value: this.volume.storage, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.volumeStorageValidator
      ]],
      access_modes_ReadOnlyMany: [{ value: false, disabled: this.isReadOnly }, [ /* checkbox - no validations */ ]],
      access_modes_ReadWriteOnce: [{ value: false, disabled: this.isReadOnly }, [ /* checkbox - no validations */ ]],
      access_modes_ReadWriteMany: [{ value: false, disabled: this.isReadOnly }, [ /* checkbox - no validations */ ]]
    });
    /* ********************************* */
    /* END CONTAINER REACTIVE FORM MODEL */
    /* ********************************* */

    /* *************************************** */
    /* POD REACTIVE FORM VALUE CHANGE HANDLERS */
    /* *************************************** */
    this.form.get('name').valueChanges.subscribe((newVal: string) => this.volume.name = newVal);
    this.form.get('description').valueChanges.subscribe((newVal: string) => this.volume.description = newVal);
    this.form.get('volume_mode').valueChanges.subscribe((newVal: string) => this.volume.volume_mode = newVal);
    this.form.get('storage_class').valueChanges.subscribe((newVal: string) => this.volume.storage_class = newVal);
    this.form.get('storage').valueChanges.subscribe((newVal: string) => this.volume.storage = newVal);
    /* ******************************************* */
    /* END POD REACTIVE FORM VALUE CHANGE HANDLERS */
    /* ******************************************* */

    // load the values for the access modes
    // immidiatly after the load the access modes the start the value change handlers - see loadAccessModes()
    this.loadAccessModes();

    /* ****************************************** */
    /* SET DIRTY FLAG ONCE FORM HAS VALUE CHANGES */
    /* ****************************************** */
    this.form.valueChanges.subscribe(() => {
      if (this.form.dirty) {
        this.editorService.dirty = this.form.dirty;
      }

      // this name of this fn is misleading. We report validity on every form change in order to report freshly vlidated forms
      this.editorService.reportInvalidForm(this.volume.id , this.form.invalid);
    });
    /* ********************************************** */
    /* END SET DIRTY FLAG ONCE FORM HAS VALUE CHANGES */
    /* ********************************************** */

    this.form.get('name').updateValueAndValidity();

  }

}
