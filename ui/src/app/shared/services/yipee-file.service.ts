import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';
import { UserService } from './user.service';

import { YipeeFileMetadata } from '../../models/YipeeFileMetadata';
// import { NameValuePair, PortPair } from '../../models/YipeeFile';
import { YipeeFileResponse } from '../../models/YipeeFileResponse';
// import { YipeeFile, AppInfo, Service, Network, Volume, Secret } from '../../models/YipeeFile';
import { YipeeFileMetadataRaw } from '../../models/YipeeFileMetadataRaw';
import { K8sFile } from '../../models/k8s/K8sFile';
import { Subscriber } from 'rxjs/Subscriber';

@Injectable()
export class YipeeFileService {

  public static rawJoomlaC11yApplication(): YipeeFileMetadata {
    const metadata = new YipeeFileMetadata();
    const raw = {
      '_id': 'ee57fb6a-3c32-11e8-9bd0-f379f27269bb',
      'name': 'joomla-example',
      'author': 'murra10',
      'username': 'murra10',
      'downloads': 0,
      'likes': 0,
      'logodata': null,
      'revcount': 5,
      'ownerorg': '03241d7e-3906-11e8-aa27-b7c5a17c8fb7',
      'fullname': 'murra10@github/e@no@ent/murra10/joomla-base.yipee',
      'isPrivate': true,
      'dateCreated': '2018-04-09T20:16:47.954238+00:00',
      'dateModified': '2018-04-09T20:20:52.111243+00:00',
      'yipeeFile': {
        'volumes': {
          'php_data': {
            'id': 'cf9995c0-010b-463f-8986-31fcf9cef6b5',
            'driver': 'local',
            'annotations': {
              'ui': {
                'canvas': {
                  'position': {
                    'x': 425,
                    'y': 75
                  }
                }
              },
              'description': '[insert description of volume here]'
            }
          },
          'apache_data': {
            'id': '7e68efb3-3d2a-45bb-915c-100f90f2f83e',
            'driver': 'local',
            'annotations': {
              'ui': {
                'canvas': {
                  'position': {
                    'x': 275,
                    'y': 225
                  }
                }
              },
              'description': '[insert description of volume here]'
            }
          },
          'joomla_data': {
            'id': '121b4cda-3349-425e-8d1a-1fd91fabebce',
            'driver': 'local',
            'annotations': {
              'ui': {
                'canvas': {
                  'position': {
                    'x': 425,
                    'y': 225
                  }
                }
              },
              'description': '[insert description of volume here]'
            }
          },
          'mariadb_data': {
            'id': '84ffc23b-2031-4b26-85f0-c808c7ad4917',
            'driver': 'local',
            'annotations': {
              'ui': {
                'canvas': {
                  'position': {
                    'x': 125,
                    'y': 375
                  }
                }
              },
              'description': '[insert description of volume here]'
            }
          }
        },
        'app-info': {
          'id': 'b78e60e3-0d4a-4992-a1ba-c0212ea1ec50',
          'ui': {
            'canvas': {}
          },
          'logo': '[insert name of app logo image here]',
          'name': 'joomla-base',
          'readme': '',
          'description': '[insert app description here]'
        },
        'networks': {
          'default': {
            'id': 'b33c27cc-7199-4b11-8a1d-72bd3d06c5e5',
            'annotations': {
              'ui': {
                'canvas': {
                  'position': {
                    'x': 125,
                    'y': 75
                  }
                }
              },
              'description': ''
            }
          }
        },
        'services': {
          'joomla': {
            'id': '7cdcde11-6ae9-4e77-a657-0674d40f023a',
            'image': 'bitnami/joomla:latest',
            'ports': [
              '80:80/tcp',
              '443:443/tcp'
            ],
            'volumes': [
              'apache_data:/bitnami/apache',
              'joomla_data:/bitnami/joomla',
              'php_data:/bitnami/php'
            ],
            'networks': {
              'default': {
                'id': '47a0277b-2e0e-40cb-8474-6e8d4c6b0f1b',
                'aliases': []
              }
            },
            'depends_on': [
              'mariadb'
            ],
            'annotations': {
              'ui': {
                'canvas': {
                  'position': {
                    'x': 275,
                    'y': 75
                  }
                }
              },
              'override': 'none',
              'description': '[insert description of service here]',
              'externalenv': [
                {
                  'varname': 'JOOMLA_PASSWORD',
                  'reference': 'environment[1]',
                  'description': '[insert description of environment variable here]'
                },
                {
                  'varname': 'MARIADB_ROOT_PASSWORD',
                  'reference': 'environment[4]',
                  'description': '[insert description of environment variable here]'
                }
              ],
              'external_config': {
                'id': '10e4a1a7-2474-4b3c-a9f1-88b77c694d47',
                'image': 'HAProxy',
                'server': '',
                'proxy-type': 'HTTP'
              },
              'development_config': {
                'id': '895cc2a4-7370-4120-ad71-908b6bfa7731',
                'tag': '',
                'image': '',
                'repository': ''
              }
            },
            'environment': [
              'JOOMLA_EMAIL=user@example.com',
              'JOOMLA_PASSWORD=${JOOMLA_PASSWORD}',
              'JOOMLA_USERNAME=user',
              'MARIADB_HOST=mariadb',
              'MARIADB_PASSWORD=${MARIADB_ROOT_PASSWORD}',
              'MARIADB_PORT=3306'
            ]
          },
          'mariadb': {
            'id': 'df543e82-c238-444b-a4fc-d94a6b1e3c5e',
            'image': 'bitnami/mariadb:10.1.26-r2',
            'ports': [
              '3306:3306/tcp'
            ],
            'volumes': [
              'mariadb_data:/bitnami/mariadb'
            ],
            'networks': {
              'default': {
                'id': 'edd33f66-eafa-4338-8ae2-82f0c6642819',
                'aliases': []
              }
            },
            'annotations': {
              'ui': {
                'canvas': {
                  'position': {
                    'x': 125,
                    'y': 225
                  }
                }
              },
              'override': 'none',
              'description': '[insert description of service here]',
              'externalenv': [
                {
                  'varname': 'MARIADB_PASSWORD',
                  'reference': 'environment[2]',
                  'description': '[insert description of environment variable here]'
                },
                {
                  'varname': 'MARIADB_ROOT_PASSWORD',
                  'reference': 'environment[4]',
                  'description': '[insert description of environment variable here]'
                },
                {
                  'varname': 'MARIADB_DATABASE',
                  'reference': 'environment[1]',
                  'description': '[insert description of environment variable here]'
                }
              ],
              'external_config': {
                'id': '952812cf-8b99-45ac-95f3-192b86ad4371',
                'image': 'HAProxy',
                'server': '',
                'proxy-type': 'HTTP'
              },
              'development_config': {
                'id': 'b3804c5b-403c-45ef-9520-2ad069aa62ec',
                'tag': '',
                'image': '',
                'repository': ''
              }
            },
            'environment': [
              'ALLOW_EMPTY_PASSWORD=yes',
              'MARIADB_DATABASE=${MARIADB_DATABASE}',
              'MARIADB_PASSWORD=${MARIADB_PASSWORD}',
              'MARIADB_PORT=3306',
              'MARIADB_ROOT_PASSWORD=${MARIADB_ROOT_PASSWORD}'
            ]
          }
        },
        'hold_for_k8s': [
          {
            'name': '',
            'type': 'extra-port-info',
            'external': '3306',
            'internal': '3306',
            'svc-name': 'mariadb',
            'svc-port-name': '',
            'defining-service': '',
            'container-references': true
          },
          {
            'id': '036c1b2f-e115-4765-8ae0-d8cbd90603bc',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'yipeemon_prometheus_data',
            'container-name': 'yipeemon_prometheus'
          },
          {
            'name': '',
            'type': 'extra-port-info',
            'external': '80',
            'internal': '80',
            'svc-name': 'joomla',
            'svc-port-name': '',
            'defining-service': '',
            'container-references': true
          },
          {
            'id': '929f9146-53ea-4a28-9206-fbaf79e605ac',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'php_data',
            'container-name': 'joomla'
          },
          {
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'type': 'extra-volume-info',
            'volume-id': '2341a38a-1311-41b2-993f-7306fd6d10df'
          },
          {
            'id': '2ca59771-ad13-4574-821d-1fdc5384744f',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadOnlyMany',
            'volume-name': '/proc',
            'container-name': 'yipeemon_nodeexporter'
          },
          {
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'type': 'extra-volume-info',
            'volume-id': '84ffc23b-2031-4b26-85f0-c808c7ad4917'
          },
          {
            'id': '464807c8-88fa-417d-98f2-93440629d8bb',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'php_data',
            'container-name': 'joomla'
          },
          {
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'type': 'extra-volume-info',
            'volume-id': '121b4cda-3349-425e-8d1a-1fd91fabebce'
          },
          {
            'id': '2f1bd576-1ee4-4444-8654-1c4efa8ee22f',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadOnlyMany',
            'volume-name': '/var/run',
            'container-name': 'yipeemon_cadvisor'
          },
          {
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'type': 'extra-volume-info',
            'volume-id': '7e68efb3-3d2a-45bb-915c-100f90f2f83e'
          },
          {
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'type': 'extra-volume-info',
            'volume-id': '84ffc23b-2031-4b26-85f0-c808c7ad4917'
          },
          {
            'type': 'extra-deployment-info',
            'service-name': '',
            'controller-type': '',
            'update-strategy': '',
            'yipee-service-name': 'yipeemon_prometheus',
            'pod-management-policy': '',
            'termination-grace-period': 10
          },
          {
            'id': 'b2592c96-5b71-4820-bcea-c2ac2383a40e',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadOnlyMany',
            'volume-name': '/sys',
            'container-name': 'yipeemon_nodeexporter'
          },
          {
            'id': 'd4745586-1e81-459c-befd-a691226ae612',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'mariadb_data',
            'container-name': 'mariadb'
          },
          {
            'id': '7d0ab558-6b51-4e01-b871-5af92f3dd2a3',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'joomla_data',
            'container-name': 'joomla'
          },
          {
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'type': 'extra-volume-info',
            'volume-id': '121b4cda-3349-425e-8d1a-1fd91fabebce'
          },
          {
            'id': '42fb5cf0-aecc-42dc-9e62-5d8b1bade9d7',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'yipeemon_grafana_data',
            'container-name': 'yipeemon_grafana'
          },
          {
            'id': '702b754e-ead9-47b5-b7bd-19258f345e46',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'mariadb_data',
            'container-name': 'mariadb'
          },
          {
            'id': 'ce7a2c6a-7737-42e8-b054-2969a432dc13',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadOnlyMany',
            'volume-name': '/sys',
            'container-name': 'yipeemon_cadvisor'
          },
          {
            'id': '718ecc08-a3fb-4f21-a86b-3a90b3d472c0',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadOnlyMany',
            'volume-name': '/',
            'container-name': 'yipeemon_nodeexporter'
          },
          {
            'id': 'b905ea14-5d32-4062-b208-d903dea7a05e',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadOnlyMany',
            'volume-name': '/var/lib/docker/',
            'container-name': 'yipeemon_cadvisor'
          },
          {
            'id': '252efdd8-cfc5-4deb-925e-f1e8d3726843',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'apache_data',
            'container-name': 'joomla'
          },
          {
            'id': '179a8547-1100-4887-a98c-df0b299e813d',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'php_data',
            'container-name': 'joomla'
          },
          {
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'type': 'extra-volume-info',
            'volume-id': '7e68efb3-3d2a-45bb-915c-100f90f2f83e'
          },
          {
            'name': '',
            'type': 'extra-port-info',
            'external': '9090',
            'internal': '9090',
            'svc-name': 'yipeemon_caddy',
            'svc-port-name': '',
            'defining-service': '',
            'container-references': true
          },
          {
            'id': '3c0da07c-4ef3-4a7d-979d-9b0bea346de2',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'apache_data',
            'container-name': 'joomla'
          },
          {
            'type': 'extra-deployment-info',
            'service-name': '',
            'controller-type': '',
            'update-strategy': '',
            'yipee-service-name': 'yipeemon_grafana',
            'pod-management-policy': '',
            'termination-grace-period': 10
          },
          {
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'type': 'extra-volume-info',
            'volume-id': '7e68efb3-3d2a-45bb-915c-100f90f2f83e'
          },
          {
            'type': 'extra-deployment-info',
            'service-name': '',
            'controller-type': '',
            'update-strategy': '',
            'yipee-service-name': 'yipeemon_nodeexporter',
            'pod-management-policy': '',
            'termination-grace-period': 10
          },
          {
            'name': '',
            'type': 'extra-port-info',
            'external': '3000',
            'internal': '3000',
            'svc-name': 'yipeemon_caddy',
            'svc-port-name': '',
            'defining-service': '',
            'container-references': true
          },
          {
            'type': 'extra-deployment-info',
            'service-name': '',
            'controller-type': '',
            'update-strategy': '',
            'yipee-service-name': 'yipeemon_cadvisor',
            'pod-management-policy': '',
            'termination-grace-period': 10
          },
          {
            'id': 'e04bdc8c-6e2d-469e-9a87-58ef17ac7b14',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'mariadb_data',
            'container-name': 'mariadb'
          },
          {
            'type': 'extra-deployment-info',
            'service-name': '',
            'controller-type': '',
            'update-strategy': '',
            'yipee-service-name': 'yipeemon_caddy',
            'pod-management-policy': '',
            'termination-grace-period': 10
          },
          {
            'id': '90421f64-dea2-4231-8d0f-ace0701d5bed',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'apache_data',
            'container-name': 'joomla'
          },
          {
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'type': 'extra-volume-info',
            'volume-id': 'cf9995c0-010b-463f-8986-31fcf9cef6b5'
          },
          {
            'id': '1217f39a-d757-43fa-8f51-ec49098fd711',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'php_data',
            'container-name': 'joomla'
          },
          {
            'id': '79682301-a469-4a5f-aa66-28b037ec093a',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadOnlyMany',
            'volume-name': '/',
            'container-name': 'yipeemon_cadvisor'
          },
          {
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'type': 'extra-volume-info',
            'volume-id': 'cf9995c0-010b-463f-8986-31fcf9cef6b5'
          },
          {
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'type': 'extra-volume-info',
            'volume-id': '71ac429f-92a1-4558-b105-dad025187f72'
          },
          {
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'type': 'extra-volume-info',
            'volume-id': '84ffc23b-2031-4b26-85f0-c808c7ad4917'
          },
          {
            'id': '849a39a6-5158-4c5b-ad08-fb71e107f4e0',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'joomla_data',
            'container-name': 'joomla'
          },
          {
            'id': '2a8fe4da-3384-453f-a54f-a18e3aef7ece',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'apache_data',
            'container-name': 'joomla'
          },
          {
            'id': '19b2523d-00ab-404a-bc9e-be8c3a8a865e',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'joomla_data',
            'container-name': 'joomla'
          },
          {
            'id': 'ef88db6c-1a66-4d88-959e-c8e53ff82925',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'joomla_data',
            'container-name': 'joomla'
          },
          {
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'type': 'extra-volume-info',
            'volume-id': '121b4cda-3349-425e-8d1a-1fd91fabebce'
          },
          {
            'id': '5343a794-649d-4cb2-8e1e-cec97d73ad47',
            'type': 'extra-volume-ref-info',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'mariadb_data',
            'container-name': 'mariadb'
          },
          {
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'type': 'extra-volume-info',
            'volume-id': 'cf9995c0-010b-463f-8986-31fcf9cef6b5'
          },
          {
            'name': '',
            'type': 'extra-port-info',
            'external': '443',
            'internal': '443',
            'svc-name': 'joomla',
            'svc-port-name': '',
            'defining-service': '',
            'container-references': true
          }
        ]
      },
      'id': 'ee57fb6a-3c32-11e8-9bd0-f379f27269bb',
      'hasLogo': false,
      'containers': [
        'joomla',
        'mariadb'
      ],
      'revnum': 5,
      'isflat': false,
      'version': null,
      'orgname': 'murra10',
      'uiFile': {
        'volumes': [
          {
            'name': 'mariadb_data',
            'id': '84ffc23b-2031-4b26-85f0-c808c7ad4917',
            'annotations': {
              'ui': {
                'canvas': {
                  'position': {
                    'x': 125,
                    'y': 375
                  }
                }
              },
              'description': '[insert description of volume here]'
            },
            'driver': 'local'
          },
          {
            'name': 'joomla_data',
            'id': '121b4cda-3349-425e-8d1a-1fd91fabebce',
            'annotations': {
              'description': '[insert description of volume here]',
              'ui': {
                'canvas': {
                  'position': {
                    'x': 425,
                    'y': 225
                  }
                }
              }
            },
            'driver': 'local'
          },
          {
            'name': 'php_data',
            'id': 'cf9995c0-010b-463f-8986-31fcf9cef6b5',
            'annotations': {
              'description': '[insert description of volume here]',
              'ui': {
                'canvas': {
                  'position': {
                    'x': 425,
                    'y': 75
                  }
                }
              }
            },
            'driver': 'local'
          },
          {
            'name': 'apache_data',
            'id': '7e68efb3-3d2a-45bb-915c-100f90f2f83e',
            'annotations': {
              'description': '[insert description of volume here]',
              'ui': {
                'canvas': {
                  'position': {
                    'x': 275,
                    'y': 225
                  }
                }
              }
            },
            'driver': 'local'
          }
        ],
        'networks': [
          {
            'id': 'b33c27cc-7199-4b11-8a1d-72bd3d06c5e5',
            'name': 'default',
            'annotations': {
              'description': '',
              'ui': {
                'canvas': {
                  'position': {
                    'x': 125,
                    'y': 75
                  }
                }
              }
            }
          }
        ],
        'appinfo': {
          'id': 'b78e60e3-0d4a-4992-a1ba-c0212ea1ec50',
          'ui': {
            'canvas': {}
          },
          'logo': '[insert name of app logo image here]',
          'name': 'joomla-base',
          'readme': '',
          'description': '[insert app description here]'
        },
        'services': [
          {
            'name': 'joomla',
            'depends_on': [
              'mariadb'
            ],
            'volumes': [
              'apache_data:/bitnami/apache',
              'joomla_data:/bitnami/joomla',
              'php_data:/bitnami/php'
            ],
            'networks': [
              {
                'id': '47a0277b-2e0e-40cb-8474-6e8d4c6b0f1b',
                'aliases': [],
                'name': 'default'
              }
            ],
            'ports': [
              '443:443/tcp',
              '80:80/tcp'
            ],
            'id': '7cdcde11-6ae9-4e77-a657-0674d40f023a',
            'image': 'bitnami/joomla:latest',
            'annotations': {
              'external_config': {
                'id': '10e4a1a7-2474-4b3c-a9f1-88b77c694d47',
                'image': 'HAProxy',
                'server': '',
                'proxy-type': 'HTTP'
              },
              'externalenv': [
                {
                  'description': '[insert description of environment variable here]',
                  'reference': 'environment[1]',
                  'varname': 'JOOMLA_PASSWORD'
                },
                {
                  'description': '[insert description of environment variable here]',
                  'reference': 'environment[4]',
                  'varname': 'MARIADB_ROOT_PASSWORD'
                }
              ],
              'development_config': {
                'id': '895cc2a4-7370-4120-ad71-908b6bfa7731',
                'tag': '',
                'image': '',
                'repository': ''
              },
              'description': '[insert description of service here]',
              'override': 'none',
              'ui': {
                'canvas': {
                  'position': {
                    'x': 275,
                    'y': 75
                  }
                }
              }
            },
            'environment': [
              'JOOMLA_EMAIL=user@example.com',
              'JOOMLA_PASSWORD=${JOOMLA_PASSWORD}',
              'JOOMLA_USERNAME=user',
              'MARIADB_HOST=mariadb',
              'MARIADB_PASSWORD=${MARIADB_ROOT_PASSWORD}',
              'MARIADB_PORT=3306'
            ]
          },
          {
            'name': 'mariadb',
            'volumes': [
              'mariadb_data:/bitnami/mariadb'
            ],
            'networks': [
              {
                'id': 'edd33f66-eafa-4338-8ae2-82f0c6642819',
                'aliases': [],
                'name': 'default'
              }
            ],
            'ports': [
              '3306:3306/tcp'
            ],
            'id': 'df543e82-c238-444b-a4fc-d94a6b1e3c5e',
            'image': 'bitnami/mariadb:10.1.26-r2',
            'annotations': {
              'external_config': {
                'id': '952812cf-8b99-45ac-95f3-192b86ad4371',
                'image': 'HAProxy',
                'server': '',
                'proxy-type': 'HTTP'
              },
              'externalenv': [
                {
                  'description': '[insert description of environment variable here]',
                  'reference': 'environment[2]',
                  'varname': 'MARIADB_PASSWORD'
                },
                {
                  'description': '[insert description of environment variable here]',
                  'reference': 'environment[4]',
                  'varname': 'MARIADB_ROOT_PASSWORD'
                },
                {
                  'description': '[insert description of environment variable here]',
                  'reference': 'environment[1]',
                  'varname': 'MARIADB_DATABASE'
                }
              ],
              'development_config': {
                'id': 'b3804c5b-403c-45ef-9520-2ad069aa62ec',
                'tag': '',
                'image': '',
                'repository': ''
              },
              'description': '[insert description of service here]',
              'override': 'none',
              'ui': {
                'canvas': {
                  'position': {
                    'x': 125,
                    'y': 225
                  }
                }
              }
            },
            'environment': [
              'ALLOW_EMPTY_PASSWORD=yes',
              'MARIADB_DATABASE=${MARIADB_DATABASE}',
              'MARIADB_PASSWORD=${MARIADB_PASSWORD}',
              'MARIADB_PORT=3306',
              'MARIADB_ROOT_PASSWORD=${MARIADB_ROOT_PASSWORD}'
            ]
          }
        ],
        'hold_for_k8s': [
          {
            'name': '',
            'external': '80',
            'svc-port-name': '',
            'type': 'extra-port-info',
            'defining-service': '',
            'svc-name': 'joomla',
            'internal': '80',
            'container-references': true
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '036c1b2f-e115-4765-8ae0-d8cbd90603bc',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'yipeemon_prometheus_data',
            'container-name': 'yipeemon_prometheus'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '929f9146-53ea-4a28-9206-fbaf79e605ac',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'php_data',
            'container-name': 'joomla'
          },
          {
            'type': 'extra-volume-info',
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'volume-id': '2341a38a-1311-41b2-993f-7306fd6d10df'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '2ca59771-ad13-4574-821d-1fdc5384744f',
            'access-mode': 'ReadOnlyMany',
            'volume-name': '/proc',
            'container-name': 'yipeemon_nodeexporter'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '464807c8-88fa-417d-98f2-93440629d8bb',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'php_data',
            'container-name': 'joomla'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '2f1bd576-1ee4-4444-8654-1c4efa8ee22f',
            'access-mode': 'ReadOnlyMany',
            'volume-name': '/var/run',
            'container-name': 'yipeemon_cadvisor'
          },
          {
            'type': 'extra-volume-info',
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'volume-id': '84ffc23b-2031-4b26-85f0-c808c7ad4917'
          },
          {
            'type': 'extra-deployment-info',
            'service-name': '',
            'controller-type': '',
            'update-strategy': '',
            'yipee-service-name': 'yipeemon_prometheus',
            'pod-management-policy': '',
            'termination-grace-period': 10
          },
          {
            'type': 'extra-volume-ref-info',
            'id': 'b2592c96-5b71-4820-bcea-c2ac2383a40e',
            'access-mode': 'ReadOnlyMany',
            'volume-name': '/sys',
            'container-name': 'yipeemon_nodeexporter'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': 'd4745586-1e81-459c-befd-a691226ae612',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'mariadb_data',
            'container-name': 'mariadb'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '7d0ab558-6b51-4e01-b871-5af92f3dd2a3',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'joomla_data',
            'container-name': 'joomla'
          },
          {
            'type': 'extra-volume-info',
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'volume-id': '121b4cda-3349-425e-8d1a-1fd91fabebce'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '42fb5cf0-aecc-42dc-9e62-5d8b1bade9d7',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'yipeemon_grafana_data',
            'container-name': 'yipeemon_grafana'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '702b754e-ead9-47b5-b7bd-19258f345e46',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'mariadb_data',
            'container-name': 'mariadb'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': 'ce7a2c6a-7737-42e8-b054-2969a432dc13',
            'access-mode': 'ReadOnlyMany',
            'volume-name': '/sys',
            'container-name': 'yipeemon_cadvisor'
          },
          {
            'name': '',
            'external': '443',
            'svc-port-name': '',
            'type': 'extra-port-info',
            'defining-service': '',
            'svc-name': 'joomla',
            'internal': '443',
            'container-references': true
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '718ecc08-a3fb-4f21-a86b-3a90b3d472c0',
            'access-mode': 'ReadOnlyMany',
            'volume-name': '/',
            'container-name': 'yipeemon_nodeexporter'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': 'b905ea14-5d32-4062-b208-d903dea7a05e',
            'access-mode': 'ReadOnlyMany',
            'volume-name': '/var/lib/docker/',
            'container-name': 'yipeemon_cadvisor'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '252efdd8-cfc5-4deb-925e-f1e8d3726843',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'apache_data',
            'container-name': 'joomla'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '179a8547-1100-4887-a98c-df0b299e813d',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'php_data',
            'container-name': 'joomla'
          },
          {
            'type': 'extra-volume-info',
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'volume-id': '7e68efb3-3d2a-45bb-915c-100f90f2f83e'
          },
          {
            'type': 'extra-volume-ref-info',
            'container-name': 'mariadb',
            'volume-name': 'mariadb_data',
            'id': '71fa9dc2-4bed-46c6-af0f-7296e4c0516a',
            'access-mode': 'ReadWriteOnce'
          },
          {
            'name': '',
            'external': '9090',
            'svc-port-name': '',
            'type': 'extra-port-info',
            'defining-service': '',
            'svc-name': 'yipeemon_caddy',
            'internal': '9090',
            'container-references': true
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '3c0da07c-4ef3-4a7d-979d-9b0bea346de2',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'apache_data',
            'container-name': 'joomla'
          },
          {
            'type': 'extra-deployment-info',
            'service-name': '',
            'controller-type': '',
            'update-strategy': '',
            'yipee-service-name': 'yipeemon_grafana',
            'pod-management-policy': '',
            'termination-grace-period': 10
          },
          {
            'type': 'extra-volume-info',
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'volume-id': '7e68efb3-3d2a-45bb-915c-100f90f2f83e'
          },
          {
            'type': 'extra-deployment-info',
            'service-name': '',
            'controller-type': '',
            'update-strategy': '',
            'yipee-service-name': 'yipeemon_nodeexporter',
            'pod-management-policy': '',
            'termination-grace-period': 10
          },
          {
            'name': '',
            'external': '3000',
            'svc-port-name': '',
            'type': 'extra-port-info',
            'defining-service': '',
            'svc-name': 'yipeemon_caddy',
            'internal': '3000',
            'container-references': true
          },
          {
            'type': 'extra-deployment-info',
            'service-name': '',
            'controller-type': '',
            'update-strategy': '',
            'yipee-service-name': 'yipeemon_cadvisor',
            'pod-management-policy': '',
            'termination-grace-period': 10
          },
          {
            'type': 'extra-volume-ref-info',
            'id': 'e04bdc8c-6e2d-469e-9a87-58ef17ac7b14',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'mariadb_data',
            'container-name': 'mariadb'
          },
          {
            'type': 'extra-deployment-info',
            'service-name': '',
            'controller-type': '',
            'update-strategy': '',
            'yipee-service-name': 'yipeemon_caddy',
            'pod-management-policy': '',
            'termination-grace-period': 10
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '90421f64-dea2-4231-8d0f-ace0701d5bed',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'apache_data',
            'container-name': 'joomla'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '1217f39a-d757-43fa-8f51-ec49098fd711',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'php_data',
            'container-name': 'joomla'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '79682301-a469-4a5f-aa66-28b037ec093a',
            'access-mode': 'ReadOnlyMany',
            'volume-name': '/',
            'container-name': 'yipeemon_cadvisor'
          },
          {
            'type': 'extra-volume-info',
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'volume-id': 'cf9995c0-010b-463f-8986-31fcf9cef6b5'
          },
          {
            'type': 'extra-volume-info',
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'volume-id': '71ac429f-92a1-4558-b105-dad025187f72'
          },
          {
            'type': 'extra-volume-info',
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'volume-id': '84ffc23b-2031-4b26-85f0-c808c7ad4917'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '849a39a6-5158-4c5b-ad08-fb71e107f4e0',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'joomla_data',
            'container-name': 'joomla'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '2a8fe4da-3384-453f-a54f-a18e3aef7ece',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'apache_data',
            'container-name': 'joomla'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '19b2523d-00ab-404a-bc9e-be8c3a8a865e',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'joomla_data',
            'container-name': 'joomla'
          },
          {
            'name': '',
            'external': '3306',
            'svc-port-name': '',
            'type': 'extra-port-info',
            'defining-service': '',
            'svc-name': 'mariadb',
            'internal': '3306',
            'container-references': true
          },
          {
            'type': 'extra-volume-ref-info',
            'id': 'ef88db6c-1a66-4d88-959e-c8e53ff82925',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'joomla_data',
            'container-name': 'joomla'
          },
          {
            'type': 'extra-volume-info',
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'volume-id': '121b4cda-3349-425e-8d1a-1fd91fabebce'
          },
          {
            'type': 'extra-volume-ref-info',
            'id': '5343a794-649d-4cb2-8e1e-cec97d73ad47',
            'access-mode': 'ReadWriteOnce',
            'volume-name': 'mariadb_data',
            'container-name': 'mariadb'
          },
          {
            'type': 'extra-volume-info',
            'data': {
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false,
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': ''
            },
            'volume-id': 'cf9995c0-010b-463f-8986-31fcf9cef6b5'
          },
          {
            'type': 'extra-volume-ref-info',
            'container-name': 'joomla',
            'volume-name': 'apache_data',
            'id': 'f647298b-e15c-4d0f-988a-f40f35301823',
            'access-mode': 'ReadWriteOnce'
          },
          {
            'type': 'extra-volume-info',
            'volume-id': 'cf9995c0-010b-463f-8986-31fcf9cef6b5',
            'data': {
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': '',
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false
            }
          },
          {
            'type': 'extra-volume-info',
            'volume-id': '84ffc23b-2031-4b26-85f0-c808c7ad4917',
            'data': {
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': '',
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false
            }
          },
          {
            'type': 'extra-volume-ref-info',
            'container-name': 'joomla',
            'volume-name': 'joomla_data',
            'id': '63f6d7b6-6898-4edd-8f1b-a875f931d0a1',
            'access-mode': 'ReadWriteOnce'
          },
          {
            'type': 'extra-volume-ref-info',
            'container-name': 'joomla',
            'volume-name': 'php_data',
            'id': '8400678e-b855-4e78-bbc3-805841946273',
            'access-mode': 'ReadWriteOnce'
          },
          {
            'type': 'extra-volume-info',
            'volume-id': '7e68efb3-3d2a-45bb-915c-100f90f2f83e',
            'data': {
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': '',
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false
            }
          },
          {
            'type': 'extra-volume-info',
            'volume-id': '121b4cda-3349-425e-8d1a-1fd91fabebce',
            'data': {
              'volume-mode': 'Filesystem',
              'access-modes': [
                'ReadWriteOnce'
              ],
              'storage-class': '',
              'storage': '',
              'selector': {
                'matchLabels': {}
              },
              'is-template': false
            }
          }
        ]
      }
    };
    metadata.fromRaw(raw);
    return metadata;
  }

