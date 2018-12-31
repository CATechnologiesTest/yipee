import { EventEmitter } from '@angular/core';
import { v4 as uuid } from 'uuid';

import { Service } from './Service';
import { FinderUtilities } from '../common/FinderUtilities';
import { NameChangeEvent, ValueChangeEvent } from '../Events';
import { ParsedObject } from '../parse/ParsedObject';
import { Label } from '../common/Label';
import { NameStringValue } from '../common/Generic';

export class IngressBackend {

  public service_id: string;
  public service_port: number;

  constructor() {
    this.service_id = null;
    this.service_port = 0;
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    this.service_id = flat['service-id'];
    this.service_port = flat['servicePort'];
  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = {};
    flat['service-id'] = this.service_id;
    flat['servicePort'] = this.service_port;
    return flat;
  }

}

export class IngressPath {

  public id: string;
  public path: string;
  private backend: IngressBackend;

  constructor() {
    this.id = uuid();
    this.path = '';
    this.backend = new IngressBackend();
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    this.path = flat['path'];
    if (flat['backend']) {
      this.backend.fromFlat(flat['backend']);
    }
  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = {};
    if (this.path !== '') {
      flat['path'] = this.path;
    }
    flat['backend'] = this.backend.toFlat();
    return flat;
  }

  get service_id(): string {
    return this.backend.service_id;
  }

  set service_id(value: string) {
    this.backend.service_id = value;
  }

  get service_port(): number {
    return this.backend.service_port;
  }

  set service_port(value: number) {
    this.backend.service_port = value;
  }

}

export class IngressRule {

  public id: string;
  public host: string;
  public protocol: string;
  private _paths: IngressPath[];

  constructor() {
    this.id = uuid();
    this.host = '';
    this.protocol = 'http';
    this._paths = [];
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    this.host = flat['host'];
    if (flat['http']) {
      this.protocol = 'http';
      const http = flat['http'];
      if (http['paths']) {
        const paths = http['paths'];
        for (const path of paths) {
          const ip = new IngressPath();
          ip.fromFlat(path);
          this.addPath(ip);
        }
      }
    }
  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = {};
    if (this.host !== '') {
      flat['host'] = this.host;
    }
    const paths = [];
    for (const path of this.paths) {
      paths.push(path.toFlat());
    }
    flat[this.protocol] = {
      paths: paths
    };
    return flat;
  }

  get paths(): IngressPath[] {
    return this._paths;
  }

  addPath(path: IngressPath): void {
    this._paths.push(path);
  }

  removePath(id: string): void {
    this._paths = this._paths.filter((p) => p.id !== id);
  }

}

export class IngressTLS {

  public id: string;
  public secret_name: string;
  public hosts: string;

  constructor() {
    this.id = uuid();
    this.hosts = '';
    this.secret_name = '';
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    if (flat['hosts']) {
      this.hosts = flat['hosts'].join();
    }
    this.secret_name = flat['secretName'];
  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = {};
    flat['hosts'] = this.hosts.split(',').map(s => s.trim());
    flat['secretName'] = this.secret_name;
    return flat;
  }

}

/** common ingress entry */

export class Ingress extends ParsedObject {

  public static OBJECT_NAME = 'ingress';

  private _name: string;
  private _labels: Label[] = [];
  private _annotations: Label[] = [];
  private _rules: IngressRule[] = [];
  private _tls: IngressTLS[] = [];
  private _service_name_map: NameStringValue[];
  public api_version: string;
  public kind: string;
  public backend: IngressBackend = new IngressBackend();
  public onNameChange: EventEmitter<NameChangeEvent> = new EventEmitter<NameChangeEvent>();
  public onServiceMapChange: EventEmitter<ValueChangeEvent> = new EventEmitter<ValueChangeEvent>();

  public static construct(type: string): ParsedObject {
    return new Ingress();
  }

  constructor() {
    super(Ingress.OBJECT_NAME);
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.api_version = flat['apiVersion'];
    this.kind = flat['kind'];
    if (flat['spec']) {
      const spec = flat['spec'];
      if (spec['backend']) {
        this.backend.fromFlat(spec['backend']);
      }
      if (spec['rules']) {
        const rules = spec['rules'];
        for (const rule of rules) {
          const r = new IngressRule();
          r.fromFlat(rule);
          this.addRule(r);
        }
      }
      if (spec['tls']) {
        const tlss = spec['tls'];
        for (const tls of tlss) {
          const t = new IngressTLS();
          t.fromFlat(tls);
          this.addTLS(t);
        }
      }
    }
    if (flat['metadata']) {
      const metadata = flat['metadata'];
      this.name = metadata['name'];
      if (metadata['labels']) {
        const labels = metadata['labels'];
        for (const key of Object.keys(labels)) {
          const label = new Label();
          label.key = key;
          label.value = labels[key];
          this.addLabel(label);
        }
      }
      if (metadata['annotations']) {
        const annotations = metadata['annotations'];
        for (const key of Object.keys(annotations)) {
          const label = new Label();
          label.key = key;
          label.value = annotations[key];
          this.addAnnotation(label);
        }
      }
    }
  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['apiVersion'] = this.api_version;
    flat['kind'] = this.kind;
    flat['name'] = this.name;
    const metadata = {
      name: this.name,
      labels: {},
      annotations: {}
    };
    for (const label of this.labels) {
      metadata.labels[label.key] = label.value;
    }
    for (const label of this.annotations) {
      metadata.annotations[label.key] = label.value;
    }
    flat['metadata'] = metadata;

    /* dont add the 'backend' parameter if there is no
    backend data added or available */
    let spec;

    if ((this.backend.service_id === null) || (this.backend.service_id === '-- Select a service --')) {

      spec = {
        rules: [],
        tls: []
      };

    } else {

      spec = {
        backend: this.backend.toFlat(),
        rules: [],
        tls: []
      };

    }

    if (this.rules.length > 0) {
      for (const r of this.rules) {
        spec.rules.push(r.toFlat());
      }
    } else {
      delete spec.rules;
    }
    if (this.tls.length > 0) {
      for (const t of this.tls) {
        spec.tls.push(t.toFlat());
      }
    } else {
      delete spec.tls;
    }
    flat['spec'] = spec;
    return flat;
  }

