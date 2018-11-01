import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

import { ContainerGroup } from '../../../../models/common/ContainerGroup';
import { CustomValidators } from '../../../../shared/validators/custom-validators.validators';
import { Label } from '../../../../models/common/Label';
import { TopLabel } from '../../../../models/k8s/TopLabel';
import { EditorService } from '../../../editor.service';
import { EditorEventService } from '../../../editor-event.service';
import { NameChangeEvent, ValueChangeEvent } from '../../../../models/Events';
import { Container } from '../../../../models/common/Container';
import { NameStringValue } from '../../../../models/common/Generic';

const STATEFUL_SERVICE_NAME = 'StatefulSet requires a service.';
const AT_LEAST_ONE_CONTAINER = 'Controller requires at least one container.';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-pod-container',
  templateUrl: './pod-container.component.html',
  styleUrls: ['./pod-container.component.css']
})
export class PodContainerComponent implements OnInit {
  @Input() pod: ContainerGroup;

  form: FormGroup;
  isReadOnly = false;
  showBulkLabelDialog = false;
  showBulkTopLabelDialog = false;
  externalErrors: string[] = [];
  service_name_options: NameStringValue[];

  constructor(
    private formBuilder: FormBuilder,
    private editorService: EditorService,
    private editorEventService: EditorEventService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  /* *********** */
  /* LABEL ARRAY */
  /* *********** */

  recreateLabels(): void {
    const formArray = this.form.get('label') as FormArray;
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    this.pod.label.forEach((label: Label) => this.addLabel(label));
  }

  // create a new label formGroup
  createLabel(label: Label): FormGroup {
    return this.formBuilder.group({
      key: [{ value: label.key, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.lowercaseAlphaNumericDashPeriodSlash,
        CustomValidators.containsDoublePeriod,
        CustomValidators.containsDoubleDash
      ]],
      value: [{ value: label.value, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.alphaNumericDashPeriod
      ]],
      id: [{ value: label.id, disabled: true }]
    });
  }

  // create label formGroup and add formGroup to the form object and subscribe to changes for the pod
  addLabel(label?: Label): void {
    if (label === undefined) {
      label = new Label();
      label.key = '', label.value = '';
      this.pod.addLabel(label);
      this.editorService.dirty = true;
    }

    const formGroup = this.createLabel(label);
    (this.form.get('label') as FormArray).push(formGroup);

    formGroup.valueChanges.subscribe((newVal) => {
      ({ key: label.key, value: label.value } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddContainerGroupLabel');
  }

  // remove a label, by index, from the form object and from the pod by uuid
  removeLabel(formIndex: number): void {
    const labelControl = this.form.get('label') as FormArray;
    const uuid = (labelControl.at(formIndex) as FormGroup).controls.id.value;
    this.pod.removeLabel(uuid);
    this.editorService.dirty = true;
    labelControl.removeAt(formIndex);
  }

  // iterate through and remove all labels, then add labels in nameValuePairArray
  handleBulkLabelReplace(nameValuePairArray: string[][]): void {
    while (this.pod.label.length > 0) {
      this.removeLabel(this.pod.label.length - 1);
    }
    this.handleBulkLabelAppend(nameValuePairArray);
    this.editorService.dirty = true;
  }

  // add labels in nameValuePairArray
  handleBulkLabelAppend(nameValuePairArray: string[][]): void {
    nameValuePairArray.forEach((nameValuePair) => {
      const label = new Label();
      label.key = nameValuePair[0];
      label.value = nameValuePair[1];
      this.pod.addLabel(label);
      this.addLabel(label);
    });

    this.showBulkLabelDialog = !this.showBulkLabelDialog;
  }
  /* *************** */
  /* END LABEL ARRAY */
  /* *************** */

  /* *************** */
  /* TOP LABEL ARRAY */
  /* *************** */
  createTopLabel(label: TopLabel): FormGroup {
    return this.formBuilder.group({
      key: [{ value: label.key, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.lowercaseAlphaNumericDashPeriodSlash,
        CustomValidators.containsDoublePeriod,
        CustomValidators.containsDoubleDash
      ]],
      value: [{ value: label.value, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.alphaNumericDashPeriod
      ]],
      id: [{ value: label.id, disabled: true }]
    });
  }
  addTopLabel(label?: TopLabel): void {
    if (label === undefined) {
      label = new TopLabel();
      label.key = '', label.value = '';
      this.pod.addTopLabel(label);
      this.editorService.dirty = true;
    }

    const formGroup = this.createTopLabel(label);
    (this.form.get('top_label') as FormArray).push(formGroup);

    formGroup.valueChanges.subscribe((newVal) => {
      ({ key: label.key, value: label.value } = newVal);
    });
  }
  removeTopLabel(formIndex: number): void {
    const labelControl = this.form.get('top_label') as FormArray;
    const uuid = (labelControl.at(formIndex) as FormGroup).controls.id.value;
    this.pod.removeTopLabel(uuid);
    this.editorService.dirty = true;
    labelControl.removeAt(formIndex);
  }
  // iterate through and remove all labels, then add labels in nameValuePairArray
  handleBulkTopLabelReplace(nameValuePairArray: string[][]): void {
    while (this.pod.top_label.length > 0) {
      this.removeTopLabel(this.pod.top_label.length - 1);
    }
    this.handleBulkTopLabelAppend(nameValuePairArray);
  }

  // add labels in nameValuePairArray
  handleBulkTopLabelAppend(nameValuePairArray: string[][]): void {
    nameValuePairArray.forEach((nameValuePair) => {
      const topLabel = new TopLabel();
      topLabel.key = nameValuePair[0];
      topLabel.value = nameValuePair[1];
      this.pod.addTopLabel(topLabel);
      this.addTopLabel(topLabel);
    });

    this.showBulkTopLabelDialog = !this.showBulkTopLabelDialog;
  }
  /* ******************* */
  /* END TOP LABEL ARRAY */
  /* ******************* */

  /* ***************** */
  /* EXTRA HOSTS ARRAY */
  /* ***************** */
  createExtraHost(extraHost: string): FormControl {
    return this.formBuilder.control({ value: extraHost, disabled: this.isReadOnly }, [
      Validators.required
    ]);
  }
  addExtraHost(extraHost?: string): void {
    if (extraHost === undefined) {
      extraHost = '';
    }

    const formControl = this.createExtraHost(extraHost);
    (this.form.get('extra_hosts') as FormArray).push(formControl);

    formControl.valueChanges.subscribe((newVal) => {
      const newExtra_HostsArray = [];
      (this.form.get('extra_hosts') as FormArray).controls.forEach((extraHostFormControl) => {
        newExtra_HostsArray.push(extraHostFormControl.value);
      });
      this.pod.extra_hosts = newExtra_HostsArray;
      this.editorService.dirty = true;
    });
  }
  removeExtraHost(formIndex: number): void {
    this.pod.extra_hosts.splice(formIndex, 1);
    (this.form.get('extra_hosts') as FormArray).removeAt(formIndex);
  }
  /* ********************* */
  /* END EXTRA HOSTS ARRAY */
  /* ********************* */

  /* ************************ */
  /* IMAGE PULL SECRETS ARRAY */
  /* ************************ */
  createImagePullSecret(imagePullSecret: string): FormControl {
    return this.formBuilder.control({ value: imagePullSecret, disabled: this.isReadOnly }, [
      Validators.required
    ]);
  }
  addImagePullSecret(imagePullSecret?: string): void {
    if (imagePullSecret === undefined) {
      imagePullSecret = '';
    }

    const formControl = this.createExtraHost(imagePullSecret);
    (this.form.get('image_pull_secrets') as FormArray).push(formControl);

    formControl.valueChanges.subscribe((newVal) => {
      const newImagePullSecretsArray = [];
      (this.form.get('image_pull_secrets') as FormArray).controls.forEach((imagePullSecretFormControl) => {
        newImagePullSecretsArray.push(imagePullSecretFormControl.value);
      });
      this.pod.image_pull_secrets = newImagePullSecretsArray;
      this.editorService.dirty = true;
    });
  }
  removeImagePullSecret(formIndex: number): void {
    this.pod.image_pull_secrets.splice(formIndex, 1);
    (this.form.get('image_pull_secrets') as FormArray).removeAt(formIndex);
  }
  /* **************************** */
  /* END IMAGE PULL SECRETS ARRAY */
  /* **************************** */

  /* ******************************** */
  /* FORM ADDITIONS BASED ON POD TYPE */
  /* ******************************** */
  initStatefulSet() {
    const statefulSetForm = this.formBuilder.group({
      service_name: [{ value: this.pod.deployment_spec.service_name, disabled: this.isReadOnly }, [Validators.required, CustomValidators.containsSelectAService]],
      grace_period: [{ value: this.pod.deployment_spec.termination_grace_period, disabled: this.isReadOnly }, [ /* is HTML number input - may not require validtions */]],
      update_strategy: [{ value: this.pod.deployment_spec.update_strategy, disabled: this.isReadOnly }, [ /* dropdown, validations not needed */]],
      partition: [{ value: this.pod.deployment_spec.partition, disabled: this.isReadOnly }, [ /* validations */]],
      revisionHistoryLimit: [{ value: this.pod.deployment_spec.revisionHistoryLimit, disabled: this.isReadOnly }, [ CustomValidators.numericZeroOrGreater ]],
      pod_management: [{ value: this.pod.deployment_spec.pod_management_policy, disabled: this.isReadOnly }, [ /* dropdown, validations not needed */]],
      restart: [{ value: this.pod.restart, disabled: this.isReadOnly }, [ /* dropdown, validations not needed */]]
    });
    // add formControl to form then listen for value changes, in that order, repeated for each new formContorl
    this.form.addControl('service_name', (statefulSetForm.get('service_name') as FormControl));
    this.form.get('service_name').valueChanges.subscribe((newVal) => this.pod.deployment_spec.service_name = newVal);
    this.form.addControl('grace_period', (statefulSetForm.get('grace_period') as FormControl));
    this.form.get('grace_period').valueChanges.subscribe((newVal) => this.pod.deployment_spec.termination_grace_period = newVal);
    this.form.addControl('update_strategy', (statefulSetForm.get('update_strategy') as FormControl));
    this.form.get('update_strategy').valueChanges.subscribe((newVal) => this.pod.deployment_spec.update_strategy = newVal);
    this.form.addControl('partition', (statefulSetForm.get('partition') as FormControl));
    this.form.get('partition').valueChanges.subscribe((newVal) => this.pod.deployment_spec.revisionHistoryLimit = newVal);
    this.form.addControl('revisionHistoryLimit', (statefulSetForm.get('revisionHistoryLimit') as FormControl));
    this.form.get('revisionHistoryLimit').valueChanges.subscribe((newVal) => this.pod.deployment_spec.revisionHistoryLimit = newVal);
    this.form.addControl('pod_management', (statefulSetForm.get('pod_management') as FormControl));
    this.form.get('pod_management').valueChanges.subscribe((newVal) => this.pod.deployment_spec.pod_management_policy = newVal);
    this.form.addControl('restart', (statefulSetForm.get('restart') as FormControl));
    this.form.get('restart').valueChanges.subscribe((newVal) => this.pod.restart = newVal);
    this.service_name_options = this.editorService.returnServiceMapByContainerGroupId(this.pod.id);

    this.editorEventService.onServiceModelOnRefresh.subscribe(() => {
      this.service_name_options = this.editorService.returnServiceMapByContainerGroupId(this.pod.id);
      this.form.get('service_name').setValue(this.pod.deployment_spec.service_name);

      this.editorService.reportInvalidForm(this.pod.id, this.form.invalid || this.externalErrors.length > 0);
    });
  }

  initDeployment() {
    const deploymentForm = this.formBuilder.group({
      update_strategy: [{ value: this.pod.deployment_spec.update_strategy, disabled: this.isReadOnly }, [ /* dropdown, validations not needed */]],
      maxSurge: [{ value: this.pod.deployment_spec.maxSurge, disabled: this.isReadOnly }, [CustomValidators.numericAndPercentOnly]],
      maxUnavailable: [{ value: this.pod.deployment_spec.maxUnavailable, disabled: this.isReadOnly }, [CustomValidators.numericAndPercentOnly]],
      revisionHistoryLimit: [{ value: this.pod.deployment_spec.revisionHistoryLimit, disabled: this.isReadOnly }, [CustomValidators.numericZeroOrGreater]]
    });

    this.form.addControl('update_strategy', (deploymentForm.get('update_strategy') as FormControl));
    this.form.get('update_strategy').valueChanges.subscribe((newVal) => this.pod.deployment_spec.update_strategy = newVal);
    this.form.addControl('maxSurge', (deploymentForm.get('maxSurge') as FormControl));
    this.form.get('maxSurge').valueChanges.subscribe((newVal) => this.pod.deployment_spec.maxSurge = newVal);
    this.form.addControl('maxUnavailable', (deploymentForm.get('maxUnavailable') as FormControl));
    this.form.get('maxUnavailable').valueChanges.subscribe((newVal) => this.pod.deployment_spec.maxUnavailable = newVal);
    this.form.addControl('revisionHistoryLimit', (deploymentForm.get('revisionHistoryLimit') as FormControl));
    this.form.get('revisionHistoryLimit').valueChanges.subscribe((newVal) => this.pod.deployment_spec.revisionHistoryLimit = newVal);
  }

  initCronJob() {
    const cronJobForm = this.formBuilder.group({
      backoffLimit: [{ value: this.pod.cronjob_data.backoffLimit, disabled: this.isReadOnly }, [Validators.required, CustomValidators.numericOneOrGreater]],
      activeDeadlineSeconds: [{ value: this.pod.cronjob_data.activeDeadlineSeconds, disabled: this.isReadOnly }, [Validators.required, CustomValidators.numericOneOrGreater]],
      startingDeadlineSeconds: [{ value: this.pod.cronjob_data.startingDeadlineSeconds, disabled: this.isReadOnly }, [CustomValidators.numericOneOrGreater]],
      completions: [{ value: this.pod.cronjob_data.completions, disabled: this.isReadOnly }, [CustomValidators.numericOneOrGreater]],
      parallelism: [{ value: this.pod.cronjob_data.parallelism, disabled: this.isReadOnly }, [CustomValidators.numericOneOrGreater]],
      concurrencyPolicy: [{ value: this.pod.cronjob_data.concurrencyPolicy, disabled: this.isReadOnly }, [ /* dropdown, no validations */]],
      schedule: [{ value: this.pod.cronjob_data.schedule, disabled: this.isReadOnly }, [Validators.required, CustomValidators.cronTimeValidator]],
      restart: [{ value: this.pod.restart, disabled: this.isReadOnly }, [ /* dropdown, validations not needed */]]
    });

    this.form.addControl('backoffLimit', (cronJobForm.get('backoffLimit') as FormControl));
    this.form.get('backoffLimit').valueChanges.subscribe((newVal) => this.pod.cronjob_data.backoffLimit = newVal);
    this.form.addControl('activeDeadlineSeconds', (cronJobForm.get('activeDeadlineSeconds') as FormControl));
    this.form.get('activeDeadlineSeconds').valueChanges.subscribe((newVal) => this.pod.cronjob_data.activeDeadlineSeconds = newVal);
    this.form.addControl('startingDeadlineSeconds', (cronJobForm.get('startingDeadlineSeconds') as FormControl));
    this.form.get('startingDeadlineSeconds').valueChanges.subscribe((newVal) => this.pod.cronjob_data.startingDeadlineSeconds = newVal);
    this.form.addControl('completions', (cronJobForm.get('completions') as FormControl));
    this.form.get('completions').valueChanges.subscribe((newVal) => this.pod.cronjob_data.completions = newVal);
    this.form.addControl('parallelism', (cronJobForm.get('parallelism') as FormControl));
    this.form.get('parallelism').valueChanges.subscribe((newVal) => this.pod.cronjob_data.parallelism = newVal);
    this.form.addControl('concurrencyPolicy', (cronJobForm.get('concurrencyPolicy') as FormControl));
    this.form.get('concurrencyPolicy').valueChanges.subscribe((newVal) => this.pod.cronjob_data.concurrencyPolicy = newVal);
    this.form.addControl('schedule', (cronJobForm.get('schedule') as FormControl));
    this.form.get('schedule').valueChanges.subscribe((newVal) => this.pod.cronjob_data.schedule = newVal);
    this.form.removeControl('replicas');
    this.form.addControl('restart', (cronJobForm.get('restart') as FormControl));
    this.form.get('restart').valueChanges.subscribe((newVal) => this.pod.restart = newVal);
  }

  initDaemonSet() {
    this.form.removeControl('replicas');
    const daemonsetForm = this.formBuilder.group({
      revisionHistoryLimit: [{ value: this.pod.deployment_spec.revisionHistoryLimit, disabled: this.isReadOnly }, [CustomValidators.numericZeroOrGreater]],
    });

    this.form.addControl('revisionHistoryLimit', (daemonsetForm.get('revisionHistoryLimit') as FormControl));
    this.form.get('revisionHistoryLimit').valueChanges.subscribe((newVal) => this.pod.deployment_spec.revisionHistoryLimit = newVal);

  }
  /* ************************************ */
  /* END FORM ADDITIONS BASED ON POD TYPE */
  /* ************************************ */

  handleInitReorder(array: string[]) {
    let counter = 0;
    let tempContainer: Container;
    array.forEach(element => {
      tempContainer = this.pod.init_containers.find(x => x.name === element);
      tempContainer.position = counter++;
    });
    // Change positions in the array to new positions
    this.pod.onRefresh.emit(true);
  }

  ngOnInit() {
    /* ***************************** */
    /* CONTAINER REACTIVE FORM MODEL */
    /* ***************************** */
    this.form = this.formBuilder.group({
      name: [{ value: this.pod.name, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.maxLength253,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithPeriod,
        CustomValidators.duplicateK8sNameValidator(this.editorService, 'containerGroups')
      ]],
      description: [{ value: this.pod.description, disabled: this.isReadOnly }, [ /* add validations */]],
      id: [{ value: this.pod.id, disabled: true }, [ /* read only - no validations */]],
      replicas: [{ value: this.pod.deployment_spec.count, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.numericOneOrGreater
      ]],
      service_account_name: [{ value: this.pod.deployment_spec.service_account_name, disabled: this.isReadOnly }, [
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.maxLength253
      ]],
      /* label */
      label: this.formBuilder.array([]),
      /* top label */
      top_label: this.formBuilder.array([]),
      /* extra hosts */
      extra_hosts: this.formBuilder.array([]),
      /* image pull secrets */
      image_pull_secrets: this.formBuilder.array([])
      /* NOTE: YOU ADD MORE FORM FIELDS HERE, COMMENTING SECTIONS */
    });
    /* ********************************* */
    /* END CONTAINER REACTIVE FORM MODEL */
    /* ********************************* */

    /* *************************************** */
    /* POD REACTIVE FORM VALUE CHANGE HANDLERS */
    /* *************************************** */
    this.form.get('name').valueChanges.subscribe((newVal) => this.pod.name = newVal);
    this.form.get('description').valueChanges.subscribe((newVal) => this.pod.description = newVal);
    this.form.get('replicas').valueChanges.subscribe((newVal) => this.pod.deployment_spec.count = newVal);
    this.form.get('service_account_name').valueChanges.subscribe((newVal) => this.pod.deployment_spec.service_account_name = newVal);
    /* label */
    // find the LABEL ARRAY section elsewhere in this file
    /* top label */
    // find the TOP LABEL ARRAY section elsewhere in this file
    /* extra hosts */
    // find the EXTRA HOSTS ARRAY section elsewhere in this file
    /* ******************************************* */
    /* END POD REACTIVE FORM VALUE CHANGE HANDLERS */
    /* ******************************************* */

    /* ************************************** */
    /* LOAD INCOMING FORM ARRAY ITEMS ON LOAD */
    /* ************************************** */
    this.pod.label.forEach((label) => this.addLabel(label));
    this.pod.top_label.forEach((label) => this.addTopLabel(label));
    this.pod.extra_hosts.forEach((extraHost) => this.addExtraHost(extraHost));
    this.pod.image_pull_secrets.forEach((imagePullSecret) => this.addImagePullSecret(imagePullSecret));
    /* ****************************************** */
    /* END LOAD INCOMING FORM ARRAY ITEMS ON LOAD */
    /* ****************************************** */

    /* ********************************* */
    /* ADD FORM FIELDS BASED ON POD TYPE */
    /* ********************************* */
    if (this.pod.controller_type === 'StatefulSet') {
      this.initStatefulSet();
    } else if (this.pod.controller_type === 'Deployment') {
      this.initDeployment();
    } else if (this.pod.controller_type === 'CronJob') {
      this.initCronJob();
    } else if (this.pod.controller_type === 'DaemonSet') {
      this.initDaemonSet();
    }
    /* ************************************* */
    /* END ADD FORM FIELDS BASED ON POD TYPE */
    /* ************************************* */

    /* ****************************************** */
    /* SET DIRTY FLAG ONCE FORM HAS VALUE CHANGES */
    /* ****************************************** */
    this.form.valueChanges.subscribe(() => {
      if (this.form.dirty) {
        this.editorService.dirty = this.form.dirty;
      }

      // this name of this fn is misleading. We report validity on every form change in order to report freshly vlidated forms
      this.editorService.reportInvalidForm(this.pod.id, this.form.invalid || this.externalErrors.length > 0);
    });

    this.form.get('label').valueChanges.subscribe(() => {
      this.editorEventService.onPodLabelsChanged.next(this.pod);
    });
    /* ********************************************** */
    /* END SET DIRTY FLAG ONCE FORM HAS VALUE CHANGES */
    /* ********************************************** */

    this.form.get('name').updateValueAndValidity();
    this.checkContainerCountChange();
    this.pod.onContainerCountChange.subscribe((event: ValueChangeEvent) => {
      this.checkContainerCountChange();
    });

    // This is to fix stateful set being deleted on the canvas
    // and still returning external errors and disabling the
    // save button even when it has been deleted. This happens
    // because the service array is updated that stateful set
    // uses for service name. The service name field value is
    // then reset which causes form changes, which then causes
    // the external validator to run. I have cleared the external
    // errors on deletion of a container group and disabled the
    // form for the container group so it cannot return errors
    this.pod.onContainerGroupDelete.subscribe((id: string) => {
      this.externalErrors = this.externalErrors.filter((s) => s !== AT_LEAST_ONE_CONTAINER);
      this.form.disable();
    });

    this.pod.onRefresh.subscribe((value: boolean) => {
      this.recreateLabels();
    });

  }

  checkContainerCountChange(): void {
    if (this.pod.container_count === 0) {
      // Fixes a bug where container count errors were stacking when adding
      // or removing init containers with no other containers in the container group
      if (this.externalErrors.find(x => x === 'Controller requires at least one container.') === undefined) {
        this.externalErrors.push(AT_LEAST_ONE_CONTAINER);
      }
    } else {
      this.externalErrors = this.externalErrors.filter((s) => s !== AT_LEAST_ONE_CONTAINER);
    }
    this.editorService.reportInvalidForm(this.pod.id, this.form.invalid || this.externalErrors.length > 0);
    this.changeDetectorRef.markForCheck();
  }

}
