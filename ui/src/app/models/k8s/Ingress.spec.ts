import { TestBed } from '@angular/core/testing';
import { PortMapping } from '../common/PortMapping';
import { Finder } from '../parse/Finder';
import { Ingress, IngressBackend, IngressPath, IngressRule, IngressTLS } from './Ingress';
import { NameChangeEvent } from '../Events';

describe('Ingress', () => {

  const tls1 = {
    'hosts': [
      'foo.bar.com',
      'bar.foo.com'
    ],
    'secretName': 'tls-secret'
  };

  const rule1 = {
    'host': 'cassonone.ca.local',
    'http': {
      'paths': [
        {
          'path': '/',
          'backend': {
            'service-id': 'f2d15293-e55d-490e-9975-e35b91e98fea',
            'servicePort': 8080
          }
        },
        {
          'path': '/adminui',
          'backend': {
            'service-id': 'f2d15293-e55d-490e-9975-e35b91e98fea',
            'servicePort': 8080
          }
        }
      ]
    }
  };

  const path1 = {
    'path': '/',
    'backend': {
      'service-id': 'f2d15293-e55d-490e-9975-e35b91e98fea',
      'servicePort': 8080
    }
  };

  const flat1 = {
    'id': 'ed5f87fc-1248-42eb-85b3-ff8b354e7000',
    'kind': 'Ingress',
    'spec': {
      'tls': [
        {
          'hosts': [
            'foo.bar.com',
            'bar.foo.com'
          ],
          'secretName': 'tls-secret'
        },
        {
          'hosts': [
            'foo.cee.com',
            'bar.dee.com'
          ],
          'secretName': 'tls-secret'
        }
      ],
      'rules': [
        {
          'host': 'cassonone.ca.local',
          'http': {
            'paths': [
              {
                'path': '/',
                'backend': {
                  'service-id': 'f2d15293-e55d-490e-9975-e35b91e98fea',
                  'servicePort': 8080
                }
              },
              {
                'path': '/adminui',
                'backend': {
                  'service-id': 'f2d15293-e55d-490e-9975-e35b91e98fea',
                  'servicePort': 8080
                }
              },
              {
                'path': '/iam/siteminder/console',
                'backend': {
                  'service-id': 'f2d15293-e55d-490e-9975-e35b91e98fea',
                  'servicePort': 8080
                }
              },
              {
                'path': '/castylesr5.1.1/',
                'backend': {
                  'service-id': 'f2d15293-e55d-490e-9975-e35b91e98fea',
                  'servicePort': 8080
                }
              },
              {
                'path': '/proxyui',
                'backend': {
                  'service-id': 'f2d15293-e55d-490e-9975-e35b91e98fea',
                  'servicePort': 9080
                }
              },
              {
                'path': '/castylesr5.1.3/',
                'backend': {
                  'service-id': 'f2d15293-e55d-490e-9975-e35b91e98fea',
                  'servicePort': 9080
                }
              }
            ]
          }
        }
      ]
    },
    'type': 'ingress',
    'metadata': {
      'name': 'jolly-tuatara-casso',
      'labels': {
        'app': 'jolly-tuatara-casso',
        'chart': 'casso-14.00.00',
        'release': 'jolly-tuatara',
        'heritage': 'Tiller'
      },
      'annotations': {
        'kubernetes.io/ingress.class': 'nginx',
        'nginx.ingress.kubernetes.io/ssl-redirect': 'false'
      }
    },
    'apiVersion': 'extensions/v1beta1'
  };

  it('should handle round trip', () => {
    const a1 = Ingress.construct(Ingress.OBJECT_NAME) as Ingress;
    a1.fromFlat(flat1);
    expect(a1.labels).toBeDefined();
    expect(a1.labels.length).toBe(4);
    expect(a1.annotations).toBeDefined();
    expect(a1.annotations.length).toBe(2);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('should handle path round trip', () => {
    const path = new IngressPath();
    path.fromFlat(path1);
    expect(path.path).toEqual('/');
    expect(path.service_id).toEqual('f2d15293-e55d-490e-9975-e35b91e98fea');
    expect(path.service_port).toEqual(8080);
    expect(path.toFlat()).toEqual(path1);
  });

  it('should handle rule round trip', () => {
    const rule = new IngressRule();
    rule.fromFlat(rule1);
    expect(rule.host).toEqual('cassonone.ca.local');
    expect(rule.toFlat()).toEqual(rule1);
  });

  it('should handle tls round trip', () => {
    const tls = new IngressTLS();
    tls.fromFlat(tls1);
    expect(tls.hosts.length).toBe(23);
    expect(tls.toFlat()).toEqual(tls1);
  });

  it('should handle add and remove hosts in tls', () => {
    const tls = new IngressTLS();
    tls.fromFlat(tls1);
    tls.hosts = 'foo.bar, bar.foo';
    expect(tls.hosts).toEqual('foo.bar, bar.foo');
    const tls2 = new IngressTLS();
    tls2.fromFlat(tls.toFlat());
    expect(tls2.hosts).toEqual('foo.bar,bar.foo');
  });

});
