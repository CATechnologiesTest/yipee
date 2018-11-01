import { TestBed } from '@angular/core/testing';
import { Image } from './Image';

describe('Image', () => {

  const flat1 = {
    'type': 'image',
    'container': 'd0bef4cf-5f0b-4fa1-b8b0-5da4bfe6b26c',
    'value': 'yipee-tools-spoke-cos.ca.com:5000\/dokken',
    'id': '0e3d910b-7446-4d6c-8e40-b9513d23e216'
  };

  it('should handle round trip', () => {
    const a1 = Image.construct(Image.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

});
