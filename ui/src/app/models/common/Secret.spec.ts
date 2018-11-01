import { TestBed } from '@angular/core/testing';
import { Secret } from './Secret';
import { NameChangeEvent } from '../Events';

describe('Secret', () => {

  const flat1 = {
    'type': 'secret-volume',
    'name': 'secret-0',
    'source': '',
    'alternate-name': '',
    'default-mode': '444',
    'secret-volume': '88373737373666262',
    'id': '0e3d910b-7446-4d6c-8e40-b9513d23e216'
  };

  it('should handle round trip', () => {
    const a1 = Secret.construct(Secret.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should fire name change event', () => {
    const a1 = Secret.construct(Secret.OBJECT_NAME) as Secret;
    a1.name = 'foo';
    a1.onNameChange.subscribe((event: NameChangeEvent) => {
      expect(event.oldName).toEqual('foo');
      expect(event.newName).toEqual('bar');
    });
    a1.name = 'bar';
  });

});
