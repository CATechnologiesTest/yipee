import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Service } from '../../../../models/k8s/Service';
import { Label } from '../../../../models/common/Label';
import { NameValuePairRaw } from '../../../../models/YipeeFileRaw';
import { EditorService } from '../../../editor.service';
import { EditorEventService } from '../../../editor-event.service';
import { PortMapping } from '../../../../models/common/PortMapping';
import { CustomValidators } from '../../../../shared/validators/custom-validators.validators';
import { K8sAnnotation } from '../../../../models/k8s/K8sAnnotation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'k8s-service-container',
  templateUrl: './k8s-service-container.component.html',
  styleUrls: ['./k8s-service-container.component.css']
})
export class K8sServiceContainerComponent implements OnInit {
  @Input() service: Service;

  form: FormGroup;
  isReadOnly = false;
  showBulkSelectorDialog = false;
  showBulkAnnotationDialog = false;

  serviceTypeOptions: NameValuePairRaw[] = [
    { name: 'ClusterIP', value: 'ClusterIP' },
    { name: 'NodePort', value: 'NodePort' },
    { name: 'LoadBalancer', value: 'LoadBalancer' },
    { name: 'ExternalName', value: 'ExternalName' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private editorService: EditorService,
    private editorEventService: EditorEventService
  ) { }

  /* ************** */
  /* SELECTOR ARRAY */
  /* ************** */
  recreateSelectors(): void {
    // remove old entries
    const formArray = this.form.get('selector') as FormArray;
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    this.service.selector.forEach((selector: Label) => this.addSelector(selector));
  }

  createSelector(label: Label): FormGroup {
    return this.formBuilder.group({
      key: [{ value: label.key, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.lowercaseAlphaNumericDashPeriodSlash,
        CustomValidators.containsDoublePeriod,
        CustomValidators.containsDoubleDash
      ]],
      value: [{ value: label.value, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.alphaNumericDashPeriod,
        CustomValidators.maxLength128
      ]],
      id: [{ value: label.id, disabled: true }]
    });
  }
  addSelector(selector?: Label): void {
    if (selector === undefined) {
      selector = new Label();
      selector.key = '', selector.value = '';
      this.service.addSelector(selector);
      this.editorService.dirty = true;
    }

    const formGroup = this.createSelector(selector);
    (this.form.get('selector') as FormArray).push(formGroup);

    formGroup.valueChanges.subscribe((newVal) => {
      ({ key: selector.key, value: selector.value } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddServiceSelector');
  }
  removeSelector(formIndex: number): void {
    const selectorControl = this.form.get('selector') as FormArray;
    const uuid = (selectorControl.at(formIndex) as FormGroup).controls.id.value;
    selectorControl.removeAt(formIndex);
    this.service.removeSelector(uuid);
    this.editorService.dirty = true;
  }
  sortSelector(ascending: boolean, sortByParam: string): void {
    this.returnSortedArray(this.service.selector, sortByParam, ascending).subscribe((sortedArray) => {
      sortedArray.forEach((selectorItem, index) => {
        (this.form.get('selector') as FormArray).removeAt(0); // pulling out formGroups from the bottom of the formArray
        this.addSelector(selectorItem); // pushing new formGroup into the top of the formArray
      });
    });
  }
  handleBulkSelectorReplace(nameValuePairArray: string[][]): void {
    while (this.service.selector.length > 0) {
      this.removeSelector(this.service.selector.length - 1);
    }
    this.handleBulkSelectorAppend(nameValuePairArray);
  }
  handleBulkSelectorAppend(nameValuePairArray: string[][]): void {
    nameValuePairArray.forEach((nameValuePair) => {
      const selector = new Label();
      selector.key = nameValuePair[0];
      selector.value = nameValuePair[1];
      this.service.addSelector(selector);
      this.addSelector(selector);
    });

    this.showBulkSelectorDialog = !this.showBulkSelectorDialog;
  }
  /* ****************** */
  /* END SELECTOR ARRAY */
  /* ****************** */

  /* ***************** */
  /* ANNOTATIONS ARRAY */
  /* ***************** */
  recreateAnnotations(): void {
    // remove old entries
    const formArray = this.form.get('annotations') as FormArray;
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    this.service.annotation.forEach((annotation: K8sAnnotation) => this.addAnnotation(annotation));
  }
  createAnnotation(annotation: K8sAnnotation): FormGroup {
    return this.formBuilder.group({
      key: [{ value: annotation.key, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.lowercaseAlphaNumericDashPeriodSlash,
        CustomValidators.containsDoublePeriod,
        CustomValidators.containsDoubleDash
      ]],
      value: [{ value: annotation.value, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.alphaNumericDashPeriod,
        CustomValidators.maxLength128
      ]],
      id: [{ value: annotation.id, disabled: true }]
    });
  }
  addAnnotation(annotation?: K8sAnnotation): void {
    if (annotation === undefined) {
      annotation = new K8sAnnotation();
      annotation.key = '', annotation.value = '';
      this.service.addAnnotation(annotation);
      this.editorService.dirty = true;
    }

    const formGroup = this.createAnnotation(annotation);
    (this.form.get('annotations') as FormArray).push(formGroup);

    formGroup.valueChanges.subscribe((newVal) => {
      ({ key: annotation.key, value: annotation.value } = newVal);
    });
    this.editorEventService.onGenericTrack.emit('AddAnnotation');
  }
  removeAnnotation(formIndex: number): void {
    const annotationControl = this.form.get('annotations') as FormArray;
    const uuid = (annotationControl.at(formIndex) as FormGroup).controls.id.value;
    this.service.removeAnnotation(uuid);
    this.editorService.dirty = true;
    annotationControl.removeAt(formIndex);
  }
  sortAnnotations(ascending: boolean, sortByParam: string): void {
    this.returnSortedArray(this.service.annotation, sortByParam, ascending).subscribe((sortedArray) => {
      sortedArray.forEach((annotationItem, index) => {
        (this.form.get('annotations') as FormArray).removeAt(0); // pulling out formGroups from the bottom of the formArray
        this.addAnnotation(annotationItem); // pushing new formGroup into the top of the formArray
      });
    });
  }
  handleBulkAnnotationReplace(nameValuePairArray: string[][]): void {
    while (this.service.annotation.length > 0) {
      this.removeAnnotation(this.service.annotation.length - 1);
    }
    this.handleBulkAnnotationAppend(nameValuePairArray);
  }
  handleBulkAnnotationAppend(nameValuePairArray: string[][]): void {
    nameValuePairArray.forEach((nameValuePair) => {
      const annotation = new K8sAnnotation();
      annotation.key = nameValuePair[0];
      annotation.value = nameValuePair[1];
      this.service.addAnnotation(annotation);
      this.addAnnotation(annotation);
    });

    this.showBulkAnnotationDialog = !this.showBulkAnnotationDialog;
  }
  /* ********************* */
  /* END ANNOTATIONS ARRAY */
  /* ********************* */

  /* ********************************* */
  /* CONTAINER PORTS ARRAY - READ ONLY */
  /* ********************************* */
  recreatePortMapping(): void {
    // remove old entries
    const formArray = this.form.get('port_mapping') as FormArray;
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    this.service.container_port_mapping.forEach((portMapping) => this.addPortMapping(portMapping));
  }

  recreateServicePortMapping(): void {
    // remove old entries
    const formArray = this.form.get('service_port_mapping') as FormArray;
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    this.service.service_port_mapping.forEach((portMapping) => this.addServicePortMapping(portMapping));
  }

  createPortMapping(portMapping: PortMapping): FormGroup {
    const internalValue = (portMapping.name !== '' ? portMapping.internal + '/' + portMapping.name : portMapping.internal);
    return this.formBuilder.group({
      internal: [{ value: internalValue, disabled: true }, [ /* none */]],
      protocol: [{ value: portMapping.protocol, disabled: true }, [ /* none */]],
      container_name: [{ value: portMapping.container_name, disabled: true }, [ /* none */]],
      id: [{ value: portMapping.id, disabled: true }]
    });
  }
  addPortMapping(portMapping: PortMapping): void {
    const formGroup = this.createPortMapping(portMapping);
    (this.form.get('port_mapping') as FormArray).push(formGroup);
  }
  /* ************************************* */
  /* END CONTAINER PORTS ARRAY - READ ONLY */
  /* ************************************* */

  /* ******************* */
  /* SERVICE PORTS ARRAY */
  /* ******************* */
  createServicePortMapping(servicePortMapping: PortMapping): FormGroup {
    // pretty standard here, just create a formGroup for the new mapping being added
    return this.formBuilder.group({
      name: [{ value: servicePortMapping.svc_port_name, disabled: this.isReadOnly }, [ /* set below */]],
      internal: [{ value: servicePortMapping.internal, disabled: this.isReadOnly }, [
        Validators.required
      ]],
      external: [{ value: servicePortMapping.external, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.numericOnly,
        CustomValidators.numericPortRange
      ]],
      node_port: [{ value: servicePortMapping.node_port, disabled: this.isReadOnly }, [
        CustomValidators.numericOnly,
        CustomValidators.numericPortRange
      ]],
      protocol: [{ value: servicePortMapping.protocol, disabled: this.isReadOnly }, [ /* add validations here */]],
      id: [{ value: servicePortMapping.id, disabled: true }]
    });
  }
  addServicePortMapping(servicePortMapping?: PortMapping): void {
    // if not portMapping: PortMapping is provided, we create a default one
    if (servicePortMapping === undefined) {
      servicePortMapping = new PortMapping();
      servicePortMapping.defining_service = this.service.id;
      servicePortMapping.container_references = false;
      servicePortMapping.internal = '';
      servicePortMapping.external = '';
      servicePortMapping.node_port = '';
      servicePortMapping.svc_port_name = '';
      servicePortMapping.protocol = 'tcp';
    }
    this.service.addServicePortMapping(servicePortMapping);
    this.editorService.dirty = true;
    const formGroup = this.createServicePortMapping(servicePortMapping);
    (this.form.get('service_port_mapping') as FormArray).push(formGroup);

    // watch the value changes on the new formGroup and keep the new PortMapping object up to date
    formGroup.valueChanges.subscribe((newVal) => {
      ({ internal: servicePortMapping.internal, external: servicePortMapping.external, node_port: servicePortMapping.node_port, name: servicePortMapping.svc_port_name, protocol: servicePortMapping.protocol } = newVal);
    });
    this.setServicePortNameValidators();
  }
  removeServicePortMapping(formIndex: number): void {
    const service_port_mappingControl = this.form.get('service_port_mapping') as FormArray;
    const uuid = (service_port_mappingControl.at(formIndex) as FormGroup).controls.id.value;
    this.service.removeServicePortMapping(uuid);
    this.editorService.dirty = true;
    service_port_mappingControl.removeAt(formIndex);
    this.setServicePortNameValidators();
  }
  setServicePortNameValidators(): void {
    const form_array = this.form.get('service_port_mapping') as FormArray;
    for (const group of form_array.controls) {
      const name_control = group.get('name');
      if (form_array.length > 1) {
        name_control.setValidators([Validators.required, CustomValidators.alphaNumericUnderscoreDashPeriod, CustomValidators.maxLengthDNSLabel]);
      } else {
        name_control.setValidators([CustomValidators.alphaNumericUnderscoreDashPeriod, CustomValidators.maxLengthDNSLabel]);
      }
      name_control.updateValueAndValidity();
    }
  }
  /* *********************** */
  /* END SERVICE PORTS ARRAY */
  /* *********************** */

  /* *********** */
  /* UTILITY fns */
  /* *********** */
  returnSortedArray(sortableArray: any[], sortByParam: string, ascending: boolean): Observable<any[]> {
    let arrayCopy = [];

    if (ascending) {
      arrayCopy = _.sortBy(sortableArray, sortByParam);
    } else {
      arrayCopy = _.sortBy(sortableArray, sortByParam).reverse();
    }

    return Observable.of(arrayCopy);
  }
  /* *************** */
  /* END UTILITY fns */
  /* *************** */
  ngOnInit() {
    /* ***************************** */
    /* CONTAINER REACTIVE FORM MODEL */
    /* ***************************** */
    this.form = this.formBuilder.group({
      name: [{ value: this.service.name, disabled: this.isReadOnly }, [
        Validators.required,
        CustomValidators.maxLength253,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithPeriod,
        CustomValidators.duplicateK8sNameValidator(this.editorService, 'services')
      ]],
      service_type: [{ value: this.service.service_type, disabled: this.isReadOnly }, [ /* dropdown - validation not necessary */]],
      cluster_ip: [{ value: this.service.cluster_ip, disabled: this.isReadOnly }, [
        CustomValidators.clusterIpAddressField
      ]],
      external_name: [{ value: this.service.external_name, disabled: this.isReadOnly }, []],
      /* annotations */
      annotations: this.formBuilder.array([]),
      /* selector */
      selector: this.formBuilder.array([]),
      /* port mapping */
      port_mapping: this.formBuilder.array([]),
      /* service port mapping */
      service_port_mapping: this.formBuilder.array([])
      /* NOTE: YOU ADD MORE FORM FIELDS HERE, COMMENTING SECTIONS */
    });
    /* ********************************* */
    /* END CONTAINER REACTIVE FORM MODEL */
    /* ********************************* */

    // add validator that validates the service port mappings exist compared to service type
    this.form.setValidators([CustomValidators.serviceTypePortMappingValidator]);

    if (this.service.service_type === 'ExternalName') {
      this.form.get('external_name').setValidators([Validators.required, CustomValidators.dnsValidator]);
      this.form.get('external_name').updateValueAndValidity();
    }

    /* ******************************************* */
    /* SERVICE REACTIVE FORM VALUE CHANGE HANDLERS */
    /* ******************************************* */
    this.form.get('name').valueChanges.subscribe((newVal) => this.service.name = newVal);

    this.form.get('service_type').valueChanges.subscribe((newVal) => {
      if (newVal === 'ExternalName') {
        this.form.get('external_name').setValidators([Validators.required, CustomValidators.dnsValidator]);
        this.form.get('external_name').updateValueAndValidity();
      } else {
        this.form.get('external_name').setValidators([ /* no validations */]);
        this.form.get('external_name').updateValueAndValidity();
      }
      this.service.service_type = newVal;
    });

    this.form.get('cluster_ip').valueChanges.subscribe((newVal) => this.service.cluster_ip = newVal);
    this.form.get('external_name').valueChanges.subscribe((newVal) => this.service.external_name = newVal);
    /* selector */
    // find the SELECTOR ARRAY section elsewhere in this file
    /* *********************************************** */
    /* END SERVICE REACTIVE FORM VALUE CHANGE HANDLERS */
    /* *********************************************** */

    /* ************************************** */
    /* LOAD INCOMING FORM ARRAY ITEMS ON LOAD */
    /* ************************************** */
    this.service.selector.forEach((selector) => this.addSelector(selector));
    this.service.container_port_mapping.forEach((portMapping) => this.addPortMapping(portMapping));
    this.service.service_port_mapping.forEach((portMapping) => this.addServicePortMapping(portMapping));
    /* ****************************************** */
    /* END LOAD INCOMING FORM ARRAY ITEMS ON LOAD */
    /* ****************************************** */

    /* ********************************************* */
    /* SET ANNOTATION ARRAY ITEMS IN SERVICE ON LOAD */
    /* ********************************************* */
    this.service.setAnnotations();
    this.recreateAnnotations();
    /* ************************************************* */
    /* END SET ANNOTATION ARRAY ITEMS IN SERVICE ON LOAD */
    /* ************************************************* */

    /* ****************************************** */
    /* SET DIRTY FLAG ONCE FORM HAS VALUE CHANGES */
    /* ****************************************** */
    this.form.valueChanges.subscribe(() => {
      if (this.form.dirty) {
        this.editorService.dirty = this.form.dirty;
      }

      // this name of this fn is misleading. We report validity on every form change in order to report freshly vlidated forms
      this.editorService.reportInvalidForm(this.service.id, this.form.invalid);
    });

    this.form.get('selector').valueChanges.subscribe(() => {
      this.editorEventService.onServiceSelectorChange.next(this.service);
      // there may be new containers with port mappings after selector edit so update port mappings
      this.recreatePortMapping();
    });
    /* ********************************************** */
    /* END SET DIRTY FLAG ONCE FORM HAS VALUE CHANGES */
    /* ********************************************** */

    this.form.get('name').updateValueAndValidity();

    this.service.onRefresh.subscribe((value: boolean) => {
      this.recreatePortMapping();
      this.recreateServicePortMapping();
      this.recreateSelectors();

      // detect changes to the service and notify the editor event service
      // really only so that the editor service can see it and take action
      this.editorEventService.onServiceModelOnRefresh.next();
    });

  }

}
