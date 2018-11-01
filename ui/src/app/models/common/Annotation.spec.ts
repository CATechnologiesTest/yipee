import { TestBed } from '@angular/core/testing';
import { Annotation } from './Annotation';

describe('Annotation', () => {

  const flat1 = {
    'type': 'annotation',
    'annotated': 'd0bef4cf-5f0b-4fa1-b8b0-5da4bfe6b26c',
    'key': 'ui',
    'value': {
      'canvas': {
        'id': 'b0fd37f1-0963-0258-9d3a-d8183d8a5310',
        'position': {
          'x': 250,
          'y': 300
        }
      }
    },
    'id': '182770da-2068-454c-9699-d19df855bf6c'
  };

  const flat2 = {
    'type': 'annotation',
    'annotated': 'd0bef4cf-5f0b-4fa1-b8b0-5da4bfe6b26c',
    'key': 'override',
    'value': 'none',
    'id': 'd438779b-a4d1-4303-97fd-bcf6c751d3ec'
  };

  it('should handle object annotation', () => {
    const a1 = Annotation.construct(Annotation.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should handle string annotation', () => {
    const a1 = Annotation.construct(Annotation.OBJECT_NAME);
    a1.fromFlat(flat2);
    expect(a1.toFlat()).toEqual(flat2);
  });

});
