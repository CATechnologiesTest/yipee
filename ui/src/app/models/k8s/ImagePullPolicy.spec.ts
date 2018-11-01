import { TestBed } from '@angular/core/testing';
import { ImagePullPolicy } from './ImagePullPolicy';

describe('ImagePullPolicy', () => {

  const flat1 = {
    'type': 'image-pull-policy',
    'value': 'Always',
    'container': 'b7e62be9-e87b-4d54-90c3-1a477b04014b',
    'id': 'b6124aa0-4a61-4dbf-a5d1-4a3031f46f79'
  };

  it('should handle round trip', () => {
    const a1 = ImagePullPolicy.construct(ImagePullPolicy.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

});
