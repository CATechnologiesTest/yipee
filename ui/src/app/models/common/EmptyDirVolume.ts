import { BaseVolume } from './BaseVolume';
import { ParsedObject } from '../parse/ParsedObject';
import { VolumeRef } from './VolumeRef';
import { FinderUtilities } from './FinderUtilities';

/** common empty-dir-volume entry */

export class EmptyDirVolume extends BaseVolume {

  public static OBJECT_NAME = 'empty-dir-volume';

  /** Memory or '', default to '' */
  medium: string;
  cgroup: string;

  public static construct(type: string): ParsedObject {
    return new EmptyDirVolume();
  }

  constructor() {
    super(EmptyDirVolume.OBJECT_NAME);
    this.name = '';
    this.medium = '';
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.medium = flat['medium'];
    this.cgroup = flat['cgroup'];
  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['medium'] = this.medium;
    flat['cgroup'] = this.cgroup;
    return flat;
  }

  /** remove this volume and any references to this volume */
  remove(): void {
    super.remove();
    FinderUtilities.removeObjectAnnotations(this.finder, this.id);

  }

  get volume_ref(): VolumeRef[] {
    return super.getVolumeRef();
  }

}
