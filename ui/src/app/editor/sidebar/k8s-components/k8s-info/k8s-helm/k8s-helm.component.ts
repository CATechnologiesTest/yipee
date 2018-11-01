import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-helm',
  templateUrl: './k8s-helm.component.html',
  styleUrls: ['./k8s-helm.component.css']
})
export class K8sHelmComponent implements OnInit {
  @Input() expandedByDefault: boolean;
  @Input() form: FormGroup;

  isComponentExpanded: boolean;

  constructor() { }

  setHelmSettingsAll(value: boolean) {
    this.form.get('helmSettingsAll').setValue(value);
  }

  envVarsOnClick() {
    this.form.get('helmSettingsEnvironment').setValue(!(this.form.get('helmSettingsEnvironment').value));
  }

  portsOnClick() {
    this.form.get('helmSettingsPorts').setValue(!(this.form.get('helmSettingsPorts').value));
  }

  labelsOnClick() {
    this.form.get('helmSettingsLabels').setValue(!(this.form.get('helmSettingsLabels').value));
  }

  ngOnInit() {
    this.expandedByDefault ? this.isComponentExpanded = this.expandedByDefault : this.isComponentExpanded = false;
  }

}
