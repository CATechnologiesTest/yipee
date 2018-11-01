import { TestBed } from '@angular/core/testing';
import { Volume } from './Volume';
import { K8sFile } from '../k8s/K8sFile';
import { NameChangeEvent } from '../Events';

describe('Volume', () => {

  const flat1 = {
    'type': 'volume',
    'name': 'volume-0',
    'volume-mode': 'Filesystem',
    'access-modes': ['ReadOnlyMany'],
    'storage-class': 'slow',
    'storage': '100G',
    'selector': 'foo=bar',
    'is-template': true,
    'physical-volume-name': 'volume-0',
    'claim-name': 'claim-name',
    'id': '0e3d910b-7446-4d6c-8e40-b9513d23e216'
  };

  it('should handle round trip', () => {
    const a1 = Volume.construct(Volume.OBJECT_NAME) as Volume;
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
    expect(a1.is_template).toBeTruthy();
  });

  it('should fire name change event', () => {
    const a1 = Volume.construct(Volume.OBJECT_NAME) as Volume;
    a1.name = 'foo';
    a1.onNameChange.subscribe((event: NameChangeEvent) => {
      expect(event.oldName).toEqual('foo');
      expect(event.newName).toEqual('bar');
    });
    a1.name = 'bar';
  });

  it('should create annotations', () => {
    const file = new K8sFile();
    const a1 = Volume.construct(Volume.OBJECT_NAME) as Volume;
    file.push(a1);
    a1.description = 'foo';
    expect(a1.description).toBe('foo');
    expect(a1.ui).toBeDefined();
  });

});
