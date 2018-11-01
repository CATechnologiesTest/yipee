import { TestBed } from '@angular/core/testing';
import { K8sAnnotation } from './K8sAnnotation';

describe('Annotation', () => {

  const flat1 = {
    'type': 'k8s-annotation',
    'key': 'ui',
    'value': 'hello',
    'location': ['metadata', 'annotations'],
    'annotated': '1234567890',
    'annotated-name': 'service1',
    'annotated-type': 'k8s-service',
    'id': '182770da-2068-454c-9699-d19df855bf6c'
  };

  const flat2 = {
    'type': 'k8s-annotation',
    'key': 'ui',
    'value': 'hello',
    'location': ['metadata', 'annotations'],
    'annotated': '1234567890',
    'annotated-name': 'service1',
    'annotated-type': 'k8s-service',
    'id': '182770da-2068-454c-9699-d19df855bf6c'
  };

  it('should handle object annotation', () => {
    const a1 = K8sAnnotation.construct(K8sAnnotation.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should handle string annotation', () => {
    const a1 = K8sAnnotation.construct(K8sAnnotation.OBJECT_NAME);
    a1.fromFlat(flat2);
    expect(a1.toFlat()).toEqual(flat2);
  });

});
