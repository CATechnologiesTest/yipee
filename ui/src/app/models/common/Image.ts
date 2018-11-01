import { ParsedObject } from '../parse/ParsedObject';

/** Yipee flat file image entry. */

export class Image extends ParsedObject {

  public static OBJECT_NAME = 'image';

  container: string;
  value: string;

  public static construct(type: string): ParsedObject {
    return new Image();
  }

  constructor() {
    super(Image.OBJECT_NAME);
    this.value = '';
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.container = flat['container'];
    this.value = flat['value'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['container'] = this.container;
    flat['value'] = this.value;
    return flat;
  }

}
