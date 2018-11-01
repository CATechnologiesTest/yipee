import { ParsedObject } from '../parse/ParsedObject';

/** common image-pull-policy entry */

export class ImagePullPolicy extends ParsedObject {

  public static OBJECT_NAME = 'image-pull-policy';

  /** Always or IfNotPresent */
  value: string;
  container: string;

  public static construct(type: string): ParsedObject {
    return new ImagePullPolicy();
  }

  constructor() {
    super(ImagePullPolicy.OBJECT_NAME);
    this.value = '';
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
