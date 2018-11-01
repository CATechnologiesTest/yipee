import { TestBed } from '@angular/core/testing';
import { ContainerGroup } from './ContainerGroup';
import { Finder } from '../parse/Finder';
import { NameChangeEvent } from '../Events';

describe('ContainerGroup', () => {

  const flat1 = {
    'type': 'container-group',
    'name': 'container-1',
    'pod': 'd34b9bc1-d772-411b-8936-deccb6e1b997',
    'containers': [],
    'container-names': [],
    'source': 'k8s',
    'id': 'b7e62be9-e87b-4d54-90c3-1a477b04014b'
  };

  it('should handle round trip', () => {
    const a1 = ContainerGroup.construct(ContainerGroup.OBJECT_NAME);
    a1.finder = new Finder();
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should fire name change event', () => {
    const a1 = ContainerGroup.construct(ContainerGroup.OBJECT_NAME) as ContainerGroup;
    a1.name = 'foo';
    a1.onNameChange.subscribe((event: NameChangeEvent) => {
      expect(event.oldName).toEqual('foo');
      expect(event.newName).toEqual('bar');
    });
    a1.name = 'bar';
  });

  it('should create deployment spec', () => {
    const a1 = ContainerGroup.construct(ContainerGroup.OBJECT_NAME) as ContainerGroup;
    a1.finder = new Finder();
    a1.fromFlat(flat1);
    expect(a1.deployment_spec).toBeDefined();
    expect(a1.deployment_spec.service_name).toBeDefined();
  });

  it('should create cron job data', () => {
    const a1 = ContainerGroup.construct(ContainerGroup.OBJECT_NAME) as ContainerGroup;
    a1.finder = new Finder();
    a1.fromFlat(flat1);
    expect(a1.cronjob_data).toBeDefined();
  });

});
