import { TestBed } from '@angular/core/testing';
import { VolumeRef } from './VolumeRef';
import { NameChangeEvent } from '../Events';

describe('VolumeRef', () => {

  const flat1 = {
    'type': 'volume-ref',
    'container': 'd0bef4cf-5f0b-4fa1-b8b0-5da4bfe6b26c',
    'volume': 'd0bef4cf-5f0b-4fa1-b8b0-dddddddddd',
    'volume-name': 'ERROR',
    'path': '/var/log',
    'sub-path': '/save',
    'access-mode': 'ReadOnlyMany',
    'id': '0e3d910b-7446-4d6c-8e40-b9513d23e216'
  };

  it('should handle round trip', () => {
    const a1 = VolumeRef.construct(VolumeRef.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

});
