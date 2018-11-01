import { ParsedObject } from '../parse/ParsedObject';
import { EventEmitter } from '@angular/core';
import { NameChangeEvent } from '../Events';
import { Annotation } from './Annotation';
import { SecretRef } from './SecretRef';

/** common secret entry */

export class Secret extends ParsedObject {

  public static OBJECT_NAME = 'secret-volume';

  private _name: string;
  /** empty string -f 'external', file name if 'file' */
  source: string;
  /** empty string if 'file', or 'external' without name */
  alternate_name: string;
  /** mode to apply to each secret item if not specified */
  default_mode: string;
  public onNameChange: EventEmitter<NameChangeEvent> = new EventEmitter<NameChangeEvent>();
  secret_volume: string;

  public static construct(type: string): ParsedObject {
    return new Secret();
  }

  constructor() {
    super(Secret.OBJECT_NAME);
    this.default_mode = '644';
  }

  /** is the object empty */
  isEmpty(): boolean {
    return (this.name === undefined && this.source === undefined && this.alternate_name === undefined && this.default_mode === '644');
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.name = flat['name'];
    this.source = flat['source'];
    this.default_mode = flat['default-mode'];
    this.alternate_name = flat['alternate-name'];
    this.secret_volume = flat['secret-volume'];
  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['name'] = this.name;
    flat['source'] = this.source;
    flat['default-mode'] = this.default_mode + '';
    flat['alternate-name'] = this.alternate_name;
    flat['secret-volume'] = this.secret_volume;
    return flat;
  }

  /** remove this secret and any references to this secret */
  remove(): void {
    super.remove();
    for (const ref of this.secret_ref) {
      ref.remove();
    }
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    for (const ref of this.secret_ref) {
      ref.source = value;
    }
    this.onNameChange.emit(new NameChangeEvent(this._name, value));
    this._name = value;
    this.initiateAttributeChange('name');
  }

  get secret_ref(): SecretRef[] {
    return this.getSecretRef();
  }

  private getSecretRef(): SecretRef[] {
    if (this.finder !== undefined) {
      const refs = this.finder.objects
        .filter((p) => p.type === SecretRef.OBJECT_NAME)
        .map((p: SecretRef) => p as SecretRef)
        .filter((p) => p.secret === this.id);
      return refs;
    } else {
      return [];
    }
  }

}
