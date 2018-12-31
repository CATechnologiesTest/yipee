import { EventEmitter } from '@angular/core';

import { Annotation } from './Annotation';
import { NameChangeEvent } from '../Events';
import { ParsedObject } from '../parse/ParsedObject';
import { VolumeRef } from './VolumeRef';
import { FinderUtilities } from './FinderUtilities';

/** base volume object, this is not saved in the file, only top level objects are saved */

export class BaseVolume extends ParsedObject {

  public static BASE_TYPE = 'base-volume';

  private _name: string;

  public onNameChange: EventEmitter<NameChangeEvent> = new EventEmitter<NameChangeEvent>();

  constructor(type: string) {
    super(type);
    this.base_type = BaseVolume.BASE_TYPE;
  }

  /** is the object empty */
  isEmpty(): boolean {
    return super.isEmpty();
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.name = flat['name'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['name'] = this.name;
    return flat;
  }

  get ui(): any {
    return FinderUtilities.getUi(this.finder, this.id).value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this.onNameChange.emit(new NameChangeEvent(this._name, value));
    this._name = value;
  }

  get description(): string {
    return FinderUtilities.getDescription(this.finder, this.id).value;
  }

  set description(value: string) {
    FinderUtilities.getDescription(this.finder, this.id).value = value;
  }

  /** remove the config and all references to this config */
  remove(): void {
    super.remove();
  }

  protected getVolumeRef(): VolumeRef[] {
    const refs = this.finder.objects
      .filter((p) => p.type === VolumeRef.OBJECT_NAME)
      .map((p: VolumeRef) => p as VolumeRef)
      .filter((p) => p.volume === this.id);
    return refs;
  }

}
