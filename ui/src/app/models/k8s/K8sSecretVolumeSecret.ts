import { ParsedObject } from '../parse/ParsedObject';
import { EventEmitter } from '@angular/core';
import { NameChangeEvent } from '../Events';
import { Annotation } from '../common/Annotation';
import { K8sSecretVolume } from './K8sSecretVolume';

/** common secret-ref entry */

export class K8sSecretVolumeSecret extends ParsedObject {

  public static OBJECT_NAME = 'k8s-secret-volume-secret';

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
  key: string;
  path: string;

  public static construct(type: string): ParsedObject {
    return new K8sSecretVolumeSecret();
  }

  constructor() {
    super(K8sSecretVolumeSecret.OBJECT_NAME);
    this.uid = '0';
    this.gid = '0';
  }

}
