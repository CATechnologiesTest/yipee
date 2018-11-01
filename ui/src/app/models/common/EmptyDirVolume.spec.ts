import { TestBed } from '@angular/core/testing';
import { EmptyDirVolume } from './EmptyDirVolume';
import { K8sFile } from '../k8s/K8sFile';
import { NameChangeEvent } from '../Events';

describe('EmptyDirVolume', () => {

  const flat1 = {
    'type': 'empty-dir-volume',
    'name': 'empty-0',
    'medium': 'Memory',
    'cgroup': 'id-cgroup-dkdkdkd',
    'id': '0e3d910b-7446-4d6c-8e40-b9513d23e216'
  };

  it('should handle round trip', () => {
    const a1 = EmptyDirVolume.construct(EmptyDirVolume.OBJECT_NAME) as EmptyDirVolume;
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
    expect(a1.medium).toEqual('Memory');
  });

  it('should fire name change event', () => {
    const a1 = EmptyDirVolume.construct(EmptyDirVolume.OBJECT_NAME) as EmptyDirVolume;
    a1.name = 'foo';
    a1.onNameChange.subscribe((event: NameChangeEvent) => {
      expect(event.oldName).toEqual('foo');
      expect(event.newName).toEqual('bar');
    });
    a1.name = 'bar';
  });

  it('should create annotations', () => {
    const file = new K8sFile();
    const a1 = EmptyDirVolume.construct(EmptyDirVolume.OBJECT_NAME) as EmptyDirVolume;
    file.push(a1);
    expect(a1.ui).toBeDefined();
  });


});
