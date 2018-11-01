import { TestBed } from '@angular/core/testing';
import { HostPathVolume } from './HostPathVolume';
import { K8sFile } from '../k8s/K8sFile';
import { NameChangeEvent } from '../Events';

describe('HostPathVolume', () => {

  const flat1 = {
    'type': 'host-path-volume',
    'name': 'host-path-0',
    'host-path-type': 'Directory',
    'cgroup': 'id-cgroup-dkdkdkd',
    'host-path': '/foo/bar',
    'id': '0e3d910b-7446-4d6c-8e40-b9513d23e216'
  };

  it('should handle round trip', () => {
    const a1 = HostPathVolume.construct(HostPathVolume.OBJECT_NAME) as HostPathVolume;
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
    expect(a1.host_path_type).toEqual('Directory');
  });

  it('should fire name change event', () => {
    const a1 = HostPathVolume.construct(HostPathVolume.OBJECT_NAME) as HostPathVolume;
    a1.name = 'foo';
    a1.onNameChange.subscribe((event: NameChangeEvent) => {
      expect(event.oldName).toEqual('foo');
      expect(event.newName).toEqual('bar');
    });
    a1.name = 'bar';
  });

  it('should create annotations', () => {
    const file = new K8sFile();
    const a1 = HostPathVolume.construct(HostPathVolume.OBJECT_NAME) as HostPathVolume;
    file.push(a1);
    expect(a1.ui).toBeDefined();
  });


});