  /** Construct a blank template for yipee file metadata with an empty yipee file. */
  public static newYipeeFileMetadataTemplate(applicationName: string): YipeeFileMetadata {

    // const yipeeFile = new YipeeFile();
    // const appinfo = new AppInfo();
    const yipeeFileMetadata = new YipeeFileMetadata();

    // appinfo.name = applicationName;
    // appinfo.show_progress_bar = true;
    // yipeeFile.appinfo = appinfo;
    yipeeFileMetadata.name = applicationName;
    yipeeFileMetadata.isFlat = false;
    // yipeeFileMetadata.uiFile = yipeeFile;

    return yipeeFileMetadata;

  }

  /** Construct a blank template for k8s file metadata with an empty k8s file. */
  public static newK8sFileMetadataTemplate(applicationName: string): YipeeFileMetadata {

    const k8sFile = new K8sFile();
    const yipeeFileMetadata = new YipeeFileMetadata();

    k8sFile.appInfo.name = applicationName;
    yipeeFileMetadata.name = applicationName;
    yipeeFileMetadata.isFlat = true;
    yipeeFileMetadata.flatFile = k8sFile;

    return yipeeFileMetadata;

  }

  /** Construct a test yipee file metadata object. */
  public static newTestYipeeFileMetadata(applicationName: string): YipeeFileMetadata {

    const metadata = YipeeFileService.newYipeeFileMetadataTemplate(applicationName);
    metadata._id = '5551212';
    metadata.name = applicationName;
    metadata.author = 'AJ Copley';
    metadata.username = 'copan02';
    metadata.containers = [];
    metadata.downloads = 0;
    metadata.likes = 0;
    metadata.canvasdata = null;
    metadata.revcount = 0;
    metadata.dateCreated = new Date();
    metadata.dateModified = new Date();
    metadata.ownerorg = 'd258da3c-97c9-11e7-b422-b74de07713aa';
    metadata.fullname = 'copan02@github/e@no@ent/copan02/doggy.yipee';
    metadata.orgname = 'copan02';
    metadata.isPrivate = true;
    metadata.id = '5551212';
    metadata.hasLogo = false;
    metadata.flatFile = new K8sFile();
    return metadata;

  }

