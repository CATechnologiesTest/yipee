import { ParsedObject } from '../parse/ParsedObject';
import { EventEmitter } from '@angular/core';
import { NameChangeEvent } from '../Events';
import { Annotation } from '../common/Annotation';
import { Secret } from '../common/Secret';

/** common secret-ref entry */

export class K8sSecretRef extends ParsedObject {

  public static OBJECT_NAME = 'k8s-secret-ref';

  mount_path: string;
  secret_volume: string;
  container: string;

  public static construct(type: string): ParsedObject {
    return new K8sSecretRef();
  }

  constructor() {
    super(K8sSecretRef.OBJECT_NAME);
    this.mount_path = '';
    this.secret_volume = '-- Select Volume --';
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
    this.mount_path = flat['mount-path'];
    this.secret_volume = flat['secret-volume'];
    this.container = flat['container'];
  }

  /** covert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['mount-path'] = this.mount_path;
    flat['secret-volume'] = this.secret_volume;
    flat['container'] = this.container;
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
      return 'ERROR';
    }
    return secret.name;
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
