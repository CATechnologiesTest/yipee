import { TestBed } from '@angular/core/testing';
import { VolumeRef } from './VolumeRef';
import { Container } from './Container';
import { Finder } from '../parse/Finder';
import { Volume } from './Volume';


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
  it('should default the access_mode from the volume if one is not choosen', () => {
    const f = new Finder();
    const vr = VolumeRef.construct(VolumeRef.OBJECT_NAME) as VolumeRef;
    const c = Container.construct(Container.OBJECT_NAME) as Container;
    const v = Volume.construct(Volume.OBJECT_NAME) as Volume;
    [vr, c, v].forEach((o) => f.push(o));
    c.name = 'foo';
    vr.container = c.id;
    vr.volume = v.id;
    v.access_modes = ['bar'];
    let flat = vr.toFlat();
    expect(flat['volume']).toBeDefined();
    expect(flat['access-mode']).toEqual(v.access_modes[0]);
    vr.access_mode = 'foo';
    flat = vr.toFlat();
    expect(flat['access-mode']).toEqual('foo');


  });

});
