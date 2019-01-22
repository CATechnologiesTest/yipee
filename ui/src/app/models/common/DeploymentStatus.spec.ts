import { TestBed } from '@angular/core/testing';
import { DeploymentStatus } from './DeploymentStatus';

describe('DeploymentStatus', () => {

  const flat1 = {
    'type': 'deployment-status',
    'status': 'red',
    'requested-replicas': 10,
    'active-replicas': 5,
    'restart-count': 100,
    'cgroup': '123456-abcde'
  };

  it('should parse values correctly', () => {
    const a1 = DeploymentStatus.construct(DeploymentStatus.OBJECT_NAME) as DeploymentStatus;
    a1.fromFlat(flat1);
    expect(a1.status).toEqual('red');
    expect(a1.requested_replicas).toEqual(10);
    expect(a1.active_replicas).toEqual(5);
    expect(a1.restart_count).toEqual(100);
    expect(a1.cgroup).toEqual('123456-abcde');
  });

});
