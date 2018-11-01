import { TestBed } from '@angular/core/testing';
import { PortMapping } from './PortMapping';

describe('PortMapping', () => {

  const flat1 = {
    'type': 'port-mapping',
    'name': 'name',
    'svc-port-name': 'name',
    'container': 'd0bef4cf-5f0b-4fa1-b8b0-5da4bfe6b26c',
    'internal': '3000',
    'external': '5000',
    'node-port': '5000',
    'protocol': 'udp',
    'defining-service': 'foo',
    'container-references': true,
    'id': 'af84ab44-e1a9-420f-85b8-ccc1c9852fda'
  };

  const flat2 = {
    'type': 'port-mapping',
    'name': 'name',
    'svc-port-name': 'name',
    'container': 'd0bef4cf-5f0b-4fa1-b8b0-5da4bfe6b26c',
    'internal': '3000',
    'external': '*',
    'node-port': '',
    'protocol': 'udp',
    'defining-service': 'foo',
    'container-references': '',
    'id': 'af84ab44-e1a9-420f-85b8-ccc1c9852fda'
  };

  it('should handle round trip', () => {
    const a1 = PortMapping.construct(PortMapping.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should convert external * to blank', () => {
    const a1 = PortMapping.construct(PortMapping.OBJECT_NAME) as PortMapping;
    a1.fromFlat(flat2);
    expect(a1.external).toEqual('');
  });

  it('should handle blank container-references', () => {
    const a1 = PortMapping.construct(PortMapping.OBJECT_NAME) as PortMapping;
    a1.fromFlat(flat2);
    expect(a1.container_references).toBeFalsy();
  });
});
