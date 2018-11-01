import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Ingress, IngressBackend, IngressTLS, IngressRule, IngressPath } from '../../../../models/k8s/Ingress';
import { Label } from '../../../../models/common/Label';
import { NameValuePairRaw } from '../../../../models/YipeeFileRaw';
import { EditorService } from '../../../editor.service';
import { EditorEventService } from '../../../editor-event.service';
import { PortMapping } from '../../../../models/common/PortMapping';
import { CustomValidators } from '../../../../shared/validators/custom-validators.validators';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-ingress-container',
  templateUrl: './k8s-ingress-container.component.html',
  styleUrls: ['./k8s-ingress-container.component.css']
})
export class K8sIngressContainerComponent implements OnInit {
  @Input() ingress: Ingress;

  form: FormGroup;
  isReadOnly = false;

  constructor(
    private formBuilder: FormBuilder,
    private editorService: EditorService,
    private editorEventService: EditorEventService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  /* ************ */
  /* LABELS ARRAY */
  /* ************ */

  recreateLabels(): void {
    const formArray = this.form.get('labels') as FormArray;
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    this.ingress.labels.forEach((label: Label) => this.addLabel(label));
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
        Validators.required
      ]],
      id: [{ value: label.id, disabled: true }]
    });
  }

  // create label formGroup and add formGroup to the form object and subscribe to changes for the pod
  addLabel(label?: Label): void {
    if (label === undefined) {
      label = new Label();
      label.key = '', label.value = '';
      this.ingress.addLabel(label);
      this.editorService.dirty = true;
    }

    const formGroup = this.createLabel(label);
    (this.form.get('labels') as FormArray).push(formGroup);

    formGroup.valueChanges.subscribe((newVal) => {
      ({ key: label.key, value: label.value } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddIngressGroupLabel');
  }

  // remove a label, by index, from the form object and from the pod by uuid
  removeLabel(formIndex: number): void {
    const labelControl = this.form.get('labels') as FormArray;
    const uuid = (labelControl.at(formIndex) as FormGroup).controls.id.value;
    this.ingress.removeLabel(uuid);
    this.editorService.dirty = true;
    labelControl.removeAt(formIndex);
  }

  /* **************** */
  /* END LABELS ARRAY */
  /* **************** */

  /* ***************** */
  /* ANNOTATIONS ARRAY */
  /* ***************** */

  recreateAnnotations(): void {
    const formArray = this.form.get('annotations') as FormArray;
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    this.ingress.annotations.forEach((label: Label) => this.addAnnotation(label));
  }

  // create a new label formGroup
  createAnnotation(label: Label): FormGroup {
    return this.formBuilder.group({
      key: [{ value: label.key, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.lowercaseAlphaNumericDashPeriodSlash,
        CustomValidators.containsDoublePeriod,
        CustomValidators.containsDoubleDash
      ]],
      value: [{ value: label.value, disabled: this.isReadOnly }, [
        Validators.required
      ]],
      id: [{ value: label.id, disabled: true }]
    });
  }

  // create label formGroup and add formGroup to the form object and subscribe to changes for the pod
  addAnnotation(label?: Label): void {
    if (label === undefined) {
      label = new Label();
      label.key = '', label.value = '';
      this.ingress.addAnnotation(label);
      this.editorService.dirty = true;
    }

    const formGroup = this.createAnnotation(label);
    (this.form.get('annotations') as FormArray).push(formGroup);

    formGroup.valueChanges.subscribe((newVal) => {
      ({ key: label.key, value: label.value } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddIngressAnnotation');
  }

  // remove a label, by index, from the form object and from the pod by uuid
  removeAnnotation(formIndex: number): void {
    const labelControl = this.form.get('annotations') as FormArray;
    const uuid = (labelControl.at(formIndex) as FormGroup).controls.id.value;
    this.ingress.removeAnnotation(uuid);
    this.editorService.dirty = true;
    labelControl.removeAt(formIndex);
  }

  /* ********************* */
  /* END ANNOTATIONS ARRAY */
  /* ********************* */

  /* ********* */
  /* TLS ARRAY */
  /* ********* */

  recreateTls(): void {
    const formArray = this.form.get('tls') as FormArray;
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    this.ingress.tls.forEach((tls: IngressTLS) => this.addTLS(tls));
  }

  // create a new label formGroup
  createTLS(tls: IngressTLS): FormGroup {
    return this.formBuilder.group({
      secret_name: [{ value: tls.secret_name, disabled: this.isReadOnly }, [
        CustomValidators.containsSpace,
      ]],
      hosts: [{ value: tls.hosts, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.tlsHostsDnsValidator
      ]],
      id: [{ value: tls.id, disabled: true }]
    });
  }

  // create label formGroup and add formGroup to the form object and subscribe to changes for the pod
  addTLS(tls?: IngressTLS): void {
    if (tls === undefined) {
      tls = new IngressTLS();
      this.ingress.addTLS(tls);
      this.editorService.dirty = true;
    }

    const formGroup = this.createTLS(tls);

    (this.form.get('tls') as FormArray).push(formGroup);

    formGroup.valueChanges.subscribe((newVal) => {
      ({ secret_name: tls.secret_name, hosts: tls.hosts } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddIngressTLS');

  }

  // remove a tls, by index, from the form object
  removeTLS(formIndex: number): void {
    const tlsControl = this.form.get('tls') as FormArray;
    const uuid = (tlsControl.at(formIndex) as FormGroup).controls.id.value;
    this.ingress.removeTLS(uuid);
    this.editorService.dirty = true;
    tlsControl.removeAt(formIndex);
  }

  /* ************* */
  /* END TLS ARRAY */
  /* ************* */

  /* *********** */
  /* RULES ARRAY */
  /* *********** */

  recreateRule(): void {
    const formArray = this.form.get('rule') as FormArray;
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    this.ingress.rules.forEach((rule: IngressRule) => this.addRule(rule));
  }

  // create a new label formGroup
  createRule(rule: IngressRule): FormGroup {
    return this.formBuilder.group({
      host: [{ value: rule.host, disabled: this.isReadOnly }, [
        CustomValidators.dnsValidator
      ]],
      paths: this.formBuilder.array([]),
      id: [{ value: rule.id, disabled: false }]
    });
  }

  // create label formGroup and add formGroup to the form object and subscribe to changes for the pod
  addRule(rule?: IngressRule): void {
    if (rule === undefined) {
      rule = new IngressRule();
      this.ingress.addRule(rule);
      this.editorService.dirty = true;
    }

    const formGroup = this.createRule(rule);

    if (rule.paths.length > 0) {
      rule.paths.forEach((path) => {
        const newPath = this.addExistingPath(path);
        (formGroup.controls.paths as FormArray).push(newPath);
      });
    }

    (this.form.get('rule') as FormArray).push(formGroup);

    formGroup.valueChanges.subscribe((newVal) => {
      ({ host: rule.host } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddIngressRule');

  }

  // remove a rule, by index, from the form object
  removeRule(formIndex: number): void {
    const ruleControl = this.form.get('rule') as FormArray;
    const uuid = (ruleControl.at(formIndex) as FormGroup).controls.id.value;
    this.ingress.removeRule(uuid);
    this.editorService.dirty = true;
    ruleControl.removeAt(formIndex);
    this.setBackendValidators();
  }

  /* *************** */
  /* END RULES ARRAY */
  /* *************** */

  /* *********** */
  /* PATHS ARRAY */
  /* *********** */

  // recreatePath(): void {
  //   const ruleArray = this.form.get('rules') as FormArray;
  //   const pathArray = ruleArray.get('paths') as FormArray;
  //   while (pathArray.length !== 0) {
  //     pathArray.removeAt(0);
  //   }
  //   this.ingress.rules.forEach((rule: IngressRule) => this.addRule(rule));
  // }

  // create a new label formGroup
  createPath(path: IngressPath): FormGroup {
    return this.formBuilder.group({
      path: [{ value: path.path, disabled: this.isReadOnly }, [ /* no validators */]],
      service: [{ value: path.service_id, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.containsSelectAService
      ]],
      port: [{ value: path.service_port, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.numericPortRangeIncludesZero
      ]],
      id: [{ value: path.id, disabled: false }]
    });
  }

  // create path formGroup and add formGroup to the form object and subscribe to changes
  addExistingPath(path: IngressPath): FormGroup {
    const formGroup = this.createPath(path);

    formGroup.valueChanges.subscribe((newVal) => {
      ({ path: path.path, port: path.service_port, service: path.service_id } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddIngresspath');
    this.setBackendValidators();
    return formGroup;
  }

  // create path formGroup and add formGroup to the form object and subscribe to changes
  addNewPath(ruleIndex: number): void {
    const path = new IngressPath();
    path.service_id = '-- Select a service --';
    this.ingress.rules[ruleIndex].paths.push(path);
    this.editorService.dirty = true;

    const formGroup = this.createPath(path);

    const ruleArray = (this.form.get('rule') as FormArray);
    const pathArray = (ruleArray.controls[ruleIndex].get('paths') as FormArray);
    pathArray.push(formGroup);

    // ((this.form.get('rule') as FormArray).get('paths') as FormArray).push(formGroup);

    formGroup.valueChanges.subscribe((newVal) => {
      ({ path: path.path, port: path.service_port, service: path.service_id } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddIngresspath');
    this.setBackendValidators();

  }

  // remove a tls, by index, from the form object
  removePath(object: any): void {
    const ruleArray = (this.form.get('rule') as FormArray);
    const pathArray = (ruleArray.controls[object.ruleIndex].get('paths') as FormArray);
    const uuid = (pathArray.at(object.pathIndex) as FormGroup).controls.id.value;

    this.ingress.rules[object.ruleIndex].paths.splice(object.pathIndex, 1);

    // this.ingress.rules[object.ruleIndex].paths.find(uuid);
    this.editorService.dirty = true;
    pathArray.removeAt(object.pathIndex);
    this.setBackendValidators();
  }

  /* *************** */
  /* END PATHS ARRAY */
  /* *************** */

  // Dynamically set the backend service id and port validators (If a rule exists with a path, port and service are not required)
  // We call this function on init and when a path is added or removed
  setBackendValidators() {
    // get the desired form fields
    const backendPortControl = this.form.get('backend_service_port');
    const backendIdControl = this.form.get('backend_service_id');
    // checks to see if any rules are in the rule array / if there are rules checks to see if paths are defined
    // if there are paths attached to a rule, default backend is not required now
    // if there are no paths on any rules, default backend is still required
    if (this.ingress.rules.length > 0) {
      let count = 0;
      this.ingress.rules.forEach((rule) => {
        if (rule.paths.length > 0) {
          count++;
        } else {
          // do not increment count, as no paths exist
        }
      });
      // if any paths exist, sets backend validators as not required
      if (count > 0) {
        backendPortControl.clearValidators();
        backendPortControl.setValidators([CustomValidators.numericPortRangeIncludesZero]);
        backendIdControl.clearValidators();
        backendPortControl.updateValueAndValidity();
        backendIdControl.updateValueAndValidity();
      } else { // if no paths exist, sets backend validators as required
        backendPortControl.clearValidators();
        backendPortControl.setValidators([Validators.required, CustomValidators.numericPortRangeIncludesZero]);
        backendIdControl.clearValidators();
        backendIdControl.setValidators([Validators.required, CustomValidators.containsSelectAService]);
        backendPortControl.updateValueAndValidity();
        backendIdControl.updateValueAndValidity();
      }
    } else { // if no rules exist, no paths exist, backend default is required
      backendPortControl.clearValidators();
      backendPortControl.setValidators([Validators.required, CustomValidators.numericPortRangeIncludesZero]);
      backendIdControl.clearValidators();
      backendIdControl.setValidators([Validators.required, CustomValidators.containsSelectAService]);
      backendPortControl.updateValueAndValidity();
      backendIdControl.updateValueAndValidity();
    }
  }

  ngOnInit() {
    /* ***************************** */
    /* CONTAINER REACTIVE FORM MODEL */
    /* ***************************** */
    this.form = this.formBuilder.group({
      name: [{ value: this.ingress.name, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.maxLength253,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithPeriod,
        CustomValidators.duplicateK8sNameValidator(this.editorService, 'ingress')
      ]],
      description: [{ value: this.ingress.description, disabled: this.isReadOnly }, [ /* add validations */]],
      labels: this.formBuilder.array([]),
      annotations: this.formBuilder.array([]),
      backend_service_id: [{ value: (this.ingress.backend.service_id !== null ? this.ingress.backend.service_id : '-- Select a service --'), disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.containsSelectAService
      ]],
      backend_service_port: [{ value: this.ingress.backend.service_port, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.numericPortRangeIncludesZero
      ]],
      tls: this.formBuilder.array([]),
      rule: this.formBuilder.array([])
      /* NOTE: YOU ADD MORE FORM FIELDS HERE, COMMENTING SECTIONS */
    });
    /* ********************************* */
    /* END CONTAINER REACTIVE FORM MODEL */
    /* ********************************* */

    /* ************************************** */
    /* LOAD INCOMING FORM ARRAY ITEMS ON LOAD */
    /* ************************************** */
    this.ingress.labels.forEach((label) => this.addLabel(label));
    this.ingress.annotations.forEach((annotation) => this.addAnnotation(annotation));
    this.ingress.tls.forEach((entry) => this.addTLS(entry));
    this.ingress.rules.forEach((entry) => this.addRule(entry));
    /* ****************************************** */
    /* END LOAD INCOMING FORM ARRAY ITEMS ON LOAD */
    /* ****************************************** */

    /* ******************************************* */
    /* INGRESS REACTIVE FORM VALUE CHANGE HANDLERS */
    /* ******************************************* */
    this.form.get('name').valueChanges.subscribe((newVal) => this.ingress.name = newVal);
    this.form.get('backend_service_id').valueChanges.subscribe((newVal) => this.ingress.backend.service_id = newVal);
    this.form.get('backend_service_port').valueChanges.subscribe((newVal) => this.ingress.backend.service_port = newVal);

    /* *********************************************** */
    /* END INGRESS REACTIVE FORM VALUE CHANGE HANDLERS */
    /* *********************************************** */

    /* ****************************************** */
    /* SET DIRTY FLAG ONCE FORM HAS VALUE CHANGES */
    /* ****************************************** */
    this.form.valueChanges.subscribe(() => {
      if (this.form.dirty) {
        this.editorService.dirty = this.form.dirty;
      }

      // this name of this fn is misleading. We report validity on every form change in order to report freshly vlidated forms
      this.editorService.reportInvalidForm(this.ingress.id, this.form.invalid);
    });
    /* ********************************************** */
    /* END SET DIRTY FLAG ONCE FORM HAS VALUE CHANGES */
    /* ********************************************** */

    this.ingress.onServiceMapChange.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });

    this.setBackendValidators();
    this.form.get('name').updateValueAndValidity();

  }

}
