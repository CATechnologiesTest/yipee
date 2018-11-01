import { TestBed } from '@angular/core/testing';
import { K8sSecretVolume } from './K8sSecretVolume';
import { NameChangeEvent } from '../Events';

describe('Secret', () => {

  const flat1 = {
    'type': 'k8s-secret-volume',
    'name': 'secret-0',
    'source': '',
    'default-mode': '444',
    'secret-name': 'newsecret',
    'secret-array': [],
    'id': '0e3d910b-7446-4d6c-8e40-b9513d23e216'
  };

  it('should handle round trip', () => {
    const a1 = K8sSecretVolume.construct(K8sSecretVolume.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should fire name change event', () => {
    const a1 = K8sSecretVolume.construct(K8sSecretVolume.OBJECT_NAME) as K8sSecretVolume;
    a1.name = 'foo';
    a1.onNameChange.subscribe((event: NameChangeEvent) => {
      expect(event.oldName).toEqual('foo');
      expect(event.newName).toEqual('bar');
    });
    a1.name = 'bar';
  });

});
