import { TestBed } from '@angular/core/testing';
import { Config } from './Config';

describe('Config', () => {

  const flat1 = {
    'type': 'config',
    'name': 'foo',
    'map-name': 'bar',
    'default-mode': '000',
    'id': 'b6124aa0-4a61-4dbf-a5d1-4a3031f46f79'
  };

  it('should handle round trip', () => {
    const a1 = Config.construct(Config.OBJECT_NAME) as Config;
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should be empty if new', () => {
    const a1 = Config.construct(Config.OBJECT_NAME) as Config;
    expect(a1.isEmpty()).toBeTruthy();
  });

});
