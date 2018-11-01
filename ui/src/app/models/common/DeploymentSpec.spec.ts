import { TestBed } from '@angular/core/testing';
import { DeploymentSpec } from './DeploymentSpec';

describe('DeploymentSpec', () => {

  const flat1 = {
    'type': 'deployment-spec',
    'count': 10,
    'mode': 'replicated',
    'cgroup': 'd34b9bc1-d772-411b-8936-deccb6e1b997',
    'service-name': 'service name',
    'controller-type': 'StatefulSet',
    'image-pull-secrets': [],
    'termination-grace-period': 60,
    'update-strategy': {
      type: 'OnDelete',
      onDelete: { foo: 1, bar: 2 },
    },
    'pod-management-policy': 'Parallel',
    'id': 'b7e62be9-e87b-4d54-90c3-1a477b04014b',
    'service-account-name': 'san',
    'automount-service-account-token': true,
    'revisionHistoryLimit': null
  };

  it('should handle round trip', () => {
    const a1 = DeploymentSpec.construct(DeploymentSpec.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should parse update strategy correctly for legacy use', () => {
    const a1 = DeploymentSpec.construct(DeploymentSpec.OBJECT_NAME) as DeploymentSpec;
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
    expect(a1.update_strategy).toEqual('OnDelete');
  });

  it('should remove old values from set on update_strategy', () => {
    const a1 = DeploymentSpec.construct(DeploymentSpec.OBJECT_NAME) as DeploymentSpec;
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
    expect(a1.update_strategy).toEqual('OnDelete');
    a1.update_strategy = 'RollingUpdate';
    a1.partition = 6;
    const flat = a1.toFlat();
    expect(flat['update-strategy']).toEqual({type: 'RollingUpdate', rollingUpdate: { partition: 6}});
  });


});
