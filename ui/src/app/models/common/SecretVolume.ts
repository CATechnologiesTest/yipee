import { ParsedObject } from '../parse/ParsedObject';
import { EventEmitter } from '@angular/core';
import { NameChangeEvent } from '../Events';
import { Annotation } from './Annotation';
import { SecretRef } from './SecretRef';

/** common secret-volume entry */

export class SecretVolume extends ParsedObject {

  public static OBJECT_NAME = 'secret-volume';

  private _name: string;
  /** k8s or auto */
  source: string;
  /** mode to apply to each secret item if not specified */
  default_mode: string;
  secret_name: string;
  public onNameChange: EventEmitter<NameChangeEvent> = new EventEmitter<NameChangeEvent>();

  public static construct(type: string): ParsedObject {
    return new SecretVolume();
  }

  constructor() {
    super(SecretVolume.OBJECT_NAME);
    this.default_mode = '644';
  }

  /** is the object empty */
  isEmpty(): boolean {
    return (this.name === undefined && this.source === undefined && this.default_mode === '644');
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.name = flat['name'];
    this.source = flat['source'];
    this.default_mode = flat['default-mode'];
    this.secret_name = flat['secret-name'];
  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['name'] = this.name;
    flat['source'] = this.source;
    flat['default-mode'] = this.default_mode + '';
    flat['secret-name'] = this.secret_name;
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
        .filter((p) => p.secret_volume === this.id);
      return refs;
    } else {
      return [];
    }
  }

}
