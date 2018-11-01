import { TestBed } from '@angular/core/testing';
import { ExtraHosts } from './ExtraHosts';

describe('ExtraHosts', () => {

  const flat1 = {
    'type': 'extra-hosts',
    'cgroup': '4da5e934-65e7-41c5-a0c3-60adbb9b4e28',
    'value': [],
    'id': 'e62749a9-d23a-4324-8d46-4649feb301d8'
  };

  it('should handle round trip', () => {
    const a1 = ExtraHosts.construct(ExtraHosts.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

});
