import { ParsedObject } from '../parse/ParsedObject';
import { EventEmitter } from '@angular/core';
import { NameChangeEvent } from '../Events';
import { Annotation } from './Annotation';
import { Secret } from './Secret';

/** common secret-ref entry */

export class SecretRef extends ParsedObject {

  public static OBJECT_NAME = 'secret-ref';

  uid: string;
  gid: string;
  mode: string;
  secret: string;
  source: string;
  target: string;
  container: string;
  readonly: boolean;
  mount_path: string;
  secret_volume: string;

  public static construct(type: string): ParsedObject {
    return new SecretRef();
  }

  constructor() {
    super(SecretRef.OBJECT_NAME);
    this.uid = '0';
    this.gid = '0';
  }

  /** remove this secret-ref */
  remove(): void {
    const secret = this.getSecret();
    if (secret !== undefined) {
      secret.remove();
    }
    super.remove();
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.uid = flat['uid'];
    this.gid = flat['gid'];
    this.mode = flat['mode'];
    this.secret = flat['secret'];
    this.source = flat['source'];
    this.target = flat['target'];
    this.container = flat['container'];
    this.readonly = flat['readonly'];
    this.mount_path = flat['mount-path'];
    this.secret_volume = flat['secret-volume'];
  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['uid'] = this.uid;
    flat['gid'] = this.gid;
    flat['mode'] = this.secret_default_mode;
    flat['secret'] = this.secret;
    flat['source'] = this.secret_name;
    flat['target'] = this.target;
    flat['container'] = this.container;
    flat['readonly'] = this.readonly;
    flat['mount-path'] = this.mount_path;
    flat['secret-volume'] = this.secret_volume;
    return flat;
  }

  get secret_default_mode(): string {
    const secret = this.getSecret();
    if (secret === undefined) {
      return '000';
    }
    return secret.default_mode + '';
  }

  get secret_name(): string {
    const secret = this.getSecret();
    if (secret === undefined) {
      return '';
    }
    return '';
  }

  private getSecret(): Secret {
    if (this.finder === undefined) {
      return undefined;
    }
    return this.finder.objects
      .filter((p) => p.type === Secret.OBJECT_NAME)
      .map((p: Secret) => p as Secret)
      .find((p) => p.id === this.secret_volume);
  }


}
