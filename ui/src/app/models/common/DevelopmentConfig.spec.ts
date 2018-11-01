import { TestBed } from '@angular/core/testing';
import { DevelopmentConfig } from './DevelopmentConfig';

describe('DevelopmentConfig', () => {

  const flat1 = {
    'type': 'development-config',
    'tag': 'latest',
    'image': 'postgres',
    'repository': 'localhost:8080',
    'configured': 'b7e62be9-e87b-4d54-90c3-1a477b04014b',
    'id': 'b6124aa0-4a61-4dbf-a5d1-4a3031f46f79'
  };

  it('should handle round trip', () => {
    const a1 = DevelopmentConfig.construct(DevelopmentConfig.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should be empty if new', () => {
    const a1 = DevelopmentConfig.construct(DevelopmentConfig.OBJECT_NAME) as DevelopmentConfig;
    expect(a1.isEmpty()).toBeTruthy();
  });

});