  /** remove the ingress and all references to this ingress */
  remove(): void {
    // remove description
    this.finder.remove(FinderUtilities.getDescription(this.finder, this.id).id);
    // remove it's UI position
    this.finder.remove(FinderUtilities.getUi(this.finder, this.id).id);

    super.remove();
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
  }

  get description(): string {
    return FinderUtilities.getDescription(this.finder, this.id).value;
  }

  set description(value: string) {
    FinderUtilities.getDescription(this.finder, this.id).value = value;
  }

  get labels(): Label[] {
    return this._labels;
  }

  addLabel(label: Label): void {
    this._labels.push(label);
  }

  removeLabel(id: string): void {
    this._labels = this._labels.filter((p) => p.id !== id);
  }

  get annotations(): Label[] {
    return this._annotations;
  }

  addAnnotation(annotation: Label): void {
    this._annotations.push(annotation);
  }

  removeAnnotation(id: string): void {
    this._annotations = this._annotations.filter((p) => p.id !== id);
  }

  get tls(): IngressTLS[] {
    return this._tls;
  }

  addTLS(tls: IngressTLS): void {
    this._tls.push(tls);
  }

  removeTLS(id: string): void {
    this._tls = this._tls.filter((p) => p.id !== id);
  }

  get rules(): IngressRule[] {
    return this._rules;
  }

  addRule(rule: IngressRule): void {
    this._rules.push(rule);
  }

  removeRule(id: string): void {
    this._rules = this._rules.filter((p) => p.id !== id);
  }

  /**
   * Connect a service to a this ingress and return true if successful or false if not successful.
   * @param service the service to add
   */
  connectServiceToIngress(service: Service): boolean {
    return true;
  }

  /**
   * Remove a service from this ingress.
   * @param service the service to remove
   */
  removeServiceFromIngress(service: Service): boolean {
    return true;
  }

  get service_name_map(): NameStringValue[] {
    if (this._service_name_map === undefined) {
      this._service_name_map = this.getServiceNameMap();
    }
    return this._service_name_map;
  }

  private getServiceNameMap(): NameStringValue[] {
    const refs = this.finder.objects
      .filter((p) => p.type === Service.OBJECT_NAME)
      .map((p: Service) => p as Service)
      .map((p: Service) => new NameStringValue(p.name, p.id));
    return refs;
  }

  /** object added lifecycle event */
  objectAdded(object: ParsedObject): void {
    switch (object.type) {
      case Service.OBJECT_NAME:
        const oldMapping = this._service_name_map;
        this._service_name_map = this.getServiceNameMap();
        this.onServiceMapChange.emit(new ValueChangeEvent(oldMapping, this._service_name_map));
        break;
    }
  }

  /** object removed lifecycle event */
  objectRemoved(object: ParsedObject): void {
    switch (object.type) {
      case Service.OBJECT_NAME:
        const oldMapping = this._service_name_map;
        this._service_name_map = this.getServiceNameMap();

        const doesServiceExistBackend = this.service_name_map.find((service) => {
          return service.value === this.backend.service_id;
        });

        if (!doesServiceExistBackend) {
          this.backend.service_id = null;
        }

        this.rules.forEach((rule) => {
          rule.paths.forEach((path) => {
            const doesServiceExistPath = this.service_name_map.find((service) => {
              return service.value === path.service_id;
            });

            if (!doesServiceExistPath) {
              path.service_id = null;
            }

          });
        });

        this.onServiceMapChange.emit(new ValueChangeEvent(oldMapping, this._service_name_map));
        break;
    }
  }

  /** attribute changed lifecycle event */
  attributeChanged(object: ParsedObject, attribute: string): void {
    switch (object.type) {
      case Service.OBJECT_NAME:
        const oldMapping = this._service_name_map;
        this._service_name_map = this.getServiceNameMap();
        this.onServiceMapChange.emit(new ValueChangeEvent(oldMapping, this._service_name_map));
        break;
    }
  }

}
