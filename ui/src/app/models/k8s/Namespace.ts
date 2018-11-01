import { FinderUtilities } from '../common/FinderUtilities';
import { ParsedObject } from '../parse/ParsedObject';

/** common namespace entry */

export class Namespace extends ParsedObject {

  public static OBJECT_NAME = 'model-namespace';

  private _name: string;
  private metadata: string;

  public static construct(type: string): ParsedObject {
    return new Namespace();
  }

  constructor() {
    super(Namespace.OBJECT_NAME);
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.name = flat['name'];
  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['name'] = this.name;
    return flat;
  }

  /** remove the namespace and all references to this namespace */
  remove(): void {
    super.remove();
  }

  /** is the object empty */
  isEmpty(): boolean {
    if (this.name === '') {
      return true;
    }

    return false;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

}
