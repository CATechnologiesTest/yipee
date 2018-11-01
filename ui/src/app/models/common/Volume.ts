import { BaseVolume } from './BaseVolume';
import { ParsedObject } from '../parse/ParsedObject';
import { VolumeRef } from './VolumeRef';
import { Container } from './Container';

/** common volume entry */

export class Volume extends BaseVolume {

  public static OBJECT_NAME = 'volume';

  /** Filesystem or Block – default: Filesystem */
  volume_mode: string;
  /** one or more of ReadOnlyMany, ReadWriteOnce, ReadWriteMany */
  private _access_modes: string[];
  storage_class: string;
  storage: string;
  selector: any;
  is_template: boolean;
  physical_volume_name: string;
  claim_name: string;

  public static construct(type: string): ParsedObject {
    return new Volume();
  }

  constructor() {
    super(Volume.OBJECT_NAME);
    this.name = '';
    this._access_modes = [];
    this.selector = {
      matchLabels: {}
    };
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.volume_mode = flat['volume-mode'];
    this._access_modes = flat['access-modes'];
    this.storage_class = flat['storage-class'];
    this.storage = flat['storage'];
    this.selector = flat['selector'];
    this.is_template = flat['is-template'];
    this.physical_volume_name = flat['physical-volume-name'];
    this.claim_name = flat['claim-name'];
  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['volume-mode'] = this.volume_mode;
    flat['access-modes'] = this._access_modes;
    flat['storage-class'] = this.storage_class;
    flat['storage'] = (this.storage === undefined ? '' : this.storage);
    flat['selector'] = this.selector;
    flat['is-template'] = this.is_template;
    flat['physical-volume-name'] = this.physical_volume_name;
    flat['claim-name'] = this.claim_name;
    return flat;
  }

  get access_modes(): string[] {
    return this._access_modes;
  }

  set access_modes(value: string[]) {
    this._access_modes = value;
    this.refreshObjectsByType(Container.OBJECT_NAME);
  }

  /** remove this volume and any references to this volume */
  remove(): void {
    super.remove();
    for (const ref of this.volume_ref) {
      ref.remove();
    }
  }

  get volume_ref(): VolumeRef[] {
    return super.getVolumeRef();
  }

}
