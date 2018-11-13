import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { sortBy } from 'lodash';

import { CustomValidators } from '../../../../shared/validators/custom-validators.validators';
import { SelectionChangedEvent, EditorEventService, ContainerVolumeChangedEvent } from '../../../editor-event.service';

/* Models */
import { Container } from '../../../../models/common/Container';
import { ContainerLifecycle } from '../../../../models/common/ContainerLifecycle';
import { PortMapping } from '../../../../models/common/PortMapping';
import { EnvironmentVar } from '../../../../models/common/EnvironmentVar';
import { NameValuePairRaw } from '../../../../models/YipeeFileRaw';
import { VolumeRef } from '../../../../models/common/VolumeRef';
import { SecretRef } from '../../../../models/common/SecretRef';
import { EditorService } from '../../../editor.service';
import { SeparatorNameValuePair } from '../../../../models/GenericTypes';

/* temp */
import { K8sFile } from '../../../../models/k8s/K8sFile';
import { environment } from '../../../../../environments/environment.prod';
import { NameStringValue } from '../../../../models/common/Generic';
import { ConfigRef } from '../../../../models/common/ConfigRef';
import { Service } from '../../../../models/k8s/Service';
import { K8sSecretRef } from '../../../../models/k8s/K8sSecretRef';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-container-container',
  templateUrl: './container-container.component.html',
  styleUrls: ['./container-container.component.css']
})
export class ContainerContainerComponent implements OnInit {
  @Input() container: Container;

  form: FormGroup;
  isReadOnly = false;
  showBulkEnvDialog = false;
  bulkEnvVars: string;
  postStartCommand: string;
  preStopCommand: string;

  overrideOptions: NameValuePairRaw[] = [
    { name: 'None', value: 'none' },
    { name: 'Local', value: 'local' },
    { name: 'External', value: 'external' },
    { name: 'Development', value: 'development' }
  ];

  accessModeOptions: NameValuePairRaw[][] = [];

  environmentVariableTypeList: Array<string> = [
    'environment_var',
    'environment_var_config_ref',
    'environment_var_secret_ref',
    'environment_var_field_ref',
    'environment_var_resource_field_ref'
  ];

  constructor(
    private editorEventService: EditorEventService,
    private formBuilder: FormBuilder,
    private editorService: EditorService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.showBulkEnvDialog = false;
    this.bulkEnvVars = '';

  }

  /* ********************************* */
  /* BULK ENVIRONMENT VARIABLE EDITING */
  /* ********************************* */
  handleBulkEnvReplace(bulkEnvVars: string): void {
    while (this.container.environment_var.length > 0) {
      this.removeEnvironmentVar(this.container.environment_var.length - 1);
    }
    this.handleBulkEnvAppend(bulkEnvVars);
  }

  handleBulkEnvAppend(bulkEnvVars: string): void {
    if (bulkEnvVars) {
      const envVarArray = bulkEnvVars.split(/\n/);
      for (const envVar of envVarArray) {
        const newEnvVar = new SeparatorNameValuePair('=', envVar);
        const environmentVar = new EnvironmentVar();
        environmentVar.key = newEnvVar.name;
        environmentVar.value = newEnvVar.value;
        this.container.addEnvironmentVar(environmentVar);
        this.addEnvironmentVar(environmentVar);
      }
    }
    this.handleToggleBulkEnvAdd();
  }

  handleToggleBulkEnvAdd(): void {
    this.showBulkEnvDialog ? (this.showBulkEnvDialog = false) : this.showBulkEnvDialog = true;
  }

  initializeEnvVarModal(): void {
    let environmentVariables = '';
    this.container.environment_var.forEach((envVar) => {
      environmentVariables += envVar.key + '=' + envVar.value + '\n';
    });
    environmentVariables = environmentVariables.substring(0, environmentVariables.length - 1);
    this.bulkEnvVars = environmentVariables;
  }

  /* ************************************* */
  /* END BULK ENVIRONMENT VARIABLE EDITING */
  /* ************************************* */

