import { ParsedObject } from '../parse/ParsedObject';

/** Yipee flat file entrypoint entry. */

export class Entrypoint extends ParsedObject {

  public static OBJECT_NAME = 'entrypoint';

  value: string[];
  container: string;

  public static construct(type: string): ParsedObject {
    return new Entrypoint();
  }

  constructor() {
    super(Entrypoint.OBJECT_NAME);
    this.value = [];
  }

  /** is the object empty */
  isEmpty(): boolean {
    return (this.value.length === 0);
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.value = flat['value'];
    this.container = flat['container'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['value'] = this.value;
    flat['container'] = this.container;
    return flat;
  }

}
