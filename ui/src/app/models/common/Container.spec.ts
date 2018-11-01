import { TestBed } from '@angular/core/testing';
import { Container } from './Container';
import { Finder } from '../parse/Finder';
import { Image } from './Image';
import { NameChangeEvent } from '../Events';

describe('Container', () => {

  const flat1 = {
    'type': 'container',
    'name': 'secret_scanner',
    'position': -1,
    'cgroup': 'b7e62be9-e87b-4d54-90c3-1a477b04014b',
    'id': 'b7e62be9-e87b-4d54-90c3-1a477b04014b'
  };

  const flat2 = {
    'type': 'container',
    'position': 1,
    'name': 'secret_scanner',
    'id': 'b7e62be9-e87b-4d54-90c3-1a477b04014b'
  };

  it('should handle round trip', () => {
    const a1 = Container.construct(Container.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should handle no cgroup', () => {
    const a1 = Container.construct(Container.OBJECT_NAME);
    a1.fromFlat(flat2);
    expect(a1.toFlat()).toEqual(flat2);
  });

  it('should parse position', () => {
    const a2 = Container.construct(Container.OBJECT_NAME) as Container;
    a2.fromFlat(flat2);
    expect(a2.position).toEqual(1);
  });

  it('should create image automatically', () => {
    const finder = new Finder();
    const a1 = Container.construct(Container.OBJECT_NAME) as Container;
    a1.finder = finder;
    a1.fromFlat(flat2);
    expect(a1.image).toEqual('');
    expect(a1.finder.objects.length).toBe(1); // must be added to finder
  });

  it('should create override automatically', () => {
    const finder = new Finder();
    const a1 = Container.construct(Container.OBJECT_NAME) as Container;
    a1.finder = finder;
    a1.fromFlat(flat2);
    expect(a1.override).toEqual('none');
    a1.override = 'develop';
    expect(a1.finder.objects.length).toBe(1); // must be added to finder
    expect(a1.override).toEqual('develop');
  });

  it('should use existing image entry if exists', () => {
    const finder = new Finder();
    const a1 = Container.construct(Container.OBJECT_NAME) as Container;
    a1.finder = finder;
    const i1 = new Image();
    i1.container = a1.id;
    i1.value = 'foo';
    a1.finder.push(i1);
    expect(a1.image).toBe('foo');
    a1.image = 'bar';
    expect(a1.image).toBe('bar');
    expect(i1.value).toBe('bar');
  });

  it('should create development_config automatically', () => {
    const finder = new Finder();
    const a1 = Container.construct(Container.OBJECT_NAME) as Container;
    a1.finder = finder;
    a1.fromFlat(flat2);
    expect(a1.development_config).toBeDefined();
    expect(a1.finder.objects.length).toBe(1); // must be added to finder
  });

  it('should create external_config automatically', () => {
    const finder = new Finder();
    const a1 = Container.construct(Container.OBJECT_NAME) as Container;
    a1.finder = finder;
    a1.fromFlat(flat2);
    expect(a1.external_config).toBeDefined();
    expect(a1.finder.objects.length).toBe(1); // must be added to finder
  });

  it('should fire name change event', () => {
    const a1 = Container.construct(Container.OBJECT_NAME) as Container;
    a1.name = 'foo';
    a1.onNameChange.subscribe((event: NameChangeEvent) => {
      expect(event.oldName).toEqual('foo');
      expect(event.newName).toEqual('bar');
    });
    a1.name = 'bar';
  });

  it('should parse pre and post lifecycle commands', () => {
    const finder = new Finder();
    const a1 = Container.construct(Container.OBJECT_NAME) as Container;
    a1.finder = finder;
    a1.post_start_command = 'foo -f bar';
    expect(a1.container_lifecycle.post_start.length).toBe(3);

    a1.pre_stop_command = 'foo -f bar -f "spaces here"';
    expect(a1.container_lifecycle.pre_stop.length).toBe(5);
  });

});
