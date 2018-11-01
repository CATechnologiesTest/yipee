import { ParsedObject } from '../parse/ParsedObject';
import { Container } from './Container';
import { Service } from '../k8s/Service';
import { ContainerShape } from '../../editor/canvas/shapes';

/** Yipee flat file port-mapping entry. */

export class PortMapping extends ParsedObject {

  public static OBJECT_NAME = 'port-mapping';

  container: string;
  name: string;
  svc_port_name: string;
  external: string;
  internal: string;
  protocol: string;
  node_port: string;
  container_references: boolean;
  defining_service: string;

  public static construct(type: string): ParsedObject {
    return new PortMapping();
  }

  constructor() {
    super(PortMapping.OBJECT_NAME);
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.name = flat['name'];
    this.svc_port_name = flat['svc-port-name'];
    this.container = flat['container'];
    if (flat['external'] === undefined || flat['external'] === '*') {
      this.external = '';
    } else {
      this.external = flat['external'];
    }
    if (flat['container-references'] === undefined || flat['container-references'] === '') {
      this.container_references = false;
    } else {
      this.container_references = flat['container-references'];
    }
    this.internal = flat['internal'];
    this.node_port = flat['node-port'];
    this.protocol = flat['protocol'];
    if (this.protocol === undefined) {
      this.protocol = 'tcp';
    }
    this.defining_service = flat['defining-service'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['name'] = this.name;
    flat['svc-port-name'] = this.svc_port_name;
    flat['container'] = this.container;
    flat['external'] = this.external + '';
    flat['internal'] = this.internal + '';
    flat['node-port'] = this.node_port + '';
    flat['protocol'] = this.protocol;
    flat['container-references'] = this.container_references;
    flat['defining-service'] = this.defining_service;
    return flat;
  }

  get container_name(): string {
    const container = this.getContainer();
    if (container !== undefined) {
      return container.name;
    }
    return 'ERROR';
  }

  private getContainer(): Container {
    return this.finder.objects
      .filter((p) => p.type === Container.OBJECT_NAME)
      .map((p: Container) => p as Container)
      .find((p) => p.id === this.container);
  }

  private getDefiningService(): Service {
    return this.finder.objects
      .filter((p) => p.type === Service.OBJECT_NAME)
      .map((p: Service) => p as Service)
      .find((p) => p.id === this.defining_service);
  }

}
