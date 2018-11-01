import { ParsedObject } from '../parse/ParsedObject';
import { EventEmitter } from '@angular/core';
import { NameChangeEvent } from '../Events';
import { Annotation } from '../common/Annotation';
import { K8sSecretVolumeSecret } from './K8sSecretVolumeSecret';

/** common secret-volume entry */

export class K8sSecretVolume extends ParsedObject {

  public static OBJECT_NAME = 'k8s-secret-volume';

  private _name: string;
  /** k8s or auto */
  source: string;
  /** mode to apply to each secret item if not specified */
  default_mode: string;
  secret_name: string;
  secret_array: K8sSecretVolumeSecret[];
  public onNameChange: EventEmitter<NameChangeEvent> = new EventEmitter<NameChangeEvent>();

  public static construct(type: string): ParsedObject {
    return new K8sSecretVolume();
  }

  constructor() {
    super(K8sSecretVolume.OBJECT_NAME);
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
    this.secret_array = flat['secret-array'];
  }

  /** covert to a flat object */
  toFlat(): any {
    // This loop changes the mode, uid, gid fields in each secret of secret
    // array to a string --- required by backend to be a string.
    this.secret_array.forEach(obj => {
      obj.mode = obj.mode.toString();
      obj.uid = obj.uid.toString();
      obj.gid = obj.gid.toString();
    });
    const flat = super.toFlat();
    flat['name'] = this.name;
    flat['source'] = this.source;
    flat['default-mode'] = this.default_mode.toString();
    flat['secret-name'] = this.secret_name;
    flat['secret-array'] = this.secret_array;
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

  get secret_ref(): K8sSecretVolumeSecret[] {
    return this.getSecretRef();
  }

  private getSecretRef(): K8sSecretVolumeSecret[] {
    if (this.finder !== undefined) {
      const refs = this.finder.objects
        .filter((p) => p.type === K8sSecretVolumeSecret.OBJECT_NAME)
        .map((p: K8sSecretVolumeSecret) => p as K8sSecretVolumeSecret)
        .filter((p) => p.secret_volume === this.id);
      return refs;
    } else {
      return [];
    }
  }

}
