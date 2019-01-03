import { EventEmitter } from '@angular/core';

import { Annotation } from '../common/Annotation';
import { ContainerGroup } from '../common/ContainerGroup';
import { FinderUtilities } from '../common/FinderUtilities';
import { Label } from '../common/Label';
import { NameChangeEvent } from '../Events';
import { ParsedObject } from '../parse/ParsedObject';
import { PortMapping } from '../common/PortMapping';
import { K8sAnnotation } from './K8sAnnotation';
import { map } from 'rxjs-compat/operator/map';

/** common service entry */

export class Service extends ParsedObject {

  public static OBJECT_NAME = 'k8s-service';

  private _name: string;
  metadata: any;
  /** ClusterIP, NodePort, LoadBalancer, or External-Name */
  _service_type: string;
  /** if present, static IP for service or “None”, only valid for ClusterIP, NodePort, or LoadBalancer */
  cluster_ip: string;
  /** if present, external name for service, only valid for ExternalName */
  external_name: string;
  /** if present, staticly defined port for service */
  public onNameChange: EventEmitter<NameChangeEvent> = new EventEmitter<NameChangeEvent>();

  private labels: Label[] = [];
  private annotations: K8sAnnotation[] = [];

  public static construct(type: string): ParsedObject {
    return new Service();
  }

  constructor() {
    super(Service.OBJECT_NAME);
    this._service_type = 'ClusterIP';
    this.cluster_ip = '';
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.name = flat['name'];
    this.metadata = flat['metadata'];
    this._service_type = flat['service-type'];
    this.cluster_ip = flat['cluster-ip'];
    this.external_name = flat['external-name'];

    if (flat['selector']) {
      const selector = flat['selector'];
      for (const key of Object.keys(selector)) {
        const label = new Label();
        label.key = key;
        label.value = selector[key];
        this.addSelector(label);
      }
    }
  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    const selector = {};
    for (const label of this.selector) {
      selector[label.key] = label.value;
    }
    flat['name'] = this.name;
    flat['metadata'] = this.updateMetadata();
    flat['selector'] = selector;
    flat['service-type'] = this._service_type;
    if (this._service_type === 'ExternalName') {
      flat['external-name'] = this.external_name;
    } else {
      flat['cluster-ip'] = this.cluster_ip;
    }
    return flat;
  }

  updateMetadata(): {name: string, labels: {}, annotations: {}} {
    if (!this.metadata) {
      // this object wasn't imported and hasn't been processed toFlat yet,
      // so we need to create a new set of metadata
      this.metadata = {
        name: '',
        labels: {},
        annotations: {}
      };
    }
    this.metadata.name = this.name;
    // It's possible the import didn't contain labels, add them
    if (!this.metadata.labels) {
      this.metadata.labels = {};
    }
    for (const label of this.labels) {
      this.metadata.labels[label.key] = label.value;
    }
    // It's possible the import didn't contain annotations, add them
    if (!this.metadata.annotations) {
      this.metadata.annotations = {};
    }
    for (const label of this.annotations) {
      this.metadata.annotations[label.key] = label.value;
    }
    return this.metadata;
  }

  /** remove the service and all references to this service */
  remove(): void {
    super.remove();
    for (const mapping of this.service_port_mapping) {
      mapping.remove();
    }
    FinderUtilities.removeObjectAnnotations(this.finder, this.id);

  }

  get service_type(): string {
    return this._service_type;
  }

  set service_type(value: string) {
    // clear out selectors and service ports if external name
    if (value === 'ExternalName') {
      for (const mapping of this.service_port_mapping) {
        mapping.remove();
      }
      this.labels = [];
    }
    this._service_type = value;
    this.refreshObjectsByType(Service.OBJECT_NAME);
  }

  get ui(): any {
    return FinderUtilities.getUi(this.finder, this.id).value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this.onNameChange.emit(new NameChangeEvent(this._name, value));
    this._name = value;
    this.initiateAttributeChange('name');
    this.onRefresh.emit(true);
  }

  get container_port_mapping(): PortMapping[] {
    return this.getContainerPortMapping();
  }

