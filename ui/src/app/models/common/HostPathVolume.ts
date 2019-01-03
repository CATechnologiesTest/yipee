import { BaseVolume } from './BaseVolume';
import { ParsedObject } from '../parse/ParsedObject';
import { VolumeRef } from './VolumeRef';
import { FinderUtilities } from './FinderUtilities';

/** common host-path-volume entry */

export class HostPathVolume extends BaseVolume {

  public static OBJECT_NAME = 'host-path-volume';

  /** '', DirectoryOrCreate, Directory, FileOrCreate, File, Socket, CharDevice, BlockDevice */
  host_path_type: string;
  host_path: string;
  cgroup: string;

  public static construct(type: string): ParsedObject {
    return new HostPathVolume();
  }

  constructor() {
    super(HostPathVolume.OBJECT_NAME);
    this.name = '';
    this.host_path_type = '';
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.host_path_type = flat['host-path-type'];
    this.cgroup = flat['cgroup'];
    this.host_path = flat['host-path'];
  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['host-path-type'] = this.host_path_type;
    flat['cgroup'] = this.cgroup;
    flat['host-path'] = this.host_path;
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