  /* ****************************************** */
  /* PORTS ARRAY - COMMENTED FORM ARRAY EXAMPLE */
  /* ****************************************** */
  createPortMapping(portMapping: PortMapping): FormGroup {
    // pretty standard here, just create a formGroup for the new mapping being added
    return this.formBuilder.group({
      name: [{ value: portMapping.name, disabled: this.isReadOnly }, [
        CustomValidators.alphaNumericUnderscoreDashPeriod,
        CustomValidators.maxLengthDNSLabel
      ]],
      internal: [{ value: portMapping.internal, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.numericOnly,
        CustomValidators.numericPortRange
      ]],
      protocol: [{ value: portMapping.protocol, disabled: this.isReadOnly }, [ /* add validations here */]],
      id: [{ value: portMapping.id, disabled: true }]
    });
  }
  addPortMapping(portMapping?: PortMapping): void {
    // if not portMapping: PortMapping is provided, we create a default one
    if (portMapping === undefined) {
      portMapping = new PortMapping();
      portMapping.container_references = true; // set to true here as this is defined by the container
      portMapping.external = '', portMapping.name = '', portMapping.internal = '', portMapping.protocol = 'tcp'; // load default mapping values
      this.container.addPortMapping(portMapping); // add port mapping to container
      this.editorService.dirty = true;
    }

    const formGroup = this.createPortMapping(portMapping); // create a formGroup from the new portMapping
    (this.form.get('port_mapping') as FormArray).push(formGroup); // push the formGroup into our working sidebar form

    // watch the value changes on the new formGroup and keep the new PortMapping object up to date
    formGroup.valueChanges.subscribe((newVal) => {
      // notice es6 desctructuring syntax
      ({ internal: portMapping.internal, name: portMapping.name, protocol: portMapping.protocol } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddContainerPort');
  }
  removePortMapping(formIndex: number): void {
    const port_mappingControl = this.form.get('port_mapping') as FormArray; // get control of the port_mapping FormArray
    const uuid = (port_mappingControl.at(formIndex) as FormGroup).controls.id.value; // id/uuid is a form hidden value so we have to sorta look for it
    // we cant simply nuke/refrehs the whole mappings object after removing the mapping from the editor service
    // like we did in the old sidebar so we need to get a little more hands on. manually remove the mapping from the
    // form and manually remove it from the container/thus editorService
    this.container.removePortMapping(uuid);
    this.editorService.dirty = true;
    port_mappingControl.removeAt(formIndex);
  }
  /* ********************************************** */
  /* END PORTS ARRAY - COMMENTED FORM ARRAY EXAMPLE */
  /* ********************************************** */

  /* *************************** */
  /* ENVIRONMENT VARIABLES ARRAY */
  /* *************************** */
  createEnvironmentVar(environmentVar: EnvironmentVar): FormGroup {
    return this.formBuilder.group({
      key: [{ value: environmentVar.key, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.alphaNumericUnderscorePeriodColon,
        CustomValidators.duplicateK8sEnvVarNameValidator(this.container, this.environmentVariableTypeList)
      ]],
      value: [{ value: environmentVar.value, disabled: this.isReadOnly }, [
        CustomValidators.containsMoneySymbol
      ]],
      id: [{ value: environmentVar.id, disabled: true }]
    });
  }
  addEnvironmentVar(environmentVar?: EnvironmentVar): void {
    if (environmentVar === undefined) {
      environmentVar = new EnvironmentVar();
      environmentVar.key = '', environmentVar.value = '';
      this.container.addEnvironmentVar(environmentVar);
      this.editorService.dirty = true;
    }

    const formGroup = this.createEnvironmentVar(environmentVar);
    (this.form.get('environment_var') as FormArray).push(formGroup);

    formGroup.valueChanges.subscribe((newVal) => {
      ({ key: environmentVar.key, value: environmentVar.value } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddContainerEnvironmentVariable');
  }
  removeEnvironmentVar(formIndex: number): void {
    const environmentVar_mappingControl = this.form.get('environment_var') as FormArray;
    const uuid = (environmentVar_mappingControl.at(formIndex) as FormGroup).controls.id.value;

    this.container.removeEnvironmentVar(uuid);
    this.editorService.dirty = true;
    environmentVar_mappingControl.removeAt(formIndex);
  }
  sortEnvironmentVar(ascending: boolean, sortByParam: string): void {
    this.returnSortedArray(this.container.environment_var, sortByParam, ascending).subscribe((sortedArray) => {
      sortedArray.forEach((envVar, index) => {
        (this.form.get('environment_var') as FormArray).removeAt(0); // pulling out formGroups from the bottom of the formArray
        this.addEnvironmentVar(envVar); // pushing new formGroup into the top of the formArray
      });
    });
  }
  /* ******************************* */
  /* END ENVIRONMENT VARIABLES ARRAY */
  /* ******************************* */

  /* **************** */
  /* SECRET_REF ARRAY */
  /* **************** */
  createSecretRef(secretRef: K8sSecretRef): FormGroup {
    return this.formBuilder.group({
      secret_volume: [{ value: secretRef.secret_volume, disabled: this.isReadOnly }, [ /* no validators required */]],
      mount_path: [{ value: secretRef.mount_path, disabled: this.isReadOnly }, [
        CustomValidators.containsColon
      ]],
      id: [{ value: secretRef.id, disabled: true }]
    });
  }
  addSecretRef(secretRef?: K8sSecretRef): void {
    if (secretRef === undefined) {
      secretRef = new K8sSecretRef();
      secretRef.secret_volume = this.container.secret_volume_map[0].value;
      secretRef.mount_path = '';
      this.container.addK8sSecretReference(secretRef);
      this.editorService.dirty = true;
    }
    const formGroup = this.createSecretRef(secretRef);
    (this.form.get('k8s_secret_ref') as FormArray).push(formGroup);
    formGroup.valueChanges.subscribe((newVal) => {
      ({ secret_volume: secretRef.secret_volume, mount_path: secretRef.mount_path } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddContainerK8sSecretRef');
  }
  removeSecretRef(formIndex: number): void {
    const secretRef_mappingControl = this.form.get('k8s_secret_ref') as FormArray;
    const uuid = (secretRef_mappingControl.at(formIndex) as FormGroup).controls.id.value;
    this.container.removeK8sSecretReference(uuid);
    this.editorService.dirty = true;
    secretRef_mappingControl.removeAt(formIndex);
  }
  /* ******************** */
  /* END SECRET_REF ARRAY */
  /* ******************** */

  /* **************** */
  /* CONFIG_REF ARRAY */
  /* **************** */
  createConfigRef(configRef: ConfigRef): FormGroup {
    return this.formBuilder.group({
      config: [{ value: configRef.config, disabled: this.isReadOnly }, [ /* dropdown - no validation requird */]],
      path: [{ value: configRef.path, disabled: this.isReadOnly }, [
        /* isPath validation */
        Validators.required,
        CustomValidators.alphaNumericUnderscoreDashForwardSlashPeriod,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash,
        CustomValidators.startsWithUnderscore,
        CustomValidators.endsWithUnderscore,
        CustomValidators.containsDoubleDash,
        CustomValidators.containsDoubleUnderscore
      ]],
      id: [{ value: configRef.id, disabled: true }]
    });
  }
  addConfigRef(configRef?: ConfigRef): void {
    if (configRef === undefined) {
      configRef = new ConfigRef();
      configRef.config = this.container.config_map[0].value, configRef.path = '';
      this.container.addConfigRef(configRef);
      this.editorService.dirty = true;
    }

    const formGroup = this.createConfigRef(configRef);
    (this.form.get('config_ref') as FormArray).push(formGroup);
    formGroup.valueChanges.subscribe((newVal) => {
      ({ config: configRef.config, path: configRef.path } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddContainerConfigRef');
  }
  removeConfigRef(formIndex: number): void {
    const configRef_mappingControl = this.form.get('config_ref') as FormArray;
    const uuid = (configRef_mappingControl.at(formIndex) as FormGroup).controls.id.value;
    this.container.removeConfigRef(uuid);
    this.editorService.dirty = true;
    configRef_mappingControl.removeAt(formIndex);
  }
  /* ******************** */
  /* END CONFIG_REF ARRAY */
  /* ******************** */

  /* ******************** */
  /* CONFIG_MAP_REF ARRAY */
  /* ******************** */
  createConfigMapRef(configMapRef: any): FormGroup {
    return this.formBuilder.group({
      key: [{ value: configMapRef.key, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.alphaNumericUnderscorePeriodColon,
        CustomValidators.duplicateK8sEnvVarNameValidator(this.container, this.environmentVariableTypeList)
      ]],
      config_name: [{ value: configMapRef.config_name, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.maxLength253,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithPeriod
      ]],
      config_key: [{ value: configMapRef.config_key, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.alphaNumericUnderscorePeriodColon
      ]],
      id: [{ value: configMapRef.id, disabled: true }]
    });
  }
  addConfigMapRef(configMapRef?: any): void {
    if (configMapRef === undefined) {
      configMapRef = new EnvironmentVar();
      configMapRef.key = '';
      configMapRef.config_name = '';
      configMapRef.config_key = '';
      this.container.addEnvironmentVar(configMapRef);
      this.editorService.dirty = true;
    }

    const formGroup = this.createConfigMapRef(configMapRef);
    (this.form.get('config_map_ref') as FormArray).push(formGroup);
    formGroup.valueChanges.subscribe((newVal) => {
      ({ key: configMapRef.key, config_name: configMapRef.config_name, config_key: configMapRef.config_key } = newVal);
    });
  }
  removeConfigMapRef(formIndex: number): void {
    const configMapRef_mappingControl = this.form.get('config_map_ref') as FormArray;
    const uuid = (configMapRef_mappingControl.at(formIndex) as FormGroup).controls.id.value;
    this.container.removeEnvironmentVar(uuid);
    this.editorService.dirty = true;
    configMapRef_mappingControl.removeAt(formIndex);
  }
  /* ************************ */
  /* END CONFIG_MAP_REF ARRAY */
  /* ************************ */

  /* ******************** */
  /* ENV_SECRET_REF ARRAY */
  /* ******************** */
  createEnvSecretRef(envSecretRef: EnvironmentVar): FormGroup {
    return this.formBuilder.group({
      key: [{ value: envSecretRef.key, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.alphaNumericUnderscorePeriodColon,
        CustomValidators.duplicateK8sEnvVarNameValidator(this.container, this.environmentVariableTypeList)
      ]],
      secret_name: [{ value: envSecretRef.secret_name, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.maxLength253,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithPeriod
      ]],
      secret_key: [{ value: envSecretRef.secret_key, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.alphaNumericUnderscorePeriodColon
      ]],
      id: [{ value: envSecretRef.id, disabled: true }]
    });
  }
  addEnvSecretRef(envSecretRef?: EnvironmentVar): void {
    if (envSecretRef === undefined) {
      envSecretRef = new EnvironmentVar();
      envSecretRef.key = '';
      envSecretRef.secret_name = '';
      envSecretRef.secret_key = '';
      this.container.addEnvironmentVar(envSecretRef);
      this.editorService.dirty = true;
    }

    const formGroup = this.createEnvSecretRef(envSecretRef);
    (this.form.get('env_secret_ref') as FormArray).push(formGroup);
    formGroup.valueChanges.subscribe((newVal) => {
      ({ key: envSecretRef.key, secret_name: envSecretRef.secret_name, secret_key: envSecretRef.secret_key } = newVal);
    });
  }
  removeEnvSecretRef(formIndex: number): void {
    const envSecretRef_mappingControl = this.form.get('env_secret_ref') as FormArray;
    const uuid = (envSecretRef_mappingControl.at(formIndex) as FormGroup).controls.id.value;
    this.container.removeEnvironmentVar(uuid);
    this.editorService.dirty = true;
    envSecretRef_mappingControl.removeAt(formIndex);
  }
  /* ************************ */
  /* END ENV_SECRET_REF ARRAY */
  /* ************************ */





  /* *************** */
  /* FIELD_REF ARRAY */
  /* *************** */
  createFieldRef(fieldRef: EnvironmentVar): FormGroup {
    return this.formBuilder.group({
      key: [{ value: fieldRef.key, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.alphaNumericUnderscorePeriodColon,
        CustomValidators.duplicateK8sEnvVarNameValidator(this.container, this.environmentVariableTypeList)
      ]],
      apiVersion: [{ value: fieldRef.apiVersion, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.fieldRefVersionValidator
      ]],
      fieldPath: [{ value: fieldRef.fieldPath, disabled: this.isReadOnly }, [
        CustomValidators.containsSelectAPath
      ]],
      id: [{ value: fieldRef.id, disabled: true }]
    });
  }
  addFieldRef(fieldRef?: EnvironmentVar): void {
    if (fieldRef === undefined) {
      fieldRef = new EnvironmentVar();
      fieldRef.key = '';
      fieldRef.apiVersion = 'v1';
      fieldRef.fieldPath = '-- Select a path --';
      this.container.addFieldReference(fieldRef);
      this.editorService.dirty = true;
    }
    const formGroup = this.createFieldRef(fieldRef);
    (this.form.get('env_field_ref') as FormArray).push(formGroup);
    formGroup.valueChanges.subscribe((newVal) => {
      ({ key: fieldRef.key, apiVersion: fieldRef.apiVersion, fieldPath: fieldRef.fieldPath } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddContainerFieldRef');
  }
  removeFieldRef(formIndex: number): void {
    const fieldRef_mappingControl = this.form.get('env_field_ref') as FormArray;
    const uuid = (fieldRef_mappingControl.at(formIndex) as FormGroup).controls.id.value;
    this.container.removeFieldReference(uuid);
    this.editorService.dirty = true;
    fieldRef_mappingControl.removeAt(formIndex);
  }
  /* ******************* */
  /* END FIELD_REF ARRAY */
  /* ******************* */

  /* *************** */
  /* RESOURCE_FIELD_REF ARRAY */
  /* *************** */
  createResourceFieldRef(resourceFieldRef: EnvironmentVar): FormGroup {
    return this.formBuilder.group({
      key: [{ value: resourceFieldRef.key, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.alphaNumericUnderscorePeriodColon,
        CustomValidators.duplicateK8sEnvVarNameValidator(this.container, this.environmentVariableTypeList)
      ]],
      containerName: [{ value: resourceFieldRef.containerName, disabled: this.isReadOnly }, [
        CustomValidators.maxLength253,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithPeriod
      ]],
      divisor: [{ value: resourceFieldRef.divisor, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.numericOnly
      ]],
      resource: [{ value: resourceFieldRef.resource, disabled: this.isReadOnly }, [
        CustomValidators.containsSelectAResource
      ]],
      id: [{ value: resourceFieldRef.id, disabled: true }]
    });
  }
  addResourceFieldRef(resourceFieldRef?: EnvironmentVar): void {
    if (resourceFieldRef === undefined) {
      resourceFieldRef = new EnvironmentVar();
      resourceFieldRef.key = '';
      resourceFieldRef.containerName = '';
      resourceFieldRef.divisor = '1';
      resourceFieldRef.resource = '-- Select a resource --';
      this.container.addResourceFieldReference(resourceFieldRef);
      this.editorService.dirty = true;
    }
    const formGroup = this.createResourceFieldRef(resourceFieldRef);
    (this.form.get('env_resource_field_ref') as FormArray).push(formGroup);
    formGroup.valueChanges.subscribe((newVal) => {
      ({ key: resourceFieldRef.key, containerName: resourceFieldRef.containerName, divisor: resourceFieldRef.divisor, resource: resourceFieldRef.resource } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddContainerResourceFieldRef');
  }
  removeResourceFieldRef(formIndex: number): void {
    const resourceFieldRef_mappingControl = this.form.get('env_resource_field_ref') as FormArray;
    const uuid = (resourceFieldRef_mappingControl.at(formIndex) as FormGroup).controls.id.value;
    this.container.removeResourceFieldReference(uuid);
    this.editorService.dirty = true;
    resourceFieldRef_mappingControl.removeAt(formIndex);
  }
  /* ******************* */
  /* END RESOURCE_FIELD_REF ARRAY */
  /* ******************* */




  /* **************** */
  /* VOLUME_REF ARRAY */
  /* **************** */
  createVolumeRef(volumeRef: VolumeRef): FormGroup {
    return this.formBuilder.group({
      name: [{ value: volumeRef.volume_name, disabled: true }, [ /* add NO validations here */]],
      path: [{ value: volumeRef.path, disabled: this.isReadOnly }, [Validators.required]],
      sub_path: [{ value: volumeRef.sub_path, disabled: this.isReadOnly }, [ /* add validations here */]],
      access_mode: [{ value: volumeRef.access_mode, disabled: this.isReadOnly }, [ /* add validations here */]],
      id: [{ value: volumeRef.id, disabled: true }]
    });
  }

  loadContainerVolumeRefs() {
    const control = this.form.get('volume_ref') as FormArray;

    this.container.volume_ref.forEach((volumeRef: VolumeRef) => {
      // add that empty dir to the form
      const formGroup = this.createVolumeRef(volumeRef);
      (this.form.get('volume_ref') as FormArray).push(formGroup);

      // patch the values in the volume_ref on value change
      formGroup.valueChanges.subscribe((newVal) => {
        ({ path: volumeRef.path, sub_path: volumeRef.sub_path, access_mode: volumeRef.access_mode } = newVal);
      });
    });

  }

  onContainerVolumeChange() {
    const control = this.form.get('volume_ref') as FormArray;

    // algo to calculate diffs from actions elswhere in the app, then proceede accordingly
    if (this.container.volume_ref.length > control.controls.length) {

      // find the volume ref not already included byId in the volume refs in the form
      const newVolumeRef = this.container.volume_ref.find(function (volumeRef: VolumeRef) {
        const ids = [];
        control.controls.forEach((volumeRefControl) => {
          ids.push(volumeRefControl.get('id').value);
        });
        return ids.includes(volumeRef.id) === false;
      });
      // add that empty dir to the form
      const formGroup = this.createVolumeRef(newVolumeRef);
      (this.form.get('volume_ref') as FormArray).push(formGroup);

      // patch the values in the volume_ref on value change
      formGroup.valueChanges.subscribe((newVal) => {
        ({ path: newVolumeRef.path, sub_path: newVolumeRef.sub_path, access_mode: newVolumeRef.access_mode } = newVal);
      });

      // fire after change to avoid race condition
      this.refreshAccessModesOptions();

    } else if (this.container.volume_ref.length < control.controls.length) {
      const ids = [];
      this.container.volume_ref.forEach((containerVolumeRef) => {
        ids.push(containerVolumeRef.id);
      });

      const indexToRemove = control.controls.findIndex((formControl) => {
        const id = (formControl as FormGroup).controls.id.value;
        return !ids.includes(id);
      });

      control.removeAt(indexToRemove);

      // fire after change to avoid race condition
      this.refreshAccessModesOptions();

    } else if (this.container.volume_ref.length === control.controls.length) {
      // patch with difference created elsewhere
      this.container.volume_ref.forEach((containerVolumeRef, index) => {
        control.controls[index].patchValue({ name: containerVolumeRef.volume_name, path: containerVolumeRef.path, sub_path: containerVolumeRef.sub_path, access_mode: containerVolumeRef.access_mode, id: containerVolumeRef.id });
      });

      // fire after change to avoid race condition
      this.refreshAccessModesOptions();

    }
  }

  refreshAccessModesOptions() {
    this.accessModeOptions = [];
    // iterate through the volume refs and create a array of access mode options via the realted volume
    (this.form.get('volume_ref') as FormArray).controls.forEach((volume_ref: FormGroup, index) => {
      const nameValueAccessModes = [];

      const volumeRef = this.container.volume_ref.find((volumeReference) => {
        return volumeReference.id === volume_ref.controls.id.value;
      });

      // this method is called along with other volume ref changes (like deletion)
      // if we can't find the form then it's been deleted
      if (volumeRef !== undefined) {
        const accessModes = volumeRef.access_modes;
        if (accessModes.includes('ReadOnlyMany')) {
          nameValueAccessModes.push({ name: 'Read Only Many', value: 'ReadOnlyMany' });
        }
        if (accessModes.includes('ReadWriteOnce')) {
          nameValueAccessModes.push({ name: 'Read Write Once', value: 'ReadWriteOnce' });
        }
        if (accessModes.includes('ReadWriteMany')) {
          nameValueAccessModes.push({ name: 'Read Write Many', value: 'ReadWriteMany' });
        }
        this.accessModeOptions.push(nameValueAccessModes);
      }
    });
  }
  /* ******************** */
  /* END VOLUME_REF ARRAY */
  /* ******************** */

  /* ******************* */
  /* EMPTY_DIR_REF ARRAY */
  /* ******************* */
  createEmptyDirRef(emptyDir: VolumeRef): FormGroup {
    return this.formBuilder.group({
      name: [{ value: emptyDir.volume_name, disabled: true }, [ /* add NO validations here */]],
      path: [{ value: emptyDir.path, disabled: this.isReadOnly }, [Validators.required]],
      id: [{ value: emptyDir.id, disabled: true }]
    });
  }

  loadContainerEmptyDirs() {
    const control = this.form.get('empty_dir_ref') as FormArray;

    this.container.empty_dir_ref.forEach((emptyDir: VolumeRef) => {
      // add that empty dir to the form
      const formGroup = this.createEmptyDirRef(emptyDir);
      (this.form.get('empty_dir_ref') as FormArray).push(formGroup);

      // patch the values in the empty_dir_ref on value change
      formGroup.valueChanges.subscribe((newVal) => {
        ({ path: emptyDir.path } = newVal);
      });
    });

  }

  onContainerEmptyDirChange() {
    const control = this.form.get('empty_dir_ref') as FormArray;

    // algo to calculate diffs from actions elswhere in the app, then proceede accordingly
    if (this.container.empty_dir_ref.length > control.controls.length) {
      // find the empty dir not already included byId in the empty dirs in the form
      const newEmptyDir = this.container.empty_dir_ref.find(function (emptyDir: VolumeRef) {
        const ids = [];
        control.controls.forEach((dirControl) => {
          ids.push(dirControl.get('id').value);
        });
        return ids.includes(emptyDir.id) === false;
      });
      // add that empty dir to the form
      const formGroup = this.createEmptyDirRef(newEmptyDir);
      (this.form.get('empty_dir_ref') as FormArray).push(formGroup);

      // patch the values in the empty_dir_ref on value change
      formGroup.valueChanges.subscribe((newVal) => {
        ({ path: newEmptyDir.path } = newVal);
      });
    } else if (this.container.empty_dir_ref.length < control.controls.length) {
      const ids = [];
      this.container.empty_dir_ref.forEach((containerEmptyDirRef) => {
        ids.push(containerEmptyDirRef.id);
      });

      const indexToRemove = control.controls.findIndex((formControl) => {
        const id = (formControl as FormGroup).controls.id.value;
        return !ids.includes(id);
      });

      control.removeAt(indexToRemove);

    } else if (this.container.empty_dir_ref.length === control.controls.length) {
      // patch with difference created elsewhere
      this.container.empty_dir_ref.forEach((containerEmptyDirRef, index) => {
        control.controls[index].patchValue({ name: containerEmptyDirRef.volume_name, path: containerEmptyDirRef.path, id: containerEmptyDirRef.id });
      });
    }
  }
  /* *********************** */
  /* END EMPTY_DIR_REF ARRAY */
  /* *********************** */

  /* ******************* */
  /* HOST_PATH_REF ARRAY */
  /* ******************* */
  createHostPathRef(hostPath: VolumeRef): FormGroup {
    return this.formBuilder.group({
      name: [{ value: hostPath.volume_name, disabled: true }, [ /* add NO validations here */]],
      path: [{ value: hostPath.path, disabled: this.isReadOnly }, [Validators.required]],
      id: [{ value: hostPath.id, disabled: true }]
    });
  }

  loadContainerHostPaths() {
    const control = this.form.get('host_path_ref') as FormArray;

    this.container.host_path_ref.forEach((hostPath: VolumeRef) => {
      // add that host path to the form
      const formGroup = this.createHostPathRef(hostPath);
      (this.form.get('host_path_ref') as FormArray).push(formGroup);

      // patch the values in the host_path_ref on value change
      formGroup.valueChanges.subscribe((newVal) => {
        ({ path: hostPath.path } = newVal);
      });
    });

  }

  onContainerHostPathChange() {
    const control = this.form.get('host_path_ref') as FormArray;

    // algo to calculate diffs from actions elswhere in the app, then proceede accordingly
    if (this.container.host_path_ref.length > control.controls.length) {
      // find the host path not already included by Id in the host paths in the form
      const newHostPath = this.container.host_path_ref.find(function (hostPath: VolumeRef) {
        const ids = [];
        control.controls.forEach((dirControl) => {
          ids.push(dirControl.get('id').value);
        });
        return ids.includes(hostPath.id) === false;
      });
      // add that host path to the form
      const formGroup = this.createHostPathRef(newHostPath);
      (this.form.get('host_path_ref') as FormArray).push(formGroup);

      // patch the values in the host_path_ref on value change
      formGroup.valueChanges.subscribe((newVal) => {
        ({ path: newHostPath.path } = newVal);
      });
    } else if (this.container.host_path_ref.length < control.controls.length) {
      const ids = [];
      this.container.host_path_ref.forEach((hostPathRef: VolumeRef) => {
        ids.push(hostPathRef.id);
      });

      const indexToRemove = control.controls.findIndex((formControl) => {
        const id = (formControl as FormGroup).controls.id.value;
        return !ids.includes(id);
      });

      control.removeAt(indexToRemove);

    } else if (this.container.host_path_ref.length === control.controls.length) {
      // patch with difference created elsewhere
      this.container.host_path_ref.forEach((hostPathRef: VolumeRef, index: number) => {
        control.controls[index].patchValue({ name: hostPathRef.volume_name, path: hostPathRef.path, id: hostPathRef.id });
      });
    }
  }
  /* *********************** */
  /* END HOST_PATH_REF ARRAY */
  /* *********************** */

  /* *************** */
  /* HEALTHCMD ARRAY */
  /* *************** */
  // for readiness probe
  addReadinessProbeHealthCmd(healthCmd?) {
    const defaultHealthCmd = healthCmd || '';
    const newFormControl = this.formBuilder.control(defaultHealthCmd, [
      Validators.required
    ]);

    (this.form.get('readinessProbe.healthcmd') as FormArray).push(newFormControl);
  }

  removeReadinessProbeHealthCmd(index) {
    (this.form.get('readinessProbe.healthcmd') as FormArray).removeAt(index);
  }

  // for liveness probe
  addLivenessProbeHealthCmd(healthCmd?) {
    const defaultHealthCmd = healthCmd || '';
    const newFormControl = this.formBuilder.control(defaultHealthCmd, [
      Validators.required
    ]);

    (this.form.get('livenessProbe.healthcmd') as FormArray).push(newFormControl);
  }

  removeLivenessProbeHealthCmd(index) {
    (this.form.get('livenessProbe.healthcmd') as FormArray).removeAt(index);
  }

  // for probe httpGet http header for both liveness and readinessprobe
  createProbeHttpHeader(httpHeader) {
    return this.formBuilder.group({
      key: [{ value: httpHeader.key, disabled: this.isReadOnly }, [Validators.required]],
      value: [{ value: httpHeader.value, disabled: this.isReadOnly }, [ /* validations */]]
    });
  }

  // probe type must be either 'livenessProbe' or 'readinessProbe'
  addProbeHttpHeader(probeType, httpHeader?) {
    let newHttpHeader = null;
    if (httpHeader) {
      newHttpHeader = this.createProbeHttpHeader(httpHeader);
    } else {
      newHttpHeader = this.createProbeHttpHeader({ key: '', value: '' });
    }

    (this.form.get(`${probeType}.httpGet.httpHeaders`) as FormArray).push(newHttpHeader);
  }

  removeProbeHttpHeader(probeType, headerIndex) {
    (this.form.get(`${probeType}.httpGet.httpHeaders`) as FormArray).removeAt(headerIndex);
  }
  /* ******************* */
  /* END HEALTHCMD ARRAY */
  /* ******************* */

  /* *********** */
  /* UTILITY fns */
  /* *********** */
  returnSortedArray(sortableArray: any[], sortByParam: string, ascending: boolean): Observable<any[]> {
    let arrayCopy = [];

    if (ascending) {
      arrayCopy = sortBy(sortableArray, sortByParam);
    } else {
      arrayCopy = sortBy(sortableArray, sortByParam).reverse();
    }

    return of(arrayCopy);
  }
  /* *************** */
  /* END UTILITY fns */
  /* *************** */

  initReadinessProbeForm(protocol: string): void {
    if (protocol === 'http') {
      const readinessProbe = this.form.get('readinessProbe') as FormGroup;
      const httpGet = this.formBuilder.group({
        host: [{ value: this.container.readinessProbe.httpGet.host, disabled: this.isReadOnly }, [Validators.minLength(2), CustomValidators.ipDnsValidator]],
        scheme: [{ value: this.container.readinessProbe.httpGet.scheme, disabled: this.isReadOnly }, [ /* add validations */]],
        path: [{ value: this.container.readinessProbe.httpGet.path, disabled: this.isReadOnly }, [Validators.required]],
        port: [{ value: this.container.readinessProbe.httpGet.port, disabled: this.isReadOnly }, [Validators.required, CustomValidators.numericOnly, CustomValidators.numericPortRange]],
        httpHeaders: this.formBuilder.array([])
      });

      readinessProbe.removeControl('healthcmd');
      readinessProbe.addControl('httpGet', httpGet);

      if (this.container.readinessProbe.httpGet.httpHeaders) {
        this.container.readinessProbe.httpGet.httpHeaders.forEach((httpHeader) => this.addProbeHttpHeader('readinessProbe', httpHeader));
      }

      this.form.get('readinessProbe.httpGet.host').valueChanges.subscribe((newVal) => this.container.readinessProbe.httpGet.host = newVal);
      this.form.get('readinessProbe.httpGet.port').valueChanges.subscribe((newVal) => this.container.readinessProbe.httpGet.port = newVal);
      this.form.get('readinessProbe.httpGet.scheme').valueChanges.subscribe((newVal) => this.container.readinessProbe.httpGet.scheme = newVal);
      this.form.get('readinessProbe.httpGet.path').valueChanges.subscribe((newVal) => this.container.readinessProbe.httpGet.path = newVal);
      this.form.get('readinessProbe.httpGet.httpHeaders').valueChanges.subscribe((newVal) => this.container.readinessProbe.httpGet.httpHeaders = newVal);

    } else if (protocol === 'exec') {
      const readinessProbe = this.form.get('readinessProbe') as FormGroup;
      const healthcmd = this.formBuilder.array([], CustomValidators.minLengthArray(1));

      readinessProbe.removeControl('httpGet');
      readinessProbe.addControl('healthcmd', healthcmd);

      this.container.readinessProbe.healthcmd.forEach((healthCmd) => this.addReadinessProbeHealthCmd(healthCmd));
      this.form.get('readinessProbe.healthcmd').valueChanges.subscribe((newVal) => this.container.readinessProbe.healthcmd = newVal);

    } else {

      const readinessProbe = this.form.get('readinessProbe') as FormGroup;
      readinessProbe.removeControl('httpGet');
      readinessProbe.removeControl('healthcmd');

    }


  }

  initLivenessProbeForm(protocol: string): void {
    if (protocol === 'http') {
      const livenessProbe = this.form.get('livenessProbe') as FormGroup;
      const httpGet = this.formBuilder.group({
        host: [{ value: this.container.livenessProbe.httpGet.host, disabled: this.isReadOnly }, [Validators.minLength(2), CustomValidators.ipDnsValidator]],
        scheme: [{ value: this.container.livenessProbe.httpGet.scheme, disabled: this.isReadOnly }, [ /* add validations */]],
        path: [{ value: this.container.livenessProbe.httpGet.path, disabled: this.isReadOnly }, [Validators.required]],
        port: [{ value: this.container.livenessProbe.httpGet.port, disabled: this.isReadOnly }, [Validators.required, CustomValidators.numericOnly, CustomValidators.numericPortRange]],
        httpHeaders: this.formBuilder.array([])
      });

      livenessProbe.removeControl('healthcmd');
      livenessProbe.addControl('httpGet', httpGet);

      if (this.container.livenessProbe.httpGet.httpHeaders) {
        this.container.livenessProbe.httpGet.httpHeaders.forEach((httpHeader) => this.addProbeHttpHeader('livenessProbe', httpHeader));
      }

      this.form.get('livenessProbe.httpGet.host').valueChanges.subscribe((newVal) => this.container.livenessProbe.httpGet.host = newVal);
      this.form.get('livenessProbe.httpGet.port').valueChanges.subscribe((newVal) => this.container.livenessProbe.httpGet.port = newVal);
      this.form.get('livenessProbe.httpGet.scheme').valueChanges.subscribe((newVal) => this.container.livenessProbe.httpGet.scheme = newVal);
      this.form.get('livenessProbe.httpGet.path').valueChanges.subscribe((newVal) => this.container.livenessProbe.httpGet.path = newVal);
      this.form.get('livenessProbe.httpGet.httpHeaders').valueChanges.subscribe((newVal) => this.container.livenessProbe.httpGet.httpHeaders = newVal);

    } else if (protocol === 'exec') {
      const livenessProbe = this.form.get('livenessProbe') as FormGroup;
      const healthcmd = this.formBuilder.array([], CustomValidators.minLengthArray(1));

      livenessProbe.removeControl('httpGet');
      livenessProbe.addControl('healthcmd', healthcmd);

      this.container.livenessProbe.healthcmd.forEach((healthCmd) => this.addLivenessProbeHealthCmd(healthCmd));
      this.form.get('livenessProbe.healthcmd').valueChanges.subscribe((newVal) => this.container.livenessProbe.healthcmd = newVal);

    } else {

      const livenessProbe = this.form.get('livenessProbe') as FormGroup;
      livenessProbe.removeControl('httpGet');
      livenessProbe.removeControl('healthcmd');

    }
  }


  ngOnInit() {
    /* ***************************** */
    /* CONTAINER REACTIVE FORM MODEL */
    /* ***************************** */
    this.form = this.formBuilder.group({
      name: [{ value: this.container.name, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.maxLength253,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithPeriod,
        CustomValidators.duplicateK8sNameValidator(this.editorService, 'containers')
      ]],
      description: [{ value: this.container.description, disabled: this.isReadOnly }, [ /* add validation */]],
      image: [{ value: this.container.image, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.containsSpace
      ]],
      override: [{ value: this.container.override, disabled: this.isReadOnly }, [ /* add validations */]],
      /* advanced */
      image_pull_policy: [{ value: this.container.image_pull_policy, disabled: this.isReadOnly }, [ /* dropdown - form validations not necessary */]],
      entrypoint: [{ value: this.container.entrypoint, disabled: this.isReadOnly }, [
        CustomValidators.maxLength4096
      ]],
      command: [{ value: this.container.command, disabled: this.isReadOnly }, [
        CustomValidators.maxLength4096
      ]],
      post_start: [{ value: this.container.post_start_command, disabled: this.isReadOnly }, [
        CustomValidators.maxLength4096
      ]],
      pre_stop: [{ value: this.container.pre_stop_command, disabled: this.isReadOnly }, [
        CustomValidators.maxLength4096
      ]],
      /* development_config */
      development_config: this.formBuilder.group({
        image: [{ value: this.container.development_config.image, disabled: this.isReadOnly }, [ /* add validations */]],
        tag: [{ value: this.container.development_config.tag, disabled: this.isReadOnly }, [ /* add validations */]],
        repository: [{ value: this.container.development_config.repository, disabled: this.isReadOnly }, [ /* add validations */]],
      }),
      /* external_config */
      external_config: this.formBuilder.group({
        image: [{ value: this.container.external_config.image, disabled: this.isReadOnly }, [ /* add validations */]],
        proxy_type: [{ value: this.container.external_config.proxy_type, disabled: this.isReadOnly }, [ /* add validations */]],
        server: [{ value: this.container.external_config.server, disabled: this.isReadOnly }, [ /* add validations */]]
      }),
      /* liveness probe */
      livenessProbe: this.formBuilder.group({
        interval: [{ value: this.container.livenessProbe.interval, disabled: this.isReadOnly }, [ /* add validations */]],
        retries: [{ value: this.container.livenessProbe.retries, disabled: this.isReadOnly }, [ /* add validations */]],
        timeout: [{ value: this.container.livenessProbe.timeout, disabled: this.isReadOnly }, [ /* add validations */]],
        protocol: [{ value: this.container.livenessProbe.protocol, disabled: this.isReadOnly }, [ /* add validations */]]
      }),
      /* readiness probe */
      readinessProbe: this.formBuilder.group({
        interval: [{ value: this.container.readinessProbe.interval, disabled: this.isReadOnly }, [ /* add validations */]],
        retries: [{ value: this.container.readinessProbe.retries, disabled: this.isReadOnly }, [ /* add validations */]],
        timeout: [{ value: this.container.readinessProbe.timeout, disabled: this.isReadOnly }, [ /* add validations */]],
        protocol: [{ value: this.container.readinessProbe.protocol, disabled: this.isReadOnly }, [ /* add validations */]]
      }),
      /* port mapping */
      port_mapping: this.formBuilder.array([]),
      /* environment_var */
      environment_var: this.formBuilder.array([]),
      /* config_map_ref */
      config_map_ref: this.formBuilder.array([]),
      /* volumes_ref */
      volume_ref: this.formBuilder.array([]),
      /* empty_dir_ref */
      empty_dir_ref: this.formBuilder.array([]),
      /* host_path_ref */
      host_path_ref: this.formBuilder.array([]),
      /* secret_ref */
      secret_ref: this.formBuilder.array([]),
      /* k8s_secret_ref */
      k8s_secret_ref: this.formBuilder.array([]),
      /* config_ref */
      config_ref: this.formBuilder.array([]),
      /* secret_ref that are env vars */
      env_secret_ref: this.formBuilder.array([]),
      /* field_ref that are env vars */
      env_field_ref: this.formBuilder.array([]),
      /* resource_field_ref that are env vars */
      env_resource_field_ref: this.formBuilder.array([])
      /* NOTE: YOU ADD MORE FORM FIELDS HERE, COMMENTING SECTIONS */
    });
    /* ********************************* */
    /* END CONTAINER REACTIVE FORM MODEL */
    /* ********************************* */

    /* ********************************************* */
    /* CONTAINER REACTIVE FORM VALUE CHANGE HANDLERS */
    /* ********************************************* */
    // opted to keep all these on one lines each, they're actually easier to look at that way
    // TODO: if anyone knows any better shorthand for all of these value changes please impliment it, just make sure you do all of them.
    this.form.get('name').valueChanges.subscribe((newVal) => this.container.name = newVal);
    this.form.get('description').valueChanges.subscribe((newVal) => this.container.description = newVal);
    this.form.get('image').valueChanges.subscribe((newVal) => this.container.image = newVal);
    this.form.get('override').valueChanges.subscribe((newVal) => this.container.override = newVal);
    /* advanced */
    this.form.get('image_pull_policy').valueChanges.subscribe((newVal) => this.container.image_pull_policy = newVal);
    this.form.get('command').valueChanges.subscribe((newVal) => this.container.command = newVal);
    this.form.get('post_start').valueChanges.subscribe((newVal) => this.container.post_start_command = newVal);
    this.form.get('pre_stop').valueChanges.subscribe((newVal) => this.container.pre_stop_command = newVal);
    this.form.get('entrypoint').valueChanges.subscribe((newVal) => this.container.entrypoint = newVal);
    /* development_config */
    this.form.get('development_config.image').valueChanges.subscribe((newVal) => this.container.development_config.image = newVal);
    this.form.get('development_config.tag').valueChanges.subscribe((newVal) => this.container.development_config.tag = newVal);
    this.form.get('development_config.repository').valueChanges.subscribe((newVal) => this.container.development_config.repository = newVal);
    /* external_config */
    this.form.get('external_config.image').valueChanges.subscribe((newVal) => this.container.external_config.image = newVal);
    this.form.get('external_config.proxy_type').valueChanges.subscribe((newVal) => this.container.external_config.proxy_type = newVal);
    this.form.get('external_config.server').valueChanges.subscribe((newVal) => this.container.external_config.server = newVal);
    /* liveness probe */
    this.form.get('livenessProbe.interval').valueChanges.subscribe((newVal) => this.container.livenessProbe.interval = newVal);
    this.form.get('livenessProbe.retries').valueChanges.subscribe((newVal) => this.container.livenessProbe.retries = newVal);
    this.form.get('livenessProbe.timeout').valueChanges.subscribe((newVal) => this.container.livenessProbe.timeout = newVal);
    this.form.get('livenessProbe.protocol').valueChanges.subscribe((newVal) => this.container.livenessProbe.protocol = newVal);
    /* readiness probe */
    this.form.get('readinessProbe.interval').valueChanges.subscribe((newVal) => this.container.readinessProbe.interval = newVal);
    this.form.get('readinessProbe.retries').valueChanges.subscribe((newVal) => this.container.readinessProbe.retries = newVal);
    this.form.get('readinessProbe.timeout').valueChanges.subscribe((newVal) => this.container.readinessProbe.timeout = newVal);
    this.form.get('readinessProbe.protocol').valueChanges.subscribe((newVal) => this.container.readinessProbe.protocol = newVal);
    /* environment vars */
    this.form.get('environment_var').valueChanges.subscribe((newVal) => {
      this.initializeEnvVarModal();
    });

    /* port_mapping */
    // find the PORTS ARRAY section elsewhere in this file
    /* environment_var */
    // find the ENVIRONMENTS VAR ARRAY section elsewhere in this file
    /* NOTE: YOU ADD MORE VALUE CHANGE HANDLERS HERE, MODESTLY COMMENTING SECTIONS */
    /* ************************************************* */
    /* END CONTAINER REACTIVE FORM VALUE CHANGE HANDLERS */
    /* ************************************************* */

    /* ************************** */
    /* SETUP READINESS PROBE FORM */
    /* ************************** */
    this.initReadinessProbeForm(this.form.get('readinessProbe.protocol').value);
    this.form.get('readinessProbe.protocol').valueChanges.subscribe((newVal) => {
      this.initReadinessProbeForm(this.form.get('readinessProbe.protocol').value);
    });

    /* ************************* */
    /* SETUP LIVENESS PROBE FORM */
    /* ************************* */
    this.initLivenessProbeForm(this.form.get('livenessProbe.protocol').value);
    this.form.get('livenessProbe.protocol').valueChanges.subscribe((newVal) => {
      this.initLivenessProbeForm(this.form.get('livenessProbe.protocol').value);
    });

    /* ************************************** */
    /* LOAD INCOMING FORM ARRAY ITEMS ON LOAD */
    /* ************************************** */

    this.container.port_mapping.forEach((portMapping) => this.addPortMapping(portMapping));
    this.container.environment_var.forEach((environmentVar) => this.addEnvironmentVar(environmentVar));
    this.container.environment_var_config_ref.forEach((envVarConfigRef) => this.addConfigMapRef(envVarConfigRef));
    this.container.environment_var_secret_ref.forEach((envVarSecretRef) => this.addEnvSecretRef(envVarSecretRef));
    this.container.environment_var_field_ref.forEach((envVarFieldRef) => this.addFieldRef(envVarFieldRef));
    this.container.environment_var_resource_field_ref.forEach((envVarResourceFieldRef) => this.addResourceFieldRef(envVarResourceFieldRef));
    this.container.k8s_secret_ref.forEach((secretRef) => this.addSecretRef(secretRef));
    this.container.config_ref.forEach((configRef) => this.addConfigRef(configRef));
    // we can listen to the entire value of healthCmd rather than deconstructing it since we want an array of strings

    this.loadContainerEmptyDirs();
    this.loadContainerHostPaths();
    this.loadContainerVolumeRefs();
    this.initializeEnvVarModal();

    /* ****************************************** */
    /* SET DIRTY FLAG ONCE FORM HAS VALUE CHANGES */
    /* ****************************************** */
    this.form.valueChanges.subscribe(() => {
      if (this.form.dirty) {
        this.editorService.dirty = this.form.dirty;
      }

      // this name of this fn is misleading. We report validity on every form change in order to report freshly vlidated forms
      this.editorService.reportInvalidForm(this.container.id, this.form.invalid);
      // refresh services on container changes
      this.container.refreshObjectsByType(Service.OBJECT_NAME);
    });

    this.form.get('name').updateValueAndValidity();

    this.editorEventService.onContainerVolumeChange.subscribe((event: ContainerVolumeChangedEvent) => {
      // ignore events we don't care about
      if (event.container.id === this.container.id) {
        this.onContainerVolumeChange();
      }
    });
    this.refreshAccessModesOptions();
    // refresh access mode options once we determine a volume has changed
    this.container.onRefresh.subscribe((value: boolean) => {
      this.refreshAccessModesOptions();
    });
    this.editorEventService.onContainerEmptyDirChange.subscribe((event: ContainerVolumeChangedEvent) => {
      // ignore events we don't care about
      if (event.container.id === this.container.id) {
        this.onContainerEmptyDirChange();
      }
    });
    this.editorEventService.onContainerHostPathChange.subscribe((event: ContainerVolumeChangedEvent) => {
      // ignore events we don't care about
      if (event.container.id === this.container.id) {
        this.onContainerHostPathChange();
      }
    });

    /**
     * remove a secret_ref from the container's form if that
     * secret_refs assocaited volume is removed in the model
     */
    this.editorEventService.onAppSecretChange.subscribe(() => {
      const secret_ref_form_array = this.form.get('k8s_secret_ref') as FormArray;
      secret_ref_form_array.controls.forEach((k8s_secret_ref, index) => {
        const secretExistsInVolumeMap = this.container.secret_volume_map.find((volume_map) => {
          return volume_map.value === k8s_secret_ref.value.secret_volume;
        });

        if (!secretExistsInVolumeMap) {
          this.removeSecretRef(index);
        }

      });

    });

    this.editorEventService.onSelectionChange.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });

  }

}
