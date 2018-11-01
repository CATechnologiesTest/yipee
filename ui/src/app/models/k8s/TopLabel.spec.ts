import { TestBed } from '@angular/core/testing';
import { TopLabel } from './TopLabel';

describe('TopLabel', () => {

  const flat1 = {
    'type': 'top-label',
    'cgroup': 'd0bef4cf-5f0b-4fa1-b8b0-5da4bfe6b26c',
    'key': 'io.yipee.TopLabel',
    'value': 'foo',
    'id': '0e3d910b-7446-4d6c-8e40-b9513d23e216'
  };

  it('should handle round trip', () => {
    const a1 = TopLabel.construct(TopLabel.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

});
