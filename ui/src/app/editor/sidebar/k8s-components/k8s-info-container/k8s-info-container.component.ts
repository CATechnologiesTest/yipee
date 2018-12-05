import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../shared/validators/custom-validators.validators';
import { Router } from '@angular/router';

/* models */
import { K8sFile } from '../../../../models/k8s/K8sFile';
import { Config } from '../../../../models/common/Config';

import { EditorService } from '../../../editor.service';
import { EditorEventService } from '../../../editor-event.service';
import { UserService } from '../../../../shared/services/user.service';
import { K8sSecretVolumeSecret } from '../../../../models/k8s/K8sSecretVolumeSecret';
import { K8sSecretVolume } from '../../../../models/k8s/K8sSecretVolume';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-info-container',
  templateUrl: './k8s-info-container.component.html',
  styleUrls: ['./k8s-info-container.component.css']
})
export class K8sInfoContainerComponent implements OnInit {
  @Input() k8sFile: K8sFile;

  form: FormGroup;
  isReadOnly = false;
  sharingEmail: String;

  constructor(
    private formBuilder: FormBuilder,
    private editorService: EditorService,
    private editorEventService: EditorEventService,
    private userService: UserService
  ) { }

  /* ******************* */
  /* SECRET VOLUME ARRAY */
  /* ******************* */
  createSecretVolume(secretVolume: K8sSecretVolume): FormGroup {
    return this.formBuilder.group({
      name: [{ value: secretVolume.name, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.containsDoubleDash,
        CustomValidators.containsDoublePeriod,
        CustomValidators.startsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithDash,
        CustomValidators.endsWithPeriod
      ]],
      secret_name: [{ value: secretVolume.secret_name, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.containsDoubleDash,
        CustomValidators.containsDoublePeriod,
        CustomValidators.startsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithDash,
        CustomValidators.endsWithPeriod
      ]],
      secret_array: this.formBuilder.array([]),
      default_mode: [{ value: secretVolume.default_mode, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.defaultModeValidator
      ]],
      id: [{ value: secretVolume.id, disabled: true }]
    });
  }
  addSecretVolume(secretVolume?: K8sSecretVolume): void {
    if (secretVolume === undefined) {
      secretVolume = new K8sSecretVolume();
      secretVolume.source = 'k8s';
      secretVolume.default_mode = '644';
      secretVolume.name = '';
      secretVolume.secret_name = '';
      secretVolume.secret_array = [];
      // this.k8sFile.secrets[index].secret_refs.push(secretRef);
      this.k8sFile.addK8sSecretVolume(secretVolume);
    }

    const formGroup = this.createSecretVolume(secretVolume);

    if (secretVolume.secret_array.length > 0) {
      secretVolume.secret_array.forEach((volumeSecret) => {
        const newVolumeSecret = this.addExistingSecretVolumeSecret(volumeSecret);
        (formGroup.controls.secret_array as FormArray).push(newVolumeSecret);
      });
    }

    (this.form.get('secrets') as FormArray).push(formGroup);

    formGroup.valueChanges.subscribe((newVal) => {
      ({ secret_array: secretVolume.secret_array, name: secretVolume.name, secret_name: secretVolume.secret_name, default_mode: secretVolume.default_mode } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddK8sSecretVolume');
  }
  removeSecretVolume(formIndex: number): void {
    const secretsControl = this.form.get('secrets') as FormArray;
    const uuid = (secretsControl.at(formIndex) as FormGroup).controls.id.value;
    this.k8sFile.removeK8sSecretVolume(uuid);
    secretsControl.removeAt(formIndex);
  }
  /* *********************** */
  /* END SECRET VOLUME ARRAY */
  /* *********************** */

  /* **************** */
  /* SECRET REF ARRAY */
  /* **************** */
  createSecretVolumeSecret(secretRef: K8sSecretVolumeSecret): FormGroup {
    return this.formBuilder.group({
      key: [{ value: secretRef.key, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.alphaNumericUnderscoreDashPeriod
      ]],
      path: [{ value: secretRef.path, disabled: this.isReadOnly }, [
        CustomValidators.containsDoublePeriod
      ]],
      mode: [{ value: secretRef.mode, disabled: this.isReadOnly }, [
        CustomValidators.defaultModeValidator
      ]],
      gid: [{ value: secretRef.gid, disabled: this.isReadOnly }, [
        Validators.required
      ]],
      uid: [{ value: secretRef.uid, disabled: this.isReadOnly }, [
        Validators.required
      ]],
      id: [{ value: secretRef.id, disabled: true }]
    });
  }
  addExistingSecretVolumeSecret(secretRef: K8sSecretVolumeSecret): FormGroup {
    const formGroup = this.createSecretVolumeSecret(secretRef);

    formGroup.valueChanges.subscribe((newVal) => {
      ({ key: secretRef.key, path: secretRef.path, mode: secretRef.mode, gid: secretRef.gid, uid: secretRef.uid } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddSecretVolumeSecret');
    return formGroup;
  }

  addNewSecretVolumeSecret(index: number): void {
    const secretRef = new K8sSecretVolumeSecret();
    secretRef.key = '';
    secretRef.path = '';
    secretRef.mode = '';
    secretRef.gid = '0';
    secretRef.uid = '0';
    this.editorService.dirty = true;

    const formGroup = this.createSecretVolumeSecret(secretRef);
    const secretVolume = (this.form.get('secrets') as FormArray);
    const secretVolumeSecretArray = (secretVolume.controls[index].get('secret_array') as FormArray);
    secretVolumeSecretArray.push(formGroup);

    formGroup.valueChanges.subscribe((newVal) => {
      ({ key: secretRef.key, path: secretRef.path, mode: secretRef.mode, gid: secretRef.gid, uid: secretRef.uid } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddSecretVolumeSecret');
  }

  removeSecretVolumeSecret(object: any): void {
    const secretsControl = (this.form.get('secrets') as FormArray);
    const refControl = (secretsControl.controls[object.volIndex].get('secret_array') as FormArray);
    const uuid = (refControl.at(object.refIndex) as FormGroup).controls.id.value;
    this.k8sFile.k8s_secret_volumes[object.volIndex].secret_array.splice(object.refIndex, 1);
    this.editorService.dirty = true;
    refControl.removeAt(object.refIndex);
  }
  /* ******************** */
  /* END SECRET REF ARRAY */
  /* ******************** */

  /* *************** */
  /* CONFIGMAP ARRAY */
  /* *************** */
  createConfigmap(configmap: Config): FormGroup {
    return this.formBuilder.group({
      name: [{ value: configmap.name, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.alphaNumericUnderscoreDashPeriod,
        CustomValidators.containsDoubleDash,
        CustomValidators.containsDoublePeriod,
        CustomValidators.containsDoubleUnderscore,
        CustomValidators.startsWithDash,
        CustomValidators.startsWithUnderscore,
        CustomValidators.endsWithDash,
        CustomValidators.endsWithUnderscore
      ]],
      map_name: [{ value: configmap.map_name, disabled: this.isReadOnly }, [
        Validators.required
      ]],
      default_mode: [{ value: configmap.default_mode, disabled: this.isReadOnly }, [
        /** not required, if present should be an octal value */
      ]],
      id: [{ value: configmap.id, disabled: true }]
    });
  }

  addConfigmap(configmap?: Config): void {
    if (configmap === undefined) {
      configmap = new Config();
      configmap.name = '';
      configmap.map_name = '';
      configmap.default_mode = '';
      this.k8sFile.addConfig(configmap);
    }

    const formGroup = this.createConfigmap(configmap);
    (this.form.get('configs') as FormArray).push(formGroup);


    formGroup.valueChanges.subscribe((newVal) => {
      ({ name: configmap.name, map_name: configmap.map_name, default_mode: configmap.default_mode } = newVal);
    });
  }

  removeConfigmap(formIndex: number): void {
    const configsControl = this.form.get('configs') as FormArray;
    const uuid = (configsControl.at(formIndex) as FormGroup).controls.id.value;

    this.k8sFile.removeConfig(uuid);
    configsControl.removeAt(formIndex);
  }
  /* ******************* */
  /* END CONFIGMAP ARRAY */
  /* ******************* */

  shareModel() {
    const emailBody = `${this.userService.userInfo.githubUsername} just shared a model with you on yipee.io! Check it out here ${window.location.href}`;
    window.open(`mailto:?Subject=View%20${this.k8sFile.appInfo.name}%20on%20yipee.io&body=${emailBody}`, '_top');
  }

  ngOnInit() {

    /* ***************************** */
    /* APP INFO REACTIVE FORM MODULE */
    /* ***************************** */
    this.form = this.formBuilder.group({
      name: [{ value: this.k8sFile.appInfo.name, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.maxLength64,
        CustomValidators.alphaNumericUnderscoreDash,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash
      ]],
      namespace: [{ value: this.k8sFile.appInfo.namespace, disabled: this.isReadOnly }, [
        CustomValidators.maxLength64,
        CustomValidators.alphaNumericUnderscoreDash,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash
      ]],
      description: [{ value: this.k8sFile.appInfo.description, disabled: this.isReadOnly }, [ /* add validations here */]],
      readme: [{ value: this.k8sFile.appInfo.readme, disabled: this.isReadOnly }, [ /* add validations here */]],
      helmSettingsAll: [{ value: this.k8sFile.appInfo.helmSettingsAll, disabled: this.isReadOnly }, [ /* no validations */ ]],
      helmSettingsPorts: [{ value: this.k8sFile.appInfo.helmSettingsPorts, disabled: this.isReadOnly }, [ /* no validations */ ]],
      helmSettingsLabels: [{ value: this.k8sFile.appInfo.helmSettingsLabels, disabled: this.isReadOnly }, [ /* no validations */ ]],
      helmSettingsEnvironment: [{ value: this.k8sFile.appInfo.helmSettingsEnv, disabled: this.isReadOnly }, [ /* no validations */ ]],
      id: [{ value: this.k8sFile.appInfo.model_id, disabled: true }],
      secrets: this.formBuilder.array([]),
      configs: this.formBuilder.array([])
    });
    /* ********************************* */
    /* END APP INFO REACTIVE FORM MODULE */
    /* ********************************* */

    /* ******************************************** */
    /* APP INFO REACTIVE FORM VALUE CHANGE HANDLERS */
    /* ******************************************** */
    // opted to keep all these on one lines each, they're actually easier to look at that way
    // TODO: if anyone knows any better shorthand for all of these value changes please impliment it, just make sure you do all of them.
    this.form.get('name').valueChanges.subscribe((newVal) => this.k8sFile.appInfo.name = newVal);
    this.form.get('namespace').valueChanges.subscribe((newVal) => this.k8sFile.appInfo.namespace = newVal);
    this.form.get('description').valueChanges.subscribe((newVal) => this.k8sFile.appInfo.description = newVal);
    this.form.get('readme').valueChanges.subscribe((newVal) => this.k8sFile.appInfo.readme = newVal);
    this.form.get('helmSettingsAll').valueChanges.subscribe((newVal) => this.k8sFile.appInfo.helmSettingsAll = newVal);
    this.form.get('helmSettingsEnvironment').valueChanges.subscribe((newVal) => this.k8sFile.appInfo.helmSettingsEnv = newVal);
    this.form.get('helmSettingsLabels').valueChanges.subscribe((newVal) => this.k8sFile.appInfo.helmSettingsLabels = newVal);
    this.form.get('helmSettingsPorts').valueChanges.subscribe((newVal) => this.k8sFile.appInfo.helmSettingsPorts = newVal);
    /* ************************************************ */
    /* END APP INFO REACTIVE FORM VALUE CHANGE HANDLERS */
    /* ************************************************ */

    /* ************************************** */
    /* LOAD INCOMING FORM ARRAY ITEMS ON LOAD */
    /* ************************************** */
    this.k8sFile.k8s_secret_volumes.forEach((secret) => this.addSecretVolume(secret));
    this.k8sFile.configs.forEach((configmap) => this.addConfigmap(configmap));
    /* ****************************************** */
    /* END LOAD INCOMING FORM ARRAY ITEMS ON LOAD */
    /* ****************************************** */

    this.form.get('secrets').valueChanges.subscribe(() => {
      this.editorEventService.onAppSecretChange.emit(true);
    });

    /* ****************************************** */
    /* SET DIRTY FLAG ONCE FORM HAS VALUE CHANGES */
    /* ****************************************** */
    this.form.valueChanges.subscribe(() => {
      if (this.form.dirty) {
        this.editorService.dirty = this.form.dirty;
      }

      // this name of this fn is misleading. We report validity on every form change in order to report freshly vlidated forms
      this.editorService.reportInvalidForm(this.k8sFile.appInfo.id, this.form.invalid);
    });
    /* ********************************************** */
    /* END SET DIRTY FLAG ONCE FORM HAS VALUE CHANGES */
    /* ********************************************** */

    this.form.get('name').updateValueAndValidity();
  }

}
