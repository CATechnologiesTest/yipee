import { TestBed } from '@angular/core/testing';
import { Command } from './Command';

describe('Command', () => {

  const flat1 = {
    'type': 'command',
    'value': ['rm -rf /', 'foo'],
    'container': 'b7e62be9-e87b-4d54-90c3-1a477b04014b',
    'id': 'b6124aa0-4a61-4dbf-a5d1-4a3031f46f79'
  };

  it('should handle round trip', () => {
    const a1 = Command.construct(Command.OBJECT_NAME) as Command;
    a1.fromFlat(flat1);
    expect(a1.value.length).toEqual(2);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should be empty if new', () => {
    const a1 = Command.construct(Command.OBJECT_NAME) as Command;
    expect(a1.isEmpty()).toBeTruthy();
  });

});
