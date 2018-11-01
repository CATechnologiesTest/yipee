import { TestBed } from '@angular/core/testing';
import { Healthcheck } from './Healthcheck';

describe('Healthcheck', () => {

  const flat1 = {
    'type': 'healthcheck',
    'retries': 0,
    'timeout': 0,
    'interval': 0,
    'protocol': 'http',
    'check-type': 'liveness',
    'container': '4da5e934-65e7-41c5-a0c3-60adbb9b4e28',
    'id': '5331d59f-abb4-4979-bbe1-16b4acf38e44',
    'httpGet': {
      'host': 'hc host',
      'port': 'hc port',
      'path': 'hc path',
      'scheme': 'hc sheme'
    }
  };

  const flat2 = {
    'type': 'healthcheck',
    'retries': 0,
    'timeout': 0,
    'interval': 0,
    'healthcmd': ['foo'],
    'protocol': 'exec',
    'check-type': 'liveness',
    'container': '4da5e934-65e7-41c5-a0c3-60adbb9b4e28',
    'id': '5331d59f-abb4-4979-bbe1-16b4acf38e44'
  };

  it('should handle round trip http', () => {
    const a1 = Healthcheck.construct(Healthcheck.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should handle round trip exec', () => {
    const a1 = Healthcheck.construct(Healthcheck.OBJECT_NAME);
    a1.fromFlat(flat2);
    expect(a1.toFlat()).toEqual(flat2);
  });

  it('should be empty if new', () => {
    const a1 = Healthcheck.construct(Healthcheck.OBJECT_NAME) as Healthcheck;
    a1.check_type = Healthcheck.LIVENESS_TYPE;
    expect(a1.isEmpty()).toBeTruthy();
  });

});
