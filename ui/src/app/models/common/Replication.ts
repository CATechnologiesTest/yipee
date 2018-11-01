import { ParsedObject } from '../parse/ParsedObject';

/** Yipee flat file replication entry. */

export class Replication extends ParsedObject {

  public static OBJECT_NAME = 'replication';

  cgroup: string;
  count: number;

  public static construct(type: string): ParsedObject {
    return new Replication();
  }

  constructor() {
    super(Replication.OBJECT_NAME);
    this.count = 0;
  }

  /** is the object empty */
  isEmpty(): boolean {
    return (this.count === 0);
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.cgroup = flat['cgroup'];
    this.count = flat['count'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['cgroup'] = this.cgroup;
    flat['count'] = this.count;
    return flat;
  }

}
