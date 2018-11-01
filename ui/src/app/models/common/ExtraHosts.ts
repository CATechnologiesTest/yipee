import { ParsedObject } from '../parse/ParsedObject';

/** Yipee flat file extra-hosts entry. */

export class ExtraHosts extends ParsedObject {

  public static OBJECT_NAME = 'extra-hosts';

  cgroup: string;
  value: string[];

  public static construct(type: string): ParsedObject {
    return new ExtraHosts();
  }

  constructor() {
    super(ExtraHosts.OBJECT_NAME);
    this.value = [];
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
