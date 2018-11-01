import { TestBed } from '@angular/core/testing';
import { K8sSecretRef } from './K8sSecretRef';
import { NameChangeEvent } from '../Events';

describe('K8sSecretRef', () => {

  const flat1 = {
    'type': 'k8s-secret-ref',
    'container': 'uuid-container',
    'mount-path': '/var/secrets',
    'secret-volume': '88d8d88d8d8',
    'id': '0e3d910b-7446-4d6c-8e40-b9513d23e216'
  };

  it('should handle round trip', () => {
    const a1 = K8sSecretRef.construct(K8sSecretRef.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

});
