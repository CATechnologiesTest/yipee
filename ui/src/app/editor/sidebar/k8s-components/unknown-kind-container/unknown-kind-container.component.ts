import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UnknownKind } from '../../../../models/k8s/UnknownKind';
import { EditorService } from '../../../editor.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators.validators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-unknown-kind-container',
  templateUrl: './unknown-kind-container.component.html',
  styleUrls: ['./unknown-kind-container.component.css']
})
export class UnknownKindContainerComponent implements OnInit {
  @Input() unknownKind: UnknownKind;

  form: FormGroup;
  isReadOnly = false;
  error = {
    name: null,
    message: null
  };

  constructor(
    private formBuilder: FormBuilder,
    private editorService: EditorService
  ) {}

  ngOnInit() {

    this.form = this.formBuilder.group({
      name: [{ value: this.unknownKind.name, disabled: this.isReadOnly }, [
        /* yaml is validated outside of the form */
      ]],
      kind: [{ value: this.unknownKind.kind, disabled: this.isReadOnly }, [
        /* yaml is validated outside of the form */
      ]],
      body: [{ value: null, disabled: this.isReadOnly }, [
        /* yaml is validated outside of the form */
      ]],
      id: [{ value: this.unknownKind.id, disabled: this.isReadOnly }]
    });

    this.form.setValidators([CustomValidators.duplicateNameOfKindValidator(this.editorService)]);

    this.form.get('body').valueChanges.subscribe((newBodyValue: string) => {
      this.unknownKind.body = newBodyValue;
      this.form.get('name').setValue(this.unknownKind.name);
      this.form.get('kind').setValue(this.unknownKind.kind);

      if (this.unknownKind.error.name && this.unknownKind.error.message) {
        this.error = this.unknownKind.error;
      } else if (this.form.value.name === 'Custom' || this.form.value.kind === 'Unknown') {
        this.error.name = 'Error';
        this.error.message = 'Unknown kind YAML must contain "kind" and "name" parameters.';
      } else {
        this.error.name = null;
        this.error.message = null;
      }

      if (this.error.name !== null || this.form.errors.duplicateNameOfKindValidator) {
        this.editorService.reportInvalidForm(this.unknownKind.id, true);
      } else {
        this.editorService.reportInvalidForm(this.unknownKind.id, false);
      }

    });

    // load yaml into body after the form init in order to trigger the valueChange and validators on load
    this.form.get('body').setValue(this.unknownKind.body);

  }

}
