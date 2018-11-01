import { ParsedObject } from '../parse/ParsedObject';

/** Yipee flat file external-config entry. */

export class ExternalConfig extends ParsedObject {

  public static OBJECT_NAME = 'external-config';

  configured: string;
  image: string;
  server: string;
  proxy_type: string;

  public static construct(type: string): ParsedObject {
    return new ExternalConfig();
  }

  constructor() {
    super(ExternalConfig.OBJECT_NAME);
    this.image = '';
    this.server = '';
    this.proxy_type = '';
  }

  /** is the object empty */
  isEmpty(): boolean {
    return (this.image.length === 0
      && this.server.length === 0
      && this.proxy_type.length === 0);
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.configured = flat['configured'];
    this.image = flat['image'];
    this.server = flat['server'];
    this.proxy_type = flat['proxy-type'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['configured'] = this.configured;
    flat['image'] = this.image;
    flat['server'] = this.server;
    flat['proxy-type'] = this.proxy_type;
    return flat;
  }

}
