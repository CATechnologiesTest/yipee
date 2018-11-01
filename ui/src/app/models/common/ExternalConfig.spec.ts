import { TestBed } from '@angular/core/testing';
import { ExternalConfig } from './ExternalConfig';

describe('ExternalConfig', () => {

  const flat1 = {
    'type': 'external-config',
    'image': 'HAProxy',
    'server': '127.0.0.1',
    'proxy-type': 'HTTP',
    'configured': 'b7e62be9-e87b-4d54-90c3-1a477b04014b',
    'id': '780a0cef-939d-44ee-a328-0611a6b7e704'
  };

  it('should handle round trip', () => {
    const a1 = ExternalConfig.construct(ExternalConfig.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should be empty if new', () => {
    const a1 = ExternalConfig.construct(ExternalConfig.OBJECT_NAME) as ExternalConfig;
    expect(a1.isEmpty()).toBeTruthy();
  });

});
