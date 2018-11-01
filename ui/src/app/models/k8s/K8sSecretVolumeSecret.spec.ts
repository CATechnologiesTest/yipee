import { TestBed } from '@angular/core/testing';
import { K8sSecretVolumeSecret } from './K8sSecretVolumeSecret';
import { NameChangeEvent } from '../Events';

describe('K8sSecretVolumeSecret', () => {

  const flat1 = {
    'type': 'k8s-secret-volume-secret',
    'uid': '111',
    'gid': '222',
    'mode': '000',
    'secret': 'secret-uuid',
    'source': '',
    'target': 'target',
    'container': 'uuid-container',
    'readonly': false,
    'mount-path': '/var/secrets',
    'secret-volume': '88d8d88d8d8',
    'id': '0e3d910b-7446-4d6c-8e40-b9513d23e216'
  };

});