  /** Construct a test K8s file metadata object. */
  public static newTestK8sFileMetadata(applicationName: string): YipeeFileMetadata {

    const metadata = YipeeFileService.newK8sFileMetadataTemplate(applicationName);
    metadata._id = '5551212';
    metadata.name = applicationName;
    metadata.author = 'AJ Copley';
    metadata.username = 'copan02';
    metadata.containers = [];
    metadata.downloads = 0;
    metadata.likes = 0;
    metadata.canvasdata = null;
    metadata.revcount = 0;
    metadata.dateCreated = new Date();
    metadata.dateModified = new Date();
    metadata.ownerorg = 'd258da3c-97c9-11e7-b422-b74de07713aa';
    metadata.fullname = 'copan02@github/e@no@ent/copan02/doggy.yipee';
    metadata.orgname = 'copan02';
    metadata.isPrivate = true;
    metadata.id = '5551212';
    metadata.hasLogo = false;
    metadata.flatFile = new K8sFile();
    return metadata;

  }

  /** Convert legacy yipee file canvas data to Yipee annotations. */

  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) { }

  k8sFork(applicationName: string, existing: YipeeFileMetadata, type: boolean): Observable<YipeeFileMetadata> {
    const metadata = this.forkApp(applicationName, existing).toRaw();
    return this.apiService.forkk8sApp(metadata).map((response) => {
      return this.convertServerResponse(response.data[0]);
    });
  }

  create(applicationName: string): YipeeFileMetadata {
    const yipeeFile = this.createNewApp(applicationName, true);
    return yipeeFile;
  }

  read(yipeeFile_id: string): Observable<YipeeFileMetadata> {
    return this.apiService.getApp(yipeeFile_id).map((response) => {
      return this.convertServerResponse(response.data[0]);
    });
  }

  update(metadata: YipeeFileMetadata): Observable<YipeeFileMetadata> {
    const clone = metadata.toRaw();
    clone.name = metadata.name;
    clone.yipeeFile = { services: {} }; // @HACK until dokken is fixed
    return this.apiService.updateApp(clone).map((response) => {
      return this.convertServerResponse(response.data[0]);
    });
  }

  delete(yipeeFile_id: string, modelType: string): Observable<YipeeFileMetadata> {
    return this.apiService.deleteApp(yipeeFile_id).map((response) => {
      return this.convertServerResponse(response.data[0]);
    });
  }

  createNewApp(applicationName: string, k8s: boolean): YipeeFileMetadata {
    const metadata = (k8s ? YipeeFileService.newK8sFileMetadataTemplate(applicationName) : YipeeFileService.newYipeeFileMetadataTemplate(applicationName));
    metadata.author = '';
    metadata.username = '';
    return metadata;
  }

  forkApp(applicationName: string, existing: YipeeFileMetadata): YipeeFileMetadata {
    const metadata = (existing.isFlat ? YipeeFileService.newK8sFileMetadataTemplate(applicationName) : YipeeFileService.newYipeeFileMetadataTemplate(applicationName));
    metadata.author = this.userService.userInfo.githubUsername;
    metadata.username = this.userService.userInfo.githubUsername;
    metadata.name = applicationName;
    metadata.isFlat = existing.isFlat;
    if (metadata.isFlat) {
      metadata.flatFile = new K8sFile();
      metadata.flatFile.fromFlat(existing.flatFile.toFlat());
      metadata.flatFile.appInfo.name = applicationName;
    } else {
      // delete
      // metadata.uiFile = new YipeeFile(existing.uiFile.toRaw());
      // metadata.uiFile.appinfo.name = applicationName;
    }
    return metadata;
  }

  getYipeeFileLogo(yipeeFileId: string): Observable<string> {
    return this.apiService.getYipeeFileLogo(yipeeFileId).map((data) => {
      return data.data[0].serializedData;
    });
  }

  putYipeeFileLogo(yipeeFileId: string, base64ImageString: string) {
    return this.apiService.putYipeeFileLogo(yipeeFileId, base64ImageString).map((response) => {
      return response;
    });
  }

  convertServerResponse(response: YipeeFileMetadataRaw): YipeeFileMetadata {
    const metadata = new YipeeFileMetadata(response);
    return metadata;
  }

}
