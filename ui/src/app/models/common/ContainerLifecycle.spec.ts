import { TestBed } from '@angular/core/testing';
import { ContainerLifecycle } from './ContainerLifecycle';

describe('ContainerLifecycle', () => {

  const flat1 = {
    'type': 'container-lifecycle',
    'postStart': {
      'exec': {
        'command': ['rm -rf /', 'foo']
      }
    },
    'container': 'b7e62be9-e87b-4d54-90c3-1a477b04014b',
    'id': 'b6124aa0-4a61-4dbf-a5d1-4a3031f46f79'
  };

  const flat2 = {
    'type': 'container-lifecycle',
    'preStop': {
      'exec': {
        'command': ['rm -rf /', 'foo']
      }
    },
    'container': 'b7e62be9-e87b-4d54-90c3-1a477b04014b',
    'id': 'b6124aa0-4a61-4dbf-a5d1-4a3031f46f79'
  };

  it('should handle postStart round trip', () => {
    const a1 = ContainerLifecycle.construct(ContainerLifecycle.OBJECT_NAME) as ContainerLifecycle;
    a1.fromFlat(flat1);
    expect(a1.post_start.length).toEqual(2);
    expect(a1.pre_stop.length).toEqual(0);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should handle preStop round trip', () => {
    const a1 = ContainerLifecycle.construct(ContainerLifecycle.OBJECT_NAME) as ContainerLifecycle;
    a1.fromFlat(flat2);
    expect(a1.post_start.length).toEqual(0);
    expect(a1.pre_stop.length).toEqual(2);
    expect(a1.toFlat()).toEqual(flat2);
  });

  it('should be empty if new', () => {
    const a1 = ContainerLifecycle.construct(ContainerLifecycle.OBJECT_NAME) as ContainerLifecycle;
    expect(a1.isEmpty()).toBeTruthy();
  });

});
