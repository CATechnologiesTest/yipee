import { ParsedObject } from '../parse/ParsedObject';

/** common command entry */

export class Command extends ParsedObject {

  public static OBJECT_NAME = 'command';

  value: string[];
  container: string;

  public static construct(type: string): ParsedObject {
    return new Command();
  }

  constructor() {
    super(Command.OBJECT_NAME);
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
