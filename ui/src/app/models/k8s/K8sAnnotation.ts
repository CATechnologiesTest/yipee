import { ParsedObject } from '../parse/ParsedObject';
import { Service } from './Service';

/** Yipee flat file annotation entry. */

export class K8sAnnotation extends ParsedObject {

  public static OBJECT_NAME = 'k8s-annotation';

  key: string;
  value: any;
  location: any;
  ['annotated-name']: string;
  ['annotated-type']: string;
  annotated: string;

  public static construct(type: string): ParsedObject {
    return new K8sAnnotation();
  }

  constructor() {
    super(K8sAnnotation.OBJECT_NAME);
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.key = flat['key'];
    this.value = flat['value'];
    this.location = flat['location'];
    this['annotated-name'] = flat['annotated-name'];
    this['annotated-type'] = flat['annotated-type'];
    this.annotated = flat['annotated'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['annotated'] = this.annotated;
    flat['key'] = this.key;
    flat['value'] = this.value;
    flat['location'] = ['metadata', 'annotations'];
    flat['annotated-name'] = this['annotated-name'];
    flat['annotated-type'] = this['annotated-type'];
    return flat;
  }

}