  get service_port_mapping(): PortMapping[] {
    return this.getServicePortMapping();
  }

  addServicePortMapping(mapping: PortMapping): void {
    mapping.defining_service = this.id;
    mapping.container_references = false;
    this.finder.push(mapping);
  }

  removeServicePortMapping(id: string): void {
    this.finder.remove(id);
  }

  get selector(): Label[] {
    return this.labels;
  }

  addSelector(label: Label): void {
    this.labels.push(label);
  }

  removeSelector(id: string): void {
    this.labels = this.labels.filter((p) => p.id !== id);
    this.onRefresh.emit(true);
  }

  get annotation(): K8sAnnotation[] {
    return this.annotations;
  }

  setAnnotations(): void {
    const existingAnnotations = this.finder.objects
      .filter((p) => p.type === K8sAnnotation.OBJECT_NAME)
      .map((p: K8sAnnotation) => p as K8sAnnotation)
      .filter((p) => p['annotated-name'] === this.name);

    existingAnnotations.forEach((annotation) => {
      // If the app receives an annotation without
      // a service ID, we add it here.
      if (annotation.annotated === undefined || annotation.annotated === null || annotation.annotated === '') {
        annotation.annotated = this.id;
      }
      this.annotations.push(annotation);
    });
  }

  addAnnotation(annotation: K8sAnnotation): void {
    this.annotations.push(annotation);
    annotation.annotated = this.id;
    annotation['annotated-name'] = this.name;
    annotation['annotated-type'] = this.type;
    annotation.annotated = this.id;
    this.finder.push(annotation);
  }

  removeAnnotation(id: string): void {
    this.annotations = this.annotations.filter((p) => p.id !== id);
    this.finder.remove(id);
    this.onRefresh.emit(true);
  }

  get container_groups(): ContainerGroup[] {
    return this.getContainerGroups();
  }

  containerGroupInService(cgroup: ContainerGroup): boolean {
    for (const group of this.container_groups) {
      if (group.id === cgroup.id) {
        return true;
      }
    }
    return false;
  }

  /**
   * Connect a service to a container group and return true if successful or false if not successful.
   * @param cgroup container group
   */
  connectServiceToContainerGroup(cgroup: ContainerGroup): boolean {

    // generate a selector if needed

    if (this.selector.length === 0) {
      const label = new Label();
      label.key = 'yipee.io/' + this.name;
      label.value = 'generated';
      this.addSelector(label);
    }

    // add my selectors to the container group

    for (const s of this.selector) {
      const existing = cgroup.label.find((l: Label) => l.key === s.key);
      if (existing) {
        existing.value = s.value;
      } else {
        const label = new Label();
        label.key = s.key;
        label.value = s.value;
        cgroup.addLabel(label);
      }
    }

    this.refreshObjectsByType(Service.OBJECT_NAME);
    this.refreshObjectsByType(ContainerGroup.OBJECT_NAME);

    return true;
  }

  private labelMatch(labels: Label[]): boolean {
    if (labels === undefined || labels.length === 0) {
      return false;
    }
    if (this.selector === undefined || this.selector.length === 0) {
      return false;
    }
    for (const mine of this.selector) {
      if (!mine.in(labels)) {
        return false;
      }
    }
    return true;
  }

  private getContainerGroups(): ContainerGroup[] {
    const cgroup = this.finder.objects
      .filter((p) => p.type === ContainerGroup.OBJECT_NAME)
      .map((p: ContainerGroup) => p as ContainerGroup)
      .filter((p) => this.labelMatch(p.label));
    return cgroup;
  }

  private getContainerPortMapping(): PortMapping[] {
    const mapping: PortMapping[] = [];
    for (const cgroup of this.container_groups) {
      for (const container of cgroup.containers) {
        for (const port_mapping of container.port_mapping) {
          mapping.push(port_mapping);
        }
      }
    }
    return mapping;
  }

  private getServicePortMapping(): PortMapping[] {
    return this.finder.objects
      .filter((p) => p.type === PortMapping.OBJECT_NAME)
      .map((p: PortMapping) => p as PortMapping)
      .filter((p) => p.defining_service === this.id && p.container_references === false);
  }

}
