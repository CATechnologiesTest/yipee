import { TestBed } from '@angular/core/testing';
import { ConfigRef } from './ConfigRef';

describe('ConfigRef', () => {

  const flat1 = {
    'type': 'config-ref',
    'name': undefined,
    'path': '/path/foo',
    'container': 'c1',
    'container-name': undefined,
    'config': 'config-1',
    'mode': '0444',
    'readonly': true,
    'id': 'b6124aa0-4a61-4dbf-a5d1-4a3031f46f79'
  };

  it('should handle round trip', () => {
    const a1 = ConfigRef.construct(ConfigRef.OBJECT_NAME) as ConfigRef;
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

});
