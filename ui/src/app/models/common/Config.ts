import { ParsedObject } from '../parse/ParsedObject';
import { ConfigRef } from './ConfigRef';

/** common config entry */

export class Config extends ParsedObject {

  public static OBJECT_NAME = 'config';

  private _name: string;
  map_name: string;
  /** mode to apply to each config item if not specified */
  default_mode: string;

  public static construct(type: string): ParsedObject {
    return new Config();
  }

  constructor() {
    super(Config.OBJECT_NAME);
    this.default_mode = '';
  }

  /** is the object empty */
  isEmpty(): boolean {
    return (this._name === undefined && this.map_name === undefined && this.default_mode === '');
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this._name = flat['name'];
    this.default_mode = flat['default-mode'];
    this.map_name = flat['map-name'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['name'] = this._name;
    if (this.default_mode === undefined || this.default_mode === null) {
      flat['default-mode'] = '';
    } else {
      flat['default-mode'] = this.default_mode + '';
    }
    flat['map-name'] = this.map_name;
    return flat;
  }

  get config_ref(): ConfigRef[] {
    return this.getConfigRef();
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    for (const ref of this.config_ref) {
      ref.name = value;
    }
    this._name = value;
    this.initiateAttributeChange('name');
  }

  /** remove the config and all references to this config */
  remove(): void {
    super.remove();
    for (const ref of this.config_ref) {
      ref.remove();
    }
  }

  private getConfigRef(): ConfigRef[] {
    if (this.finder !== undefined) {
      const refs = this.finder.objects
        .filter((p) => p.type === ConfigRef.OBJECT_NAME)
        .map((p: ConfigRef) => p as ConfigRef)
        .filter((p) => p.config === this.id);
      return refs;
    } else {
      return [];
    }
  }


}
