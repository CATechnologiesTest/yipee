import { ParsedObject } from '../parse/ParsedObject';

/** common top-label entry */

export class TopLabel extends ParsedObject {

  public static OBJECT_NAME = 'top-label';

  cgroup: string;
  key: string;
  value: string;

  public static construct(type: string): ParsedObject {
    return new TopLabel();
  }

  constructor() {
    super(TopLabel.OBJECT_NAME);
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.cgroup = flat['cgroup'];
    this.key = flat['key'];
    this.value = flat['value'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['cgroup'] = this.cgroup;
    flat['key'] = this.key;
    flat['value'] = this.value;
    return flat;
  }

}
