import { TestBed } from '@angular/core/testing';
import { VolumeRef } from './VolumeRef';
import { Container } from './Container';
import { Finder } from '../parse/Finder';


describe('VolumeRef', () => {
  const roundTripID = '12s';
  const roundTripName = 'foo';
  const flat1 = {
    'type': 'volume-ref',
    'container': roundTripID,
    'container-name': roundTripName,
    'volume': 'd0bef4cf-5f0b-4fa1-b8b0-dddddddddd',
    'volume-name': 'ERROR',
    'path': '/var/log',
    'sub-path': '/save',
    'access-mode': 'ReadOnlyMany',
    'id': '0e3d910b-7446-4d6c-8e40-b9513d23e216'
  };

  it('should handle round trip', () => {
    const f = new Finder();
    const c1 = Container.construct(Container.OBJECT_NAME) as Container;
    c1.id = roundTripID;
    c1.name = roundTripName;
    f.push(c1);
    const a1 = VolumeRef.construct(VolumeRef.OBJECT_NAME);
    f.push(a1);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should add the container name to the volumeref', () => {
    const f = new Finder();
    const v1 = VolumeRef.construct(VolumeRef.OBJECT_NAME) as VolumeRef;
    const c1 = Container.construct(Container.OBJECT_NAME) as Container;
    f.push(c1);
    f.push(v1);
    expect(v1.finder).toBeDefined();
    expect(c1.finder).toEqual(v1.finder);
    c1.name = 'foo';
    v1.container = c1.id;
    let flat = v1.toFlat();
    expect(flat['container-name']).toBeDefined();
    expect(flat['container-name']).toEqual('foo');
    // simulate a name change to the container
    c1.name = 'foo2';
    flat = v1.toFlat();
    expect(flat['container-name']).toBeDefined();
    expect(flat['container-name']).toEqual('foo2');

  });

});
