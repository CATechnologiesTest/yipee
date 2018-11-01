import { ParsedObject } from '../parse/ParsedObject';

/** Yipee flat file annotation entry. */

export class Annotation extends ParsedObject {

  public static OBJECT_NAME = 'annotation';

  key: string;
  value: any;
  annotated: string;

  public static construct(type: string): ParsedObject {
    return new Annotation();
  }

  constructor() {
    super(Annotation.OBJECT_NAME);
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.key = flat['key'];
    this.value = flat['value'];
    this.annotated = flat['annotated'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['key'] = this.key;
    flat['value'] = this.value;
    flat['annotated'] = this.annotated;
    return flat;
  }

}
