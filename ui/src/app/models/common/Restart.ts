import { ParsedObject } from '../parse/ParsedObject';

/** Yipee flat file restart entry. */

export class Restart extends ParsedObject {

  public static OBJECT_NAME = 'restart';

  cgroup: string;
  value: string;

  public static construct(type: string): ParsedObject {
    return new Restart();
  }

  constructor() {
    super(Restart.OBJECT_NAME);
    this.value = '';
  }

  /** is the object empty */
  isEmpty(): boolean {
    return (this.value.length === 0);
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.cgroup = flat['cgroup'];
    this.value = flat['value'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['cgroup'] = this.cgroup;
    flat['value'] = this.value;
    return flat;
  }

}
