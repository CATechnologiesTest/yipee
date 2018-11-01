import { TestBed } from '@angular/core/testing';
import { K8sFile } from './K8sFile';
import { Container } from '../common/Container';
import { VolumeRef } from '../common/VolumeRef';
import { SecretRef } from '../common/SecretRef';
import { PortMapping } from '../common/PortMapping';

describe('K8sFile', () => {

  const flat1 = {
    'network-ref': [
      {
        'type': 'network-ref',
        'id': '059be030-1bb4-4b72-809c-7467796a0389',
        'aliases': [],
        'container': 'dea453aa-8e05-4dfe-94ca-ce5714a8b487',
        'name': 'default'
      },
      {
        'type': 'network-ref',
        'id': '5712d00a-eed6-4feb-9098-61c48eac895f',
        'aliases': [],
        'container': '7bad90a1-35c5-42ab-ae57-94b38b0b238b',
        'name': 'default'
      },
      {
        'type': 'network-ref',
        'id': 'cecc4d75-15eb-4ff7-b206-47857b956178',
        'aliases': [],
        'container': '45ddad7b-fd2f-4ab8-abd2-4e2e63238345',
        'name': 'default'
      }
    ],
    'restart': [
      {
        'type': 'restart',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'value': 'always',
        'id': '1667d85e-9a10-439c-a8e9-bdcf7dcfeb79'
      },
      {
        'type': 'restart',
        'cgroup': 'ba327984-bbba-4052-8552-42c7a72e79ea',
        'value': 'always',
        'id': '91ffa393-8b2d-46e4-8c3b-1e664d5f92a7'
      }
    ],
    'container-group': [
      {
        'type': 'container-group',
        'id': 'ba327984-bbba-4052-8552-42c7a72e79ea',
        'pod': '82fa472e-0872-40c9-821b-83cefdff476d',
        'name': 'mysql',
        'source': 'k8s',
        'controller-type': 'StatefulSet',
        'containers': [
          '45ddad7b-fd2f-4ab8-abd2-4e2e63238345'
        ],
        'container-names': [
          'mysql'
        ]
      },
      {
        'type': 'container-group',
        'id': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'pod': '8af75646-03ab-486c-af3c-2e3a9c201fab',
        'name': 'web',
        'source': 'k8s',
        'controller-type': 'StatefulSet',
        'containers': [
          '7bad90a1-35c5-42ab-ae57-94b38b0b238b',
          'dea453aa-8e05-4dfe-94ca-ce5714a8b487'
        ],
        'container-names': [
          'python',
          'redis'
        ]
      }
    ],
    'deployment-spec': [
      {
        'type': 'deployment-spec',
        'id': 'b7386f65-a80d-4182-ab33-f1943b70f5da',
        'mode': 'replicated',
        'count': 2,
        'service-name': 'service name',
        'image-pull-secrets': [],
        'controller-type': 'StatefulSet',
        'termination-grace-period': 60,
        'update-strategy': { type: 'OnDelete', onDelete: { foo: 1, bar: 2 } },
        'pod-management-policy': 'Parallel',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'service-account-name': 'san',
        'automount-service-account-token': true,
        'revisionHistoryLimit': null
      },
      {
        'type': 'deployment-spec',
        'id': 'dec95025-5600-4276-b739-689b893417f5',
        'mode': 'replicated',
        'count': 1,
        'service-name': 'service name',
        'image-pull-secrets': [],
        'controller-type': 'StatefulSet',
        'termination-grace-period': 60,
        'update-strategy': { type: 'OnDelete', onDelete: { foo: 1, bar: 2 } },
        'pod-management-policy': 'Parallel',
        'cgroup': 'ba327984-bbba-4052-8552-42c7a72e79ea',
        'service-account-name': 'san',
        'automount-service-account-token': true,
        'revisionHistoryLimit': null
      }
    ],
    'port-mapping': [
      {
        'protocol': 'tcp',
        'type': 'port-mapping',
        'container': '45ddad7b-fd2f-4ab8-abd2-4e2e63238345',
        'internal': '3306',
        'node-port': '3306',
        'name': 'null',
        'svc-port-name': 'null',
        'defining-service': 'bc196647-d19d-4787-b382-8f917992f49f',
        'external': '3306',
        'container-references': true,
        'id': 'ee818cf0-ec2c-47ad-ab41-387ffdaf81f1'
      },
      {
        'protocol': 'tcp',
        'name': 'null',
        'external': '80',
        'node-port': '',
        'svc-port-name': '',
        'type': 'port-mapping',
        'defining-service': 'c8813a08-9d8d-4286-adb7-03c5e6c1a58c',
        'internal': '5000',
        'container-references': true,
        'id': '97432590-4851-4b46-8434-491c0eec4f63',
        'container': '7bad90a1-35c5-42ab-ae57-94b38b0b238b'
      },
      {
        'type': 'port-mapping',
        'container': 'dea453aa-8e05-4dfe-94ca-ce5714a8b487',
        'internal': '6379',
        'node-port': '6379',
        'svc-port-name': '6379',
        'external': '0',
        'name': 'null',
        'container-references': true,
        'defining-service': '',
        'protocol': 'tcp',
        'id': '02f15ac0-f6ff-4fbd-a252-284902abfc63'
      }
    ],
    'app-info': [
      {
        'type': 'app-info',
        'id': '60ae8142-6577-4218-a80a-9b995e275d45',
        'logo': '[insert name of app logo image here]',
        'name': 'k8s-import',
        'readme': '',
        'description': '[insert app description here]'
      }
    ],
    'replication': [
      {
        'type': 'replication',
        'cgroup': 'ba327984-bbba-4052-8552-42c7a72e79ea',
        'count': 1,
        'id': '971746fc-f430-4b1c-97d5-fc35f0aab109'
      },
      {
        'type': 'replication',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'count': 1,
        'id': 'dcceb3e1-7b6b-47cd-bde4-90cb5080eb7e'
      },
      {
        'type': 'replication',
        'cgroup': 'ba327984-bbba-4052-8552-42c7a72e79ea',
        'count': 1,
        'id': '5fbf5c26-d227-421c-8b25-d257dba7a8e8'
      },
      {
        'type': 'replication',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'count': 1,
        'id': 'eaf60ab8-2ae7-4ab1-a623-8b4b9b52406e'
      },
      {
        'type': 'replication',
        'cgroup': 'ba327984-bbba-4052-8552-42c7a72e79ea',
        'count': 1,
        'id': '270fe788-0572-4f7b-9452-129695bfdec6'
      },
      {
        'type': 'replication',
        'cgroup': 'ba327984-bbba-4052-8552-42c7a72e79ea',
        'count': 1,
        'id': '906360bd-e031-4c9b-8f3e-03cc02254c72'
      },
      {
        'type': 'replication',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'count': 1,
        'id': '10606259-8dc3-495b-812c-ab24cb1b0ac4'
      },
      {
        'type': 'replication',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'count': 1,
        'id': '0d1a0017-6fa9-4054-939f-63949ae95c63'
      },
      {
        'type': 'replication',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'count': 1,
        'id': '2e0af5f6-48d2-41fd-a848-9d614e776dc5'
      },
      {
        'type': 'replication',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'count': 1,
        'id': '9f6e63f3-c43d-40df-b82b-77effcfc285e'
      },
      {
        'type': 'replication',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'count': 1,
        'id': '4a106002-2be2-4e4d-bda0-ea5521a01051'
      },
      {
        'type': 'replication',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'count': 1,
        'id': 'fbf785e0-076e-453a-a2cc-66fc4e5bbccc'
      },
      {
        'type': 'replication',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'count': 2,
        'id': 'd0fd1341-6572-4786-bbd1-8d116dff6102'
      },
      {
        'type': 'replication',
        'cgroup': 'ba327984-bbba-4052-8552-42c7a72e79ea',
        'count': 1,
        'id': '21f52012-3dd4-4908-8038-9af9338e746f'
      }
    ],
    'label': [
      {
        'type': 'label',
        'cgroup': 'ba327984-bbba-4052-8552-42c7a72e79ea',
        'key': 'component',
        'value': 'mysql',
        'ismap': false,
        'id': 'c23659eb-030d-44d8-8eb1-74827298293a'
      },
      {
        'type': 'label',
        'cgroup': 'ba327984-bbba-4052-8552-42c7a72e79ea',
        'key': 'app',
        'value': 'demo',
        'ismap': false,
        'id': '9854c4de-41c2-4d00-859b-f96b8d7d00c7'
      },
      {
        'type': 'label',
        'cgroup': 'ba327984-bbba-4052-8552-42c7a72e79ea',
        'key': 'name',
        'value': 'mysql',
        'ismap': false,
        'id': '86f5c442-7f39-466a-93fa-ced8a8c9d1e1'
      },
      {
        'type': 'label',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'key': 'component',
        'value': 'web',
        'ismap': false,
        'id': '1f5f42da-bc2f-487a-a954-992165c89bd8'
      },
      {
        'type': 'label',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'key': 'app',
        'value': 'demo',
        'ismap': false,
        'id': '0d921921-2510-48b4-ac85-490a1e46ce4d'
      },
      {
        'type': 'label',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'key': 'name',
        'value': 'web',
        'ismap': false,
        'id': '735c05bf-6ccc-44c3-8c65-66929c4edb12'
      }
    ],
    'top-label': [
      {
        'type': 'top-label',
        'id': 'e4bb7327-755c-48f9-8686-3a7173bba94a',
        'key': 'name',
        'value': 'mysql',
        'cgroup': 'ba327984-bbba-4052-8552-42c7a72e79ea'
      },
      {
        'type': 'top-label',
        'id': 'a5a675fc-bc49-4a4e-ac21-27aa5f3e66e4',
        'key': 'name',
        'value': 'web',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d'
      },
      {
        'type': 'top-label',
        'id': 'f0932204-55f6-4f78-a903-9c29cb80c2e0',
        'key': 'app',
        'value': 'demo',
        'cgroup': 'ba327984-bbba-4052-8552-42c7a72e79ea'
      },
      {
        'type': 'top-label',
        'id': '574f6d41-d6c6-4e3f-bfcf-35e7044a43df',
        'key': 'app',
        'value': 'demo',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d'
      }
    ],
    'k8s-service': [
      {
        'type': 'k8s-service',
        'id': 'bc196647-d19d-4787-b382-8f917992f49f',
        'name': 'mysql',
        'metadata': {
          'name': 'mysql',
          'labels': {
            'app': 'demo',
            'name': 'mysql'
          }
        },
        'selector': {
          'app': 'demo',
          'name': 'mysql'
        },
        'cluster-ip': undefined,
        'service-type': 'ClusterIP'
      },
      {
        'type': 'k8s-service',
        'id': 'c8813a08-9d8d-4286-adb7-03c5e6c1a58c',
        'name': 'web',
        'metadata': {
          'name': 'web',
          'labels': {
            'app': 'demo',
            'name': 'web'
          }
        },
        'selector': {
          'name': 'web'
        },
        'cluster-ip': undefined,
        'service-type': 'NodePort'
      }
    ],
    'container': [
      {
        'type': 'container',
        'name': 'mysql',
        'position': -1,
        'id': '45ddad7b-fd2f-4ab8-abd2-4e2e63238345',
        'cgroup': 'ba327984-bbba-4052-8552-42c7a72e79ea'
      },
      {
        'type': 'container',
        'name': 'python',
        'position': -1,
        'id': '7bad90a1-35c5-42ab-ae57-94b38b0b238b',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d'
      },
      {
        'type': 'container',
        'name': 'redis',
        'position': -1,
        'id': 'dea453aa-8e05-4dfe-94ca-ce5714a8b487',
        'cgroup': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d'
      }
    ],
    'image': [
      {
        'type': 'image',
        'container': '45ddad7b-fd2f-4ab8-abd2-4e2e63238345',
        'value': 'mysql:latest',
        'id': '174a3afb-8735-4368-b666-cf2afc932286'
      },
      {
        'type': 'image',
        'container': '7bad90a1-35c5-42ab-ae57-94b38b0b238b',
        'value': 'janakiramm/py-red',
        'id': '82c7ef99-467e-4e80-bb00-697d3768469e'
      },
      {
        'type': 'image',
        'container': 'dea453aa-8e05-4dfe-94ca-ce5714a8b487',
        'value': 'redis',
        'id': '4b747848-0044-4583-befc-ea5cdebf81e2'
      }
    ],
    'environment-var': [
      {
        'type': 'environment-var',
        'container': '45ddad7b-fd2f-4ab8-abd2-4e2e63238345',
        'key': 'MYSQL_ROOT_PASSWORD',
        'value': 'password',
        'id': '4c584015-2349-459b-b7df-f315969f497c'
      },
      {
        'type': 'environment-var',
        'container': '7bad90a1-35c5-42ab-ae57-94b38b0b238b',
        'key': 'REDIS_HOST',
        'value': 'localhost',
        'id': '445e568b-ce5e-49f8-92e3-b86a8789709e'
      }
    ],
    'annotation': [
      {
        'type': 'annotation',
        'annotated': '45ddad7b-fd2f-4ab8-abd2-4e2e63238345',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 25,
              'y': 25
            }
          }
        },
        'id': '21a30644-01e2-43ea-948d-b85bd9ebe5ab'
      },
      {
        'type': 'annotation',
        'annotated': 'ba327984-bbba-4052-8552-42c7a72e79ea',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 0,
              'y': 0
            }
          }
        },
        'id': 'a69c8d88-0047-45b3-90dc-54091fc9617f'
      },
      {
        'type': 'annotation',
        'annotated': 'da2a3e8f-a5e6-4522-a7cb-ab67c749799d',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 0,
              'y': 0
            }
          }
        },
        'id': '83f339de-297c-4e29-8bad-506c45a5ac71'
      },
      {
        'type': 'annotation',
        'annotated': '7bad90a1-35c5-42ab-ae57-94b38b0b238b',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 25,
              'y': 25
            }
          }
        },
        'id': '5dca12ca-7f33-4292-b38c-3b6d3c08eaf2'
      },
      {
        'type': 'annotation',
        'annotated': 'dea453aa-8e05-4dfe-94ca-ce5714a8b487',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 150,
              'y': 25
            }
          }
        },
        'id': '097c10a3-9587-45b0-a19f-3b79d636828e'
      }
    ],
    'config': [{
      'type': 'config',
      'name': 'config1',
      'map-name': 'map-name',
      'default-mode': '000',
      'id': 'config-111'
    }],
    'foo': [{
      'type': 'foo',
      'id': 'd34b9bc1-d772-411b-8936-deccb6e1b997'
    },
    {
      'type': 'foo',
      'id': 'd34b9bc1-d772-411b-8936-ddddddddddd'
    }],
    'bar': [{
      'type': 'bar',
      'id': 'd34b9bc1-d772-411b-8936-deccb6e1b997'
    },
    {
      'type': 'bar',
      'id': 'd34b9bc1-d772-411b-8936-ddddddddddd'
    }]
  };

  const flat2 = {
    'network-ref': [
      {
        'type': 'network-ref',
        'id': '98433549-7cc0-41a5-9ae8-83505a0f4b1f',
        'aliases': [],
        'container': '7fa0373f-5664-4228-b5aa-52cefc242905',
        'name': 'default'
      },
      {
        'type': 'network-ref',
        'id': 'c272f3c9-7e4d-4f57-a16c-97ca92346157',
        'aliases': [],
        'container': '236cd645-4cba-461f-876d-1aeed5063471',
        'name': 'default'
      },
      {
        'type': 'network-ref',
        'id': '2fab977b-8bcb-4aa2-8057-862cbce875b3',
        'aliases': [],
        'container': 'b419df5f-7f66-4a9f-a456-22aaef6ab415',
        'name': 'default'
      }
    ],
    'restart': [
      {
        'type': 'restart',
        'cgroup': 'a7e76369-6039-4c90-a646-ccd3bea7fc09',
        'value': 'always',
        'id': '77a12cbc-5ed7-4b70-b9da-c478e86b6556'
      },
      {
        'type': 'restart',
        'cgroup': 'f022e0d5-2070-4668-ae84-e6efebecde03',
        'value': 'always',
        'id': '8a26754b-9d56-40b6-bc54-ff6ce5705817'
      }
    ],
    'config': [
      {
        'type': 'config',
        'id': 'bf7c03e0-a201-45ff-9da5-bb64df8436d5',
        'name': 'config',
        'default-mode': '000',
        'map-name': 'mongo-init'
      }
    ],
    'container-group': [
      {
        'name': 'parse-server',
        'type': 'container-group',
        'containers': [
          '236cd645-4cba-461f-876d-1aeed5063471'
        ],
        'source': 'k8s',
        'container-names': [
          'parse-server'
        ],
        'pod': '2113cf84-0ad2-4daf-8029-a5b1f699297b',
        'id': 'a7e76369-6039-4c90-a646-ccd3bea7fc09',
        'controller-type': 'Deployment'
      },
      {
        'name': 'mongo',
        'type': 'container-group',
        'containers': [
          'b419df5f-7f66-4a9f-a456-22aaef6ab415',
          '7fa0373f-5664-4228-b5aa-52cefc242905'
        ],
        'source': 'k8s',
        'container-names': [
          'mongodb',
          'init-mongo'
        ],
        'pod': '14caacab-a04d-467c-a54a-0f75a1cba8a8',
        'id': 'f022e0d5-2070-4668-ae84-e6efebecde03',
        'controller-type': 'StatefulSet'
      }
    ],
    'deployment-spec': [
      {
        'termination-grace-period': 10,
        'service-name': 'mongo',
        'mode': 'replicated',
        'type': 'deployment-spec',
        'image-pull-secrets': [],
        'cgroup': 'f022e0d5-2070-4668-ae84-e6efebecde03',
        'id': '72093e3a-41d5-4442-82fb-aa4cab9f9762',
        'controller-type': 'StatefulSet',
        'count': 3,
        'pod-management-policy': 'OrderedReady',
        'update-strategy': { type: 'OnDelete', onDelete: { foo: 1, bar: 2 } },
        'service-account-name': 'san',
        'automount-service-account-token': true,
        'revisionHistoryLimit': null
      },
      {
        'termination-grace-period': 10,
        'service-name': '',
        'mode': 'replicated',
        'type': 'deployment-spec',
        'image-pull-secrets': [],
        'cgroup': 'a7e76369-6039-4c90-a646-ccd3bea7fc09',
        'id': '5686ebac-95ab-49e7-87b1-cfabe272fc90',
        'controller-type': 'Deployment',
        'count': 1,
        'pod-management-policy': 'OrderedReady',
        'update-strategy': { type: 'OnDelete', onDelete: { foo: 1, bar: 2 } },
        'service-account-name': 'san',
        'automount-service-account-token': true,
        'revisionHistoryLimit': null
      }
    ],
    'config-ref': [
      {
        'type': 'config-ref',
        'id': 'a09892ca-2444-477e-9a81-02515ed2764a',
        'name': 'config',
        'path': '/config',
        'mode': '000',
        'readonly': false,
        'config': 'bf7c03e0-a201-45ff-9da5-bb64df8436d5',
        'container': '7fa0373f-5664-4228-b5aa-52cefc242905',
        'container-name': 'init-mongo'
      }
    ],
    'port-mapping': [
      {
        'protocol': 'tcp',
        'name': 'parse-server',
        'external': '1337',
        'node-port': '1337',
        'svc-port-name': '1337',
        'type': 'port-mapping',
        'defining-service': '53d6baf1-41af-4f25-b412-f772c1aeeaaa',
        'internal': '1337',
        'container-references': true,
        'id': '5beff9e6-de0d-4373-b266-2cea1c6903a7',
        'container': '236cd645-4cba-461f-876d-1aeed5063471'
      },
      {
        'protocol': 'tcp',
        'name': 'web',
        'external': '27017',
        'node-port': '27017',
        'svc-port-name': '27017',
        'type': 'port-mapping',
        'defining-service': '58c1030d-1f3e-465b-afdb-c46cf8dd03da',
        'internal': '27017',
        'container-references': true,
        'id': '1b107b8a-c138-422d-aacd-fe9d0be9b43f',
        'container': 'b419df5f-7f66-4a9f-a456-22aaef6ab415'
      }
    ],
    'app-info': [
      {
        'type': 'app-info',
        'id': 'cb0df3d5-9063-4c60-afb0-0026273f73ac',
        'logo': '[insert name of app logo image here]',
        'name': 'parse',
        'readme': 'foo bar',
        'description': '[insert app description here]'
      }
    ],
    'volume': [
      {
        'selector': {
          'matchLabels': {}
        },
        'physical-volume-name': 'volume-0',
        'claim-name': 'claim-name',
        'storage-class': 'fast',
        'name': 'volume2',
        'type': 'volume',
        'volume-mode': 'Filesystem',
        'access-modes': [
          'ReadOnlyMany',
          'ReadWriteOnce',
          'ReadWriteMany'
        ],
        'is-template': false,
        'id': '636ea9c4-309c-48e0-937d-155fe51ebc1d',
        'storage': '25000'
      },
      {
        'selector': {
          'matchLabels': {}
        },
        'physical-volume-name': 'volume-0',
        'claim-name': 'claim-name',
        'storage-class': 'slow',
        'name': 'volume',
        'type': 'volume',
        'volume-mode': 'Filesystem',
        'access-modes': [
          'ReadOnlyMany',
          'ReadWriteOnce',
          'ReadWriteMany'
        ],
        'is-template': false,
        'id': '6fdf2a3a-816e-4419-b2bc-d3434c82f82a',
        'storage': '1000'
      },
      {
        'selector': {
          'matchLabels': {}
        },
        'physical-volume-name': 'volume-0',
        'claim-name': 'claim-name',
        'storage-class': '',
        'name': 'v3',
        'type': 'volume',
        'volume-mode': 'Filesystem',
        'access-modes': [
          'ReadOnlyMany',
          'ReadWriteOnce',
          'ReadWriteMany'
        ],
        'is-template': false,
        'id': '1b4b57f2-0733-4d06-a583-d4136df8e7cf',
        'storage': '0'
      }
    ],
    'replication': [
      {
        'type': 'replication',
        'cgroup': 'a7e76369-6039-4c90-a646-ccd3bea7fc09',
        'count': 1,
        'id': '91c0d577-1354-40b9-a74c-469275dba004'
      },
      {
        'type': 'replication',
        'cgroup': 'f022e0d5-2070-4668-ae84-e6efebecde03',
        'count': 1,
        'id': '14895eaf-3bf2-4c1e-a2db-ac6b8a62f841'
      },
      {
        'type': 'replication',
        'cgroup': 'a7e76369-6039-4c90-a646-ccd3bea7fc09',
        'count': 1,
        'id': '384e39f9-2e0b-4acc-a18e-1dc2f9db5190'
      },
      {
        'type': 'replication',
        'cgroup': 'f022e0d5-2070-4668-ae84-e6efebecde03',
        'count': 1,
        'id': 'dcf84fb0-e1e5-421c-98ac-623530972a1e'
      },
      {
        'type': 'replication',
        'cgroup': 'a7e76369-6039-4c90-a646-ccd3bea7fc09',
        'count': 1,
        'id': 'eee5b952-6068-4a5a-9eac-3f9a99c34278'
      },
      {
        'type': 'replication',
        'cgroup': 'f022e0d5-2070-4668-ae84-e6efebecde03',
        'count': 1,
        'id': '8469f889-3869-4db1-ba88-a3d91423a505'
      },
      {
        'type': 'replication',
        'cgroup': 'a7e76369-6039-4c90-a646-ccd3bea7fc09',
        'count': 1,
        'id': '5d12c654-dbdd-4822-a757-2c7a2be11b8e'
      },
      {
        'type': 'replication',
        'cgroup': 'f022e0d5-2070-4668-ae84-e6efebecde03',
        'count': 1,
        'id': '26cde88a-4283-4011-acc4-b5115933ccc5'
      },
      {
        'type': 'replication',
        'cgroup': 'f022e0d5-2070-4668-ae84-e6efebecde03',
        'count': 1,
        'id': '66ef6d0f-fa49-47a9-bb8c-00030bac1e1c'
      },
      {
        'type': 'replication',
        'cgroup': 'f022e0d5-2070-4668-ae84-e6efebecde03',
        'count': 1,
        'id': '8260630f-2c5b-4e35-bb42-d5edea4671bc'
      },
      {
        'type': 'replication',
        'cgroup': 'f022e0d5-2070-4668-ae84-e6efebecde03',
        'count': 1,
        'id': '58f63fa5-2042-42ea-a296-495af9b29b1f'
      },
      {
        'type': 'replication',
        'cgroup': 'f022e0d5-2070-4668-ae84-e6efebecde03',
        'count': 1,
        'id': 'db65a082-4519-4c60-8358-5e2a0df0e9e1'
      },
      {
        'type': 'replication',
        'cgroup': 'f022e0d5-2070-4668-ae84-e6efebecde03',
        'count': 3,
        'id': '0e9c3726-489e-4878-8d01-40a65e495a55'
      },
      {
        'type': 'replication',
        'cgroup': 'a7e76369-6039-4c90-a646-ccd3bea7fc09',
        'count': 1,
        'id': 'c4eb2249-3a1c-4804-8f04-04462fa6b03a'
      }
    ],
    'label': [
      {
        'type': 'label',
        'cgroup': 'a7e76369-6039-4c90-a646-ccd3bea7fc09',
        'key': 'run',
        'value': 'parse-server',
        'ismap': false,
        'id': '42155665-3b2a-4efe-8450-7cd4b3d83d09'
      },
      {
        'type': 'label',
        'cgroup': 'f022e0d5-2070-4668-ae84-e6efebecde03',
        'key': 'app',
        'value': 'mongo',
        'ismap': false,
        'id': 'e059571a-99ab-41c5-9ed3-847a5f0d34ea'
      }
    ],
    'k8s-service': [
      {
        'type': 'k8s-service',
        'id': '58c1030d-1f3e-465b-afdb-c46cf8dd03da',
        'name': 'mongo',
        'metadata': {
          'name': 'mongo'
        },
        'selector': {
          'app': 'mongo'
        },
        'cluster-ip': undefined,
        'service-type': 'ClusterIP'
      },
      {
        'type': 'k8s-service',
        'id': '53d6baf1-41af-4f25-b412-f772c1aeeaaa',
        'name': 'parse-server',
        'metadata': {
          'name': 'parse-server',
          'namespace': 'default'
        },
        'selector': {
          'run': 'parse-server'
        },
        'cluster-ip': undefined,
        'service-type': 'ClusterIP'
      }
    ],
    'container': [
      {
        'type': 'container',
        'name': 'parse-server',
        'position': -1,
        'id': '236cd645-4cba-461f-876d-1aeed5063471',
        'cgroup': 'a7e76369-6039-4c90-a646-ccd3bea7fc09'
      },
      {
        'type': 'container',
        'name': 'mongodb',
        'position': -1,
        'id': 'b419df5f-7f66-4a9f-a456-22aaef6ab415',
        'cgroup': 'f022e0d5-2070-4668-ae84-e6efebecde03'
      },
      {
        'type': 'container',
        'name': 'init-mongo',
        'position': -1,
        'id': '7fa0373f-5664-4228-b5aa-52cefc242905',
        'cgroup': 'f022e0d5-2070-4668-ae84-e6efebecde03'
      }
    ],
    'entrypoint': [
      {
        'type': 'entrypoint',
        'container': 'b419df5f-7f66-4a9f-a456-22aaef6ab415',
        'value': [
          'mongod',
          '--replSet',
          'rs0'
        ],
        'id': '879f39f1-8db9-426b-8966-44d2deccf1c5'
      },
      {
        'type': 'entrypoint',
        'container': '7fa0373f-5664-4228-b5aa-52cefc242905',
        'value': [
          'bash',
          '/config/init.sh'
        ],
        'id': 'd2d99aaf-954d-4fce-b14f-46f87791abab'
      }
    ],
    'image': [
      {
        'type': 'image',
        'container': '236cd645-4cba-461f-876d-1aeed5063471',
        'value': 'parseplatform/parse-server',
        'id': '09bc1f11-b117-49d1-97c5-f18fd521ad5a'
      },
      {
        'type': 'image',
        'container': 'b419df5f-7f66-4a9f-a456-22aaef6ab415',
        'value': 'mongo:3.4.1',
        'id': '5d773c36-93d1-4d38-b58c-3135950323fd'
      },
      {
        'type': 'image',
        'container': '7fa0373f-5664-4228-b5aa-52cefc242905',
        'value': 'mongo:3.4.1',
        'id': '08fac626-29a7-42bd-a839-67bd7a67ca22'
      }
    ],
    'environment-var': [
      {
        'type': 'environment-var',
        'container': '236cd645-4cba-461f-876d-1aeed5063471',
        'key': 'PARSE_SERVER_APPLICATION_ID',
        'value': 'my-app-id',
        'id': 'ea262e0c-c8f5-4086-93a0-20af07798d3d'
      },
      {
        'type': 'environment-var',
        'container': '236cd645-4cba-461f-876d-1aeed5063471',
        'key': 'PARSE_SERVER_DATABASE_URI',
        'value': 'mongodb://mongo-0.mongo:27017,mongo-1.mongo:27017,mongo-2.mongo:27017/dev?replicaSet=rs0',
        'id': 'a6aba4aa-aac6-4752-84f9-7759a13c1b8b'
      },
      {
        'type': 'environment-var',
        'container': '236cd645-4cba-461f-876d-1aeed5063471',
        'key': 'PARSE_SERVER_MASTER_KEY',
        'value': 'my-master-key',
        'id': '8373c79f-77b4-406a-8d1a-814026048b1c'
      }
    ],
    'volume-ref': [
      {
        'path': '/data',
        'sub-path': '/subdata',
        'access-mode': 'ReadWriteOnce',
        'type': 'volume-ref',
        'volume': '1b4b57f2-0733-4d06-a583-d4136df8e7cf',
        'id': '9deb3bab-4067-439c-a2e8-d4939c8ccf9a',
        'container': '236cd645-4cba-461f-876d-1aeed5063471',
        'volume-name': 'v3'
      },
      {
        'path': '/foo',
        'sub-path': '/bar',
        'access-mode': 'ReadWriteOnce',
        'type': 'volume-ref',
        'volume': '6fdf2a3a-816e-4419-b2bc-d3434c82f82a',
        'id': '3cc480c4-3930-466c-94e6-c4fcabfa79ac',
        'container': '236cd645-4cba-461f-876d-1aeed5063471',
        'volume-name': 'volume'
      },
      {
        'path': '/data',
        'sub-path': '/subdata',
        'access-mode': 'ReadWriteOnce',
        'type': 'volume-ref',
        'volume': '636ea9c4-309c-48e0-937d-155fe51ebc1d',
        'id': 'e029279d-02b0-4bbc-98a8-c51cf38158ac',
        'container': 'b419df5f-7f66-4a9f-a456-22aaef6ab415',
        'volume-name': 'volume2'
      }
    ],
    'annotation': [
      {
        'type': 'annotation',
        'annotated': '236cd645-4cba-461f-876d-1aeed5063471',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 250,
              'y': 125
            }
          }
        },
        'id': 'c3dcb8f6-da2d-447f-a406-6947e727e041'
      },
      {
        'type': 'annotation',
        'annotated': '236cd645-4cba-461f-876d-1aeed5063471',
        'key': 'override',
        'value': 'none',
        'id': 'ed0ce65b-6476-4365-866b-d6ad1e2a0e36'
      },
      {
        'type': 'annotation',
        'annotated': '236cd645-4cba-461f-876d-1aeed5063471',
        'key': 'description',
        'value': '',
        'id': '13c768f1-68f5-4780-978c-e72966032f5d'
      },
      {
        'type': 'annotation',
        'annotated': 'b419df5f-7f66-4a9f-a456-22aaef6ab415',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 250,
              'y': 450
            }
          }
        },
        'id': 'cf779a5c-23b5-4772-b8eb-c5ca3cc11628'
      },
      {
        'type': 'annotation',
        'annotated': 'b419df5f-7f66-4a9f-a456-22aaef6ab415',
        'key': 'override',
        'value': 'none',
        'id': 'fb093d18-fc0c-4f1d-88f7-bffec1bb3d62'
      },
      {
        'type': 'annotation',
        'annotated': 'b419df5f-7f66-4a9f-a456-22aaef6ab415',
        'key': 'description',
        'value': '',
        'id': 'f3cfc29a-9850-48cf-94f1-9b1d2c6a47b1'
      },
      {
        'type': 'annotation',
        'annotated': '7fa0373f-5664-4228-b5aa-52cefc242905',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 375,
              'y': 450
            }
          }
        },
        'id': '0b7e1f0f-c613-4dcb-9bcc-f507ef792bf7'
      },
      {
        'type': 'annotation',
        'annotated': '636ea9c4-309c-48e0-937d-155fe51ebc1d',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 250,
              'y': 650
            }
          }
        },
        'id': 'af187e26-dba9-4c05-9ec1-7e5bd5759a41'
      },
      {
        'type': 'annotation',
        'annotated': '636ea9c4-309c-48e0-937d-155fe51ebc1d',
        'key': 'description',
        'value': '',
        'id': '1df7fb85-57ed-4012-ad13-44f13810273e'
      },
      {
        'type': 'annotation',
        'annotated': '6fdf2a3a-816e-4419-b2bc-d3434c82f82a',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 400,
              'y': 125
            }
          }
        },
        'id': 'cb22c03d-1140-4b33-a62c-3823a0458fa4'
      },
      {
        'type': 'annotation',
        'annotated': '6fdf2a3a-816e-4419-b2bc-d3434c82f82a',
        'key': 'description',
        'value': '',
        'id': '4e718222-d2e9-4e6e-b2a6-6d657779e2f5'
      },
      {
        'type': 'annotation',
        'annotated': '1b4b57f2-0733-4d06-a583-d4136df8e7cf',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 250,
              'y': 275
            }
          }
        },
        'id': '04586d92-6676-478f-8a9a-184ad96eb887'
      },
      {
        'type': 'annotation',
        'annotated': '1b4b57f2-0733-4d06-a583-d4136df8e7cf',
        'key': 'description',
        'value': '',
        'id': 'fe5b61c7-e11d-4fda-895b-ad0ffb12ea17'
      },
      {
        'type': 'annotation',
        'annotated': '58c1030d-1f3e-465b-afdb-c46cf8dd03da',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 100,
              'y': 450
            }
          }
        },
        'id': 'b01c8c3a-31fd-4d2a-a793-682095331f4e'
      },
      {
        'type': 'annotation',
        'annotated': '53d6baf1-41af-4f25-b412-f772c1aeeaaa',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 100,
              'y': 125
            }
          }
        },
        'id': 'f7505910-f5a0-42da-9b35-5889c4f818fc'
      },
      {
        'type': 'annotation',
        'annotated': 'a7e76369-6039-4c90-a646-ccd3bea7fc09',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 225,
              'y': 100
            }
          }
        },
        'id': '7aed0f88-2c41-49f4-89c0-064389becad2'
      },
      {
        'type': 'annotation',
        'annotated': 'a7e76369-6039-4c90-a646-ccd3bea7fc09',
        'key': 'description',
        'value': '',
        'id': '189d630f-0aaf-4f6a-99b1-ecee8469cfdc'
      },
      {
        'type': 'annotation',
        'annotated': 'f022e0d5-2070-4668-ae84-e6efebecde03',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 225,
              'y': 425
            }
          }
        },
        'id': 'd8ebc022-4285-4ad4-866c-d6ba16f0fa03'
      },
      {
        'type': 'annotation',
        'annotated': 'f022e0d5-2070-4668-ae84-e6efebecde03',
        'key': 'description',
        'value': '',
        'id': 'ff88aef2-dfe4-47af-9d37-07d8c906fa63'
      }
    ]
  };

  it('should handle flat1 round trip', () => {
    const file = new K8sFile();
    file.fromFlat(flat1);
    expect(file.toFlat()).toEqual(flat1);
  });

  it('should handle flat2 round trip', () => {
    const file = new K8sFile();
    file.fromFlat(flat2);
    expect(file.toFlat()).toEqual(flat2);
  });

  it('should parse objects', () => {
    const file = new K8sFile();
    file.fromFlat(flat2);
    expect(file.configs.length).toEqual(1);
    expect(file.configs[0].config_ref.length).toEqual(1);
    expect(file.containers.length).toEqual(3);
    expect(file.volumes.length).toEqual(3);
    for (const volume of file.volumes) {
      expect(volume.volume_ref).toBeDefined();
      expect(volume.description).toBeDefined();
      expect(volume.ui).toBeDefined();
    }
    expect(file.containerGroups.length).toEqual(2);
    expect(file.secrets.length).toEqual(0);
    for (const service of file.services) {
      expect(service.container_port_mapping).toBeDefined();
      for (const port of service.container_port_mapping) {
        expect(port.container_name).toBeDefined();
      }
      expect(service.ui).toBeDefined();
    }
  });

  it('should match service to container groups', () => {
    const file = new K8sFile();
    file.fromFlat(flat1);
    expect(file.services.length).toBe(2);
    for (const service of file.services) {
      expect(service.container_groups.length).toBe(1);
      expect(service.container_groups[0].name).toEqual(service.name);
      expect(service.containerGroupInService(service.container_groups[0])).toBeTruthy();
    }
  });

  it('should get config and secret maps', () => {
    const file = new K8sFile();
    file.fromFlat(flat1);
    for (const container of file.containers) {
      expect(container.config_map).toBeDefined();
      expect(container.config_map.length).toBe(1);
    }
  });

  it('should remove container and all references', () => {
    const file = new K8sFile();
    file.fromFlat(flat2);
    for (const container of file.containers) {
      container.remove();
    }
    expect(file.containers.length).toEqual(0);
    expect(file.filterByType(VolumeRef.OBJECT_NAME).length).toEqual(0);
    expect(file.filterByType(SecretRef.OBJECT_NAME).length).toEqual(0);
  });

  it('should clear port mapping defining service when cgroup changes', () => {
    const file = new K8sFile();
    file.fromFlat(flat2);
    for (const container of file.containers) {
      container.cgroup = undefined;
      for (const port_mapping of container.port_mapping) {
        expect(port_mapping.defining_service).toEqual('');
      }
    }
  });

});
