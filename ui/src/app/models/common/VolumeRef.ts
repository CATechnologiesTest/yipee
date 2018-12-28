import { ParsedObject } from '../parse/ParsedObject';
import { Annotation } from './Annotation';
import { BaseVolume } from './BaseVolume';
import { Volume } from './Volume';
import { Container } from './Container';


/** common volume-ref entry */

export class VolumeRef extends ParsedObject {

  public static OBJECT_NAME = 'volume-ref';

  path: string;
  sub_path: string;
  volume: string;
  container: string;

  /** ReadOnlyMany, ReadWriteOnce, ReadWriteMany */
  access_mode: string;

  public static construct(type: string): ParsedObject {
    return new VolumeRef();
  }

  constructor() {
    super(VolumeRef.OBJECT_NAME);
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.path = flat['path'];
    this.sub_path = flat['sub-path'];
    this.container = flat['container'];
    this.volume = flat['volume'];
    this.access_mode = flat['access-mode'];
  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['path'] = this.path;
    flat['sub-path'] = this.sub_path;
    flat['container'] = this.container;
    // For proper validation, the backend requires the container name to be passed
    flat['container-name'] = this.findContainerNameById(this.container);
    flat['volume'] = this.volume;
    flat['access-mode'] = this.access_mode;
    flat['volume-name'] = this.volume_name;
    return flat;
  }

  findContainerNameById(id: string): string {
    if (this.finder === undefined) {
      return undefined;
    }
    const c = this.finder.objects
      .filter((p) => p.type === Container.OBJECT_NAME)
      .map((p: Container) => p as Container)
      .find((p) => p.id === id);

    if (c) {
      return c.name;
    }
    return undefined;
  }

  get volume_name(): string {
    const vol = this.getBaseVolume();
    if (vol === undefined) {
      return 'ERROR';
    }
    return vol.name;
  }

  get volume_type(): string {
    const vol = this.getBaseVolume();
    return vol.type;
  }

  get base_volume(): BaseVolume {
    return this.getBaseVolume();
  }

  get access_modes(): string[] {
    const volume = this.getVolume();
    if (volume) {
      return volume.access_modes;
    }
    return [];
  }

  public getBaseVolume(): BaseVolume {
    if (this.finder === undefined) {
      return undefined;
    }
    return this.finder.objects
      .filter((p) => p.base_type === BaseVolume.BASE_TYPE)
      .map((p: BaseVolume) => p as BaseVolume)
      .find((p) => p.id === this.volume);
  }

  private getVolume(): Volume {
    if (this.finder === undefined) {
      return undefined;
    }
    return this.finder.objects
      .filter((p) => p.base_type === Volume.BASE_TYPE)
      .map((p: Volume) => p as Volume)
      .find((p) => p.id === this.volume);
  }
}
