import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

import { HostPathVolume } from '../../../../models/common/HostPathVolume';
import { CustomValidators } from '../../../../shared/validators/custom-validators.validators';
import { EditorService } from '../../../editor.service';
import { TooltipService } from '../../../../shared/services/tooltip.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-host-path',
  templateUrl: './k8s-host-path.component.html',
  styleUrls: ['./k8s-host-path.component.css']
})

export class K8sHostPathComponent implements OnInit {
  @Input() hostPath: HostPathVolume;

  form: FormGroup;
  isReadOnly = false;

  hostPathTypeOptions = [
    { name: 'DirectoryOrCreate', value: 'DirectoryOrCreate' },
    { name: 'Directory', value: 'Directory' },
    { name: 'FileOrCreate', value: 'FileOrCreate' },
    { name: 'File', value: 'File' },
    { name: 'Socket', value: 'Socket' },
    { name: 'CharDevice', value: 'CharDevice' },
    { name: 'BlockDevice', value: 'BlockDevice' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private editorService: EditorService,
    public tooltipService: TooltipService
  ) { }

  ngOnInit() {
    /* ***************************** */
    /* CONTAINER REACTIVE FORM MODEL */
    /* ***************************** */
    this.form = this.formBuilder.group({
      name: [{ value: this.hostPath.name, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.maxLength253,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithPeriod,
        CustomValidators.duplicateK8sNameValidator(this.editorService, 'host_paths')
      ]],
      description: [{ value: this.hostPath.description, disabled: this.isReadOnly }, [
        Validators.maxLength(128)
      ]],
      host_path_type: [{ value: this.hostPath.host_path_type, disabled: this.isReadOnly }, []],
      host_path: [{ value: this.hostPath.host_path, disabled: this.isReadOnly }, [Validators.required]]
    });
    /* ********************************* */
    /* END CONTAINER REACTIVE FORM MODEL */
    /* ********************************* */

    this.form.get('name').valueChanges.subscribe((newVal: string) => this.hostPath.name = newVal);
    this.form.get('description').valueChanges.subscribe((newVal: string) => this.hostPath.description = newVal);
    this.form.get('host_path_type').valueChanges.subscribe((newVal: string) => this.hostPath.host_path_type = newVal);
    this.form.get('host_path').valueChanges.subscribe((newVal: string) => this.hostPath.host_path = newVal);

    this.form.valueChanges.subscribe(() => {
      if (this.form.dirty) {
        this.editorService.dirty = this.form.dirty;
      }
      this.editorService.reportInvalidForm(this.hostPath.id , this.form.invalid);
    });

    this.form.get('name').updateValueAndValidity();
  }

}
