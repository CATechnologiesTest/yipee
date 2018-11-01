import { TestBed } from '@angular/core/testing';
import { MapNameStringValueArray, NameStringValue } from './Generic';

describe('Generic', () => {

  const flat1 = {
    'foo': 'bar',
    'ack': 'who'
  };

  it('should handle round trip', () => {
    const mapArray = new MapNameStringValueArray();
    mapArray.fromFlat(flat1);
    expect(mapArray.toFlat()).toEqual(flat1);
  });

  it('should remove items', () => {
    const mapArray = new MapNameStringValueArray();
    mapArray.fromFlat(flat1);
    expect(mapArray.array.length).toEqual(2);
    mapArray.remove(mapArray.array[0].id);
    expect(mapArray.array.length).toEqual(1);
  });

});
