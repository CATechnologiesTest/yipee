import { TestBed } from '@angular/core/testing';
import { SecretVolume } from './SecretVolume';
import { NameChangeEvent } from '../Events';

describe('SecretVolume', () => {

  const flat1 = {
    'type': 'secret-volume',
    'name': 'SecretVolume-0',
    'source': 'k8s',
    'default-mode': '444',
    'secret-name': 'foobar',
    'id': '0e3d910b-7446-4d6c-8e40-b9513d23e216'
  };

  it('should handle round trip', () => {
    const a1 = SecretVolume.construct(SecretVolume.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should fire name change event', () => {
    const a1 = SecretVolume.construct(SecretVolume.OBJECT_NAME) as SecretVolume;
    a1.name = 'foo';
    a1.onNameChange.subscribe((event: NameChangeEvent) => {
      expect(event.oldName).toEqual('foo');
      expect(event.newName).toEqual('bar');
    });
    a1.name = 'bar';
  });

});
