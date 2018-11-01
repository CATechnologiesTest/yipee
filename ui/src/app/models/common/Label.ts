import { ParsedObject } from '../parse/ParsedObject';

/** Yipee flat file label entry. */

export class Label extends ParsedObject {

  public static OBJECT_NAME = 'label';

  cgroup: string;
  key: string;
  value: string;
  ismap: boolean;

  public static construct(type: string): ParsedObject {
    return new Label();
  }

  constructor() {
    super(Label.OBJECT_NAME);
    this.key = '';
    this.value = '';
  }

  public equals(label: Label): boolean {
    if (this.key.length === 0 || this.value.length === 0) {
      return false;
    }
    if (label.key.length === 0 || label.value.length === 0) {
      return false;
    }
    return (this.key === label.key && this.value === label.value);
  }

  public in(labels: Label[]): boolean {
    for (const label of labels) {
      if (this.equals(label)) {
        return true;
      }
    }
    return false;
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.cgroup = flat['cgroup'];
    this.key = flat['key'];
    this.value = flat['value'];
    this.ismap = flat['ismap'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['cgroup'] = this.cgroup;
    flat['key'] = this.key;
    flat['value'] = this.value;
    flat['ismap'] = this.ismap;
    return flat;
  }

}
