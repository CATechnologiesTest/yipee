import { TestBed } from '@angular/core/testing';
import { Restart } from './Restart';

describe('Restart', () => {

  const flat1 = {
    'type': 'restart',
    'cgroup': '4da5e934-65e7-41c5-a0c3-60adbb9b4e28',
    'value': 'always',
    'id': '084d6d9c-f32c-4fc3-a1ef-195acc19f7b7'
  };

  it('should handle round trip', () => {
    const a1 = Restart.construct(Restart.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should be empty if new', () => {
    const a1 = Restart.construct(Restart.OBJECT_NAME) as Restart;
    expect(a1.isEmpty()).toBeTruthy();
  });

});
