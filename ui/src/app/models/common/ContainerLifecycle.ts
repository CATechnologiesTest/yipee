import { ParsedObject } from '../parse/ParsedObject';

/** container-lifecycle entry */

export class ContainerLifecycle extends ParsedObject {

  public static OBJECT_NAME = 'container-lifecycle';

  post_start: string[];
  pre_stop: string[];
  container: string;

  public static construct(type: string): ParsedObject {
    return new ContainerLifecycle();
  }

  constructor() {
    super(ContainerLifecycle.OBJECT_NAME);
    this.post_start = [];
    this.pre_stop = [];
  }

  /** is the object empty */
  isEmpty(): boolean {
    return this.post_start.length === 0 && this.pre_stop.length === 0;
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.container = flat['container'];
    if (flat.postStart && flat.postStart.exec && flat.postStart.exec.command) {
      this.post_start = flat.postStart.exec.command;
    }
    if (flat.preStop && flat.preStop.exec && flat.preStop.exec.command) {
      this.pre_stop = flat.preStop.exec.command;
    }
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['container'] = this.container;
    if (this.post_start.length !== 0) {
      flat.postStart = {
        exec: {
          command: this.post_start
        }
      };
    }
    if (this.pre_stop.length !== 0) {
      flat.preStop = {
        exec: {
          command: this.pre_stop
        }
      };
    }
    return flat;
  }

}
