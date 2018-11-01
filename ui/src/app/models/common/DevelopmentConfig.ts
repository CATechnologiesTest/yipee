import { ParsedObject } from '../parse/ParsedObject';

/** Yipee flat file development-config entry. */

export class DevelopmentConfig extends ParsedObject {

  public static OBJECT_NAME = 'development-config';

  configured: string;
  tag: string;
  image: string;
  repository: string;

  public static construct(type: string): ParsedObject {
    return new DevelopmentConfig();
  }

  constructor() {
    super(DevelopmentConfig.OBJECT_NAME);
    this.tag = '';
    this.image = '';
    this.repository = '';
  }

  /** is the object empty */
  isEmpty(): boolean {
    return (this.tag.length === 0
      && this.image.length === 0
      && this.repository.length === 0);
  }
  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.configured = flat['configured'];
    this.tag = flat['tag'];
    this.image = flat['image'];
    this.repository = flat['repository'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['configured'] = this.configured;
    flat['tag'] = this.tag;
    flat['image'] = this.image;
    flat['repository'] = this.repository;
    return flat;
  }

}
