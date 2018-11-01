import { TestBed } from '@angular/core/testing';
import { Parser } from './Parser';
import { ParsedObject } from './ParsedObject';
import { ClassLookupEntry } from './ClassLookupEntry';

class TestNetworkRefClass extends ParsedObject {

  public static construct(type: string): TestNetworkRefClass {
    return new TestNetworkRefClass(type);
  }

  constructor(type: string) {
    super(type);
  }

}

describe('Parser', () => {

  const simpleFlat = {
    'network-ref': [
      {
        'type': 'network-ref',
        'aliases': [],
        'container': '4da5e934-65e7-41c5-a0c3-60adbb9b4e28',
        'name': 'default',
        'id': '077be77a-1a48-47d0-9361-9d79e0f0d878'
      },
      {
        'type': 'network-ref',
        'aliases': [],
        'container': 'f0edf0b7-4f1e-4008-a100-30492a9979ce',
        'name': 'default',
        'id': 'cf9f98df-afab-4f2f-9eab-f717d1a494cc'
      },
      {
        'type': 'network-ref',
        'aliases': [],
        'container': 'cf65af44-fdd1-4d1c-9816-a66abe34a10c',
        'name': 'default',
        'id': '8818b7fe-2a51-4e61-999d-fa8913a463ca'
      },
      {
        'type': 'network-ref',
        'aliases': [],
        'container': 'e8ede656-e1d1-40f3-9381-b59fd4f657f6',
        'name': 'default',
        'id': 'b55e6da7-e11a-4792-a853-48fcf8aa52af'
      }
    ]
  };

  it('should parse simple file', () => {
    const lookupEntries = [
      new ClassLookupEntry('network-ref', TestNetworkRefClass.construct)
    ];
    const parser = new Parser(lookupEntries);
    const parsedObjects = [];
    expect(parser.fromFlat(simpleFlat,
      this,
      (context: any, object: ParsedObject) => {
        expect(object instanceof TestNetworkRefClass).toBeTruthy();
        parsedObjects.push(object);
      },
      (context: any, object: any) => {
        // no held objects should be generated
        expect(true).toBeFalsy();
      }
    )).toBeTruthy();
    expect(parsedObjects.length).toEqual(4);
  });

});
