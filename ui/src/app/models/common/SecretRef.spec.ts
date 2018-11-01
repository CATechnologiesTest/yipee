import { TestBed } from '@angular/core/testing';
import { SecretRef } from './SecretRef';
import { NameChangeEvent } from '../Events';

describe('SecretRef', () => {

  const flat1 = {
    'type': 'secret-ref',
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

  it('should handle round trip', () => {
    const a1 = SecretRef.construct(SecretRef.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

});
