import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';

import { ContainerContainerComponent } from './container-container.component';
import { EditorEventService } from '../../../editor-event.service';
import { EditorService } from '../../../editor.service';
import { PortMapping } from '../../../../models/common/PortMapping';
import { EnvironmentVar } from '../../../../models/common/EnvironmentVar';
import { VolumeRef } from '../../../../models/common/VolumeRef';
import { SecretRef } from '../../../../models/common/SecretRef';
import { ConfigRef } from '../../../../models/common/ConfigRef';
import { K8sFile } from '../../../../models/k8s/K8sFile';
import { K8sSecretRef } from '../../../../models/k8s/K8sSecretRef';

describe(`k8s Sidebar, 'container' panel`, () => {
  let component: ContainerContainerComponent;
  let fixture: ComponentFixture<ContainerContainerComponent>;

  const flat = {
    'config': [
      {
        'type': 'config',
        'id': 'b5d7d86f-5351-4ae8-9923-85bd0854a4eb',
        'name': 'config-1',
        'map-name': 'map-name',
        'default-mode': '420'
      }
    ],
    'container-group': [
      {
        'type': 'container-group',
        'id': '483d606f-39fa-4579-a9a2-27456264b168',
        'name': 'statefulSet',
        'source': 'k8s',
        'containers': [
          '26780ecc-b053-41a1-b542-525ccbab1b6a'
        ],
        'container-names': [
          'container'
        ]
      }
    ],
    'command': [
      {
        'type': 'command',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'value': 'arg1 arg2',
        'id': '029242d5-60e3-4e1a-8e65-8f7866fcf47e'
      }
    ],
    'deployment-spec': [
      {
        'termination-grace-period': 30,
        'service-name': '',
        'mode': 'replicated',
        'type': 'deployment-spec',
        'cgroup': '483d606f-39fa-4579-a9a2-27456264b168',
        'id': '2ede34f5-7d84-47f8-bef1-664498d0cf46',
        'controller-type': 'StatefulSet',
        'count': 1,
        'pod-management-policy': 'OrderedReady',
        'update-strategy': 'RollingUpdate'
      }
    ],
    'config-ref': [
      {
        'type': 'config-ref',
        'id': '518530f4-e2c6-47b4-81f9-978bf2315552',
        'name': 'config-1',
        'path': '/config',
        'config': 'b5d7d86f-5351-4ae8-9923-85bd0854a4eb',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'container-name': 'container'
      }
    ],
    'port-mapping': [
      {
        'protocol': 'tcp',
        'name': 'web',
        'external': '',
        'type': 'port-mapping',
        'defining-service': null,
        'internal': '100',
        'container-references': true,
        'id': '53068eaf-d556-4dfd-ae6a-a6223b771895',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a'
      }
    ],
    'k8s-secret-volume': [
      {
        'type': 'k8s-secret-volume',
        'default-mode': '644',
        'name': 'secret-1',
        'id': 'acb31499-6d1c-4eb4-b943-91333808b349',
        'secret-name': 'secret-name',
        'source': 'k8s'
      }
    ],
    'app-info': [
      {
        'type': 'app-info',
        'id': 'd2caffab-05f3-4e35-94ea-24a4950989fb',
        'name': 'test'
      }
    ],
    'volume': [
      {
        'selector': {
          'matchLabels': {}
        },
        'storage-class': 'slow',
        'is-template': false,
        'name': 'pvc',
        'type': 'volume',
        'volume-mode': 'Filesystem',
        'access-modes': [
          'ReadOnlyMany',
          'ReadWriteOnce',
          'ReadWriteMany'
        ],
        'id': '1c4e8bb9-1cf5-4e39-9327-7d9bbaacff8c',
        'storage': '100Gi'
      }
    ],
    'replication': [
      {
        'type': 'replication',
        'cgroup': '483d606f-39fa-4579-a9a2-27456264b168',
        'count': 1,
        'id': '94d74460-14b6-4403-a600-c2953ed45b21'
      },
      {
        'type': 'replication',
        'cgroup': '483d606f-39fa-4579-a9a2-27456264b168',
        'count': 1,
        'id': '438e10b9-5273-4364-83a1-ff8b571124f5'
      },
      {
        'type': 'replication',
        'cgroup': '483d606f-39fa-4579-a9a2-27456264b168',
        'count': 1,
        'id': '97da4090-7fb7-4e7e-b4e6-427d0f2f09e0'
      },
      {
        'type': 'replication',
        'cgroup': '483d606f-39fa-4579-a9a2-27456264b168',
        'count': 1,
        'id': 'c93b3612-613c-4f2e-a876-b3e9b74d05be'
      },
      {
        'type': 'replication',
        'cgroup': '483d606f-39fa-4579-a9a2-27456264b168',
        'count': 1,
        'id': '95ba34d4-d4af-47ea-9621-d06785c78e7b'
      },
      {
        'type': 'replication',
        'cgroup': '483d606f-39fa-4579-a9a2-27456264b168',
        'count': 1,
        'id': '5de834f0-c5da-4a2f-bd9e-7ac0b8ba88e2'
      }
    ],
    'healthcheck': [
      {
        'retries': 60,
        'check-type': 'readiness',
        'type': 'healthcheck',
        'healthcmd': [
          'rediness'
        ],
        'id': 'bfd1fca8-3a12-479c-bc93-36ae7997c1d4',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'interval': 40,
        'timeout': 50,
        'httpGet': {
          'port': 8080,
          'scheme': 'http',
          'host': '123.123.123.123',
          'path': 'efefwef',
          'httpHeaders': {
            'key': 'x-httpheader',
            'value': 'header_value'
          }
        }
      },
      {
        'retries': 30,
        'check-type': 'liveness',
        'type': 'healthcheck',
        'healthcmd': [
          'liveness'
        ],
        'id': '92bc1569-e8a2-4886-948a-a1722fd83d03',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'interval': 10,
        'timeout': 20,
        'httpGet': {
          'port': 8080,
          'scheme': 'http',
          'host': '123.123.123.123',
          'path': 'efefwef',
          'httpHeaders': {
            'key': 'x-httpheader',
            'value': 'header_value'
          }
        }
      }
    ],
    'container': [
      {
        'type': 'container',
        'name': 'container',
        'id': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'cgroup': '483d606f-39fa-4579-a9a2-27456264b168'
      }
    ],
    'entrypoint': [
      {
        'type': 'entrypoint',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'value': 'cmd1 cmd1',
        'id': 'd70a9863-2dd8-4cbb-a371-1c3c430602fd'
      }
    ],
    'image-pull-policy': [
      {
        'type': 'image-pull-policy',
        'id': '61b245c0-ce59-42c5-818d-756104871507',
        'value': 'IfNotPresent',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a'
      }
    ],
    'empty-dir-volume': [
      {
        'type': 'empty-dir-volume',
        'id': '815fc983-3ee3-4207-8c44-d59794c1dc17',
        'name': 'empty',
        'cgroup': '483d606f-39fa-4579-a9a2-27456264b168',
        'medium': ''
      }
    ],
    'image': [
      {
        'type': 'image',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'value': 'image',
        'id': 'd8e816f8-73d1-4693-a28c-ad908ac8196b'
      }
    ],
    'environment-var': [
      {
        'type': 'environment-var',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'key': 'foo',
        'value': 'bar',
        'id': '15168cd7-d241-4291-97b6-337f0246c1e6'
      },
      {
        'type': 'environment-var',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'key': 'resourcefield',
        'id': '15168cd7-d241-4291-97b6-337f0246c123',
        'valueFrom': {
          'resourceFieldRef': {
            'containerName': 'mongodb',
            'divisor': '1',
            'resource': 'limits.cpu'
          }
        }
      },
      {
        'type': 'environment-var',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'key': 'field',
        'id': '15168cd7-d241-4291-97b6-337f0246c189',
        'valueFrom': {
          'fieldRef': {
            'apiVersion': 'v1',
            'fieldPath': 'metadata.annotations',
          }
        }
      },
      {
        'type': 'environment-var',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'key': 'secret1',
        'id': '15168cd7-d241-4291-97b6-337f0246c145',
        'valueFrom': {
          'secretKeyRef': {
            'key': 'secret1',
            'name': 'secret1',
          }
        }
      },
      {
        'type': 'environment-var',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'key': 'config1',
        'id': '15168cd7-d241-4291-97b6-337f0246c144',
        'valueFrom': {
          'configMapKeyRef': {
            'key': 'config1',
            'name': 'config1',
          }
        }
      }
    ],
    'volume-ref': [
      {
        'path': '/cache',
        'access-mode': 'ReadWriteOnce',
        'type': 'volume-ref',
        'volume': '815fc983-3ee3-4207-8c44-d59794c1dc17',
        'container-name': 'container',
        'id': '2af83bd7-2ad4-4413-9fd1-97b0299131d3',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'volume-name': 'empty'
      },
      {
        'path': '/pvc',
        'access-mode': 'ReadWriteOnce',
        'type': 'volume-ref',
        'volume': '1c4e8bb9-1cf5-4e39-9327-7d9bbaacff8c',
        'container-name': 'container',
        'id': 'e2ff0194-8512-4926-9835-1de3c28ee0a8',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'volume-name': 'pvc'
      }
    ],
    'annotation': [
      {
        'type': 'annotation',
        'annotated': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 125,
              'y': 125
            }
          }
        },
        'id': 'e79bb4ca-d703-4461-9f93-1c7102b38b0d'
      },
      {
        'type': 'annotation',
        'annotated': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'key': 'override',
        'value': 'none',
        'id': '2ae902e9-6bca-4a38-bbfb-bb40c2102e94'
      },
      {
        'type': 'annotation',
        'annotated': '26780ecc-b053-41a1-b542-525ccbab1b6a',
        'key': 'description',
        'value': 'description',
        'id': 'ef51f561-3c8b-45bd-b60c-71f91f68caf7'
      },
      {
        'type': 'annotation',
        'annotated': '1c4e8bb9-1cf5-4e39-9327-7d9bbaacff8c',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 325,
              'y': 125
            }
          }
        },
        'id': 'da13def7-4161-4328-ad71-b153b05580ed'
      },
      {
        'type': 'annotation',
        'annotated': '1c4e8bb9-1cf5-4e39-9327-7d9bbaacff8c',
        'key': 'description',
        'value': 'description',
        'id': '401acd4c-bca8-428d-8d0b-b48a942e22ec'
      },
      {
        'type': 'annotation',
        'annotated': '483d606f-39fa-4579-a9a2-27456264b168',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 100,
              'y': 100
            }
          }
        },
        'id': '8a19be47-3dc1-4ef3-a817-619ac057bc16'
      },
      {
        'type': 'annotation',
        'annotated': '483d606f-39fa-4579-a9a2-27456264b168',
        'key': 'description',
        'value': 'description',
        'id': 'fd347841-d158-4e2a-97d4-29b0a465943c'
      },
      {
        'type': 'annotation',
        'annotated': '815fc983-3ee3-4207-8c44-d59794c1dc17',
        'key': 'ui',
        'value': {
          'canvas': {
            'position': {
              'x': 125,
              'y': 300
            }
          }
        },
        'id': '73de0a5a-3efd-4203-b3c4-879a0e55c8e0'
      },
      {
        'type': 'annotation',
        'annotated': '815fc983-3ee3-4207-8c44-d59794c1dc17',
        'key': 'description',
        'value': 'description',
        'id': '1dad61e8-2421-4e5c-86de-4afd0aea97ed'
      }
    ],
    'k8s-secret-ref': [
      {
        'type': 'k8s-secret-ref',
        'secret_volume': 'acb31499-6d1c-4eb4-b943-91333808b349',
        'mount-path': '/foo',
        'id': '14823fbb-5d9b-44bb-8765-d0110df040e1',
        'container': '26780ecc-b053-41a1-b542-525ccbab1b6a',
      }
    ]
  };

  class MockEditorService {
    k8sFile: K8sFile = new K8sFile();
    reportInvalidForm(containerId, isValid) {
      // null
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        EditorEventService,
        FormBuilder,
        { provide: EditorService, useClass: MockEditorService }
      ],
      declarations: [ContainerContainerComponent]
    })
      .compileComponents();
  }));

  beforeEach(inject([EditorService], (editorService: EditorService) => {
    editorService.k8sFile.fromFlat(flat);
    fixture = TestBed.createComponent(ContainerContainerComponent);
    component = fixture.componentInstance;
    component.container = editorService.k8sFile.containers[0];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(`container's (top level items)`, () => {
    it(`name should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containers[0].name).toEqual('container');
      expect(component.form.value.name).toEqual('container');
    }));
    it(`name should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('name').setValue('newName');
      expect(editorService.k8sFile.containers[0].name).toEqual('newName');
    }));
    it(`description should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containers[0].description).toEqual('description');
      expect(component.form.value.description).toEqual('description');
    }));
    it(`description should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('description').setValue('new container one decription');
      expect(editorService.k8sFile.containers[0].description).toEqual('new container one decription');
    }));
    it(`image_pull_policy should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containers[0].image_pull_policy).toEqual('IfNotPresent');
      expect(component.form.value.image_pull_policy).toEqual('IfNotPresent');
    }));
    it(`image_pull_policy should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('image_pull_policy').setValue('Always');
      expect(editorService.k8sFile.containers[0].image_pull_policy).toEqual('Always');
    }));
    it(`image should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containers[0].image).toEqual('image');
      expect(component.form.value.image).toEqual('image');
    }));
    it(`image should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('image').setValue('newImage');
      expect(editorService.k8sFile.containers[0].image).toEqual('newImage');
    }));
    it(`command should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containers[0].command).toEqual('arg1 arg2');
      expect(component.form.value.command).toEqual('arg1 arg2');
    }));
    it(`command should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('command').setValue('newName');
      expect(editorService.k8sFile.containers[0].command).toEqual('newName');
    }));
    it(`entrypoint should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containers[0].entrypoint).toEqual('cmd1 cmd1');
      expect(component.form.value.entrypoint).toEqual('cmd1 cmd1');
    }));
    it(`entrypoint should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('entrypoint').setValue('newName');
      expect(editorService.k8sFile.containers[0].entrypoint).toEqual('newName');
    }));
  });


  describe(`livenessProbe's`, () => {
    it(`livenessProbe.interval should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containers[0].livenessProbe.interval).toEqual(10);
      expect(component.form.value.livenessProbe.interval).toEqual(10);
    }));
    it(`livenessProbe.interval should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('livenessProbe.interval').setValue(1);
      expect(editorService.k8sFile.containers[0].livenessProbe.interval).toEqual(1);
    }));
    it(`livenessProbe.retries should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containers[0].livenessProbe.retries).toEqual(30);
      expect(component.form.value.livenessProbe.retries).toEqual(30);
    }));
    it(`livenessProbe.retries should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('livenessProbe.retries').setValue(4);
      expect(editorService.k8sFile.containers[0].livenessProbe.retries).toEqual(4);
    }));
    it(`livenessProbe.timeout should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containers[0].livenessProbe.timeout).toEqual(20);
      expect(component.form.value.livenessProbe.timeout).toEqual(20);
    }));
    it(`livenessProbe.timeout should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('livenessProbe.timeout').setValue(6);
      expect(editorService.k8sFile.containers[0].livenessProbe.timeout).toEqual(6);
    }));
  });

  describe(`readinessProbe's`, () => {
    it(`readinessProbe.interval should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containers[0].readinessProbe.interval).toEqual(40);
      expect(component.form.value.readinessProbe.interval).toEqual(40);
    }));
    it(`readinessProbe.interval should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('readinessProbe.interval').setValue(1);
      expect(editorService.k8sFile.containers[0].readinessProbe.interval).toEqual(1);
    }));
    it(`readinessProbe.retries should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containers[0].readinessProbe.retries).toEqual(60);
      expect(component.form.value.readinessProbe.retries).toEqual(60);
    }));
    it(`readinessProbe.retries should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('readinessProbe.retries').setValue(2);
      expect(editorService.k8sFile.containers[0].readinessProbe.retries).toEqual(2);
    }));
    it(`readinessProbe.timeout should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containers[0].readinessProbe.timeout).toEqual(50);
      expect(component.form.value.readinessProbe.timeout).toEqual(50);
    }));
    it(`readinessProbe.timeout should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('readinessProbe.timeout').setValue(4);
      expect(editorService.k8sFile.containers[0].readinessProbe.timeout).toEqual(4);
    }));
  });

  describe(`port_mapping's`, () => {
    it('should autofill with the values from editor service', inject([EditorService], (editorService: EditorService) => {
      const port_mappingControl = component.form.get('port_mapping') as FormArray;
      expect(port_mappingControl.value.length).toEqual(1);
      expect(port_mappingControl.value[0].internal).toEqual('100');
      expect(port_mappingControl.value[0].name).toEqual('web');
      expect(port_mappingControl.value[0].protocol).toEqual('tcp');
    }));
    it('should be able to create a port_mapping formGroup', inject([EditorService], (editorService: EditorService) => {
      const testPortmapping = new PortMapping();
      testPortmapping.internal = '4444', testPortmapping.name = 'bar', testPortmapping.protocol = 'udp';
      const testSubject = component.createPortMapping(testPortmapping);
      expect(testSubject).toEqual(jasmine.any(FormGroup));
      expect(testSubject.value.internal).toEqual('4444');
      expect(testSubject.value.name).toEqual('bar');
      expect(testSubject.value.protocol).toEqual('udp');
    }));
    it('should be able to add a new defined port_mapping to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const port_mapping = component.form.get('port_mapping') as FormArray;
      const testPortmapping = new PortMapping();
      testPortmapping.internal = '4444', testPortmapping.name = 'bar', testPortmapping.protocol = 'udp';
      component.addPortMapping(testPortmapping);
      expect(port_mapping.value.length).toEqual(2);
      expect(port_mapping.value[1].internal).toEqual('4444');
      expect(port_mapping.value[1].name).toEqual('bar');
      expect(port_mapping.value[1].protocol).toEqual('udp');
    }));
    it('should be able to add a new undefined port_mapping to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const port_mapping = component.form.get('port_mapping') as FormArray;
      component.addPortMapping();
      expect(port_mapping.value.length).toEqual(2);
      expect(port_mapping.value[1].internal).toEqual('');
      expect(port_mapping.value[1].name).toEqual('');
      expect(port_mapping.value[1].protocol).toEqual('tcp');
    }));

    it('should be able to remove a port_mapping to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const port_mappingControl = component.form.get('port_mapping') as FormArray;
      expect(port_mappingControl.value.length).toEqual(1);
      expect(port_mappingControl.value[0].internal).toEqual('100');
      expect(port_mappingControl.value[0].name).toEqual('web');
      expect(port_mappingControl.value[0].protocol).toEqual('tcp');
      component.removePortMapping(0);
      expect(port_mappingControl.length).toEqual(0);
    }));
  });

  describe(`environment_var's`, () => {
    it('should autofill with the environment variables values from editor service', inject([EditorService], (editorService: EditorService) => {
      const environment_varControl = component.form.get('environment_var') as FormArray;
      expect(environment_varControl.value.length).toEqual(1);
      expect(environment_varControl.value[0].key).toEqual('foo');
      expect(environment_varControl.value[0].value).toEqual('bar');
    }));
    it('should autofill with the field reference variables and values from editor service', inject([EditorService], (editorService: EditorService) => {
      const field_varControl = component.form.get('env_field_ref') as FormArray;
      expect(field_varControl.value.length).toEqual(1);
      expect(field_varControl.value[0].apiVersion).toEqual('v1');
      expect(field_varControl.value[0].fieldPath).toEqual('metadata.annotations');
    }));
    it('should autofill with the resource field reference variables and values from editor service', inject([EditorService], (editorService: EditorService) => {
      const resourceField_varControl = component.form.get('env_resource_field_ref') as FormArray;
      expect(resourceField_varControl.value.length).toEqual(1);
      expect(resourceField_varControl.value[0].containerName).toEqual('mongodb');
      expect(resourceField_varControl.value[0].divisor).toEqual('1');
      expect(resourceField_varControl.value[0].resource).toEqual('limits.cpu');
    }));
    it('should autofill with the config reference variables and values from editor service', inject([EditorService], (editorService: EditorService) => {
      const configRef_varControl = component.form.get('config_map_ref') as FormArray;
      expect(configRef_varControl.value.length).toEqual(1);
      expect(configRef_varControl.value[0].config_key).toEqual('config1');
      expect(configRef_varControl.value[0].config_name).toEqual('config1');
    }));
    it('should autofill with the secret reference variables and values from editor service', inject([EditorService], (editorService: EditorService) => {
      const secretRef_varControl = component.form.get('env_secret_ref') as FormArray;
      expect(secretRef_varControl.value.length).toEqual(1);
      expect(secretRef_varControl.value[0].secret_key).toEqual('secret1');
      expect(secretRef_varControl.value[0].secret_name).toEqual('secret1');
    }));
    it('should be able to create an environmentVar formGroup', inject([EditorService], (editorService: EditorService) => {
      const testEnvironmentVar = new EnvironmentVar();
      testEnvironmentVar.key = 'new key', testEnvironmentVar.value = 'new value';
      const testSubject = component.createEnvironmentVar(testEnvironmentVar);
      expect(testSubject).toEqual(jasmine.any(FormGroup));
      expect(testSubject.value.key).toEqual('new key');
      expect(testSubject.value.value).toEqual('new value');
    }));
    it('should be able to add a new defined environmentVar to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const testEnvVar = new EnvironmentVar();
      const environment_varControl = component.form.get('environment_var') as FormArray;
      testEnvVar.key = 'tevnvarkey', testEnvVar.value = 'tevnvarvalue';
      component.addEnvironmentVar(testEnvVar);
      expect(environment_varControl.value.length).toEqual(2);
      expect(environment_varControl.value[1].key).toEqual('tevnvarkey');
      expect(environment_varControl.value[1].value).toEqual('tevnvarvalue');
    }));
    it('should be able to add a new undefined environmentVar to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const environment_varControl = component.form.get('environment_var') as FormArray;
      component.addEnvironmentVar();
      expect(environment_varControl.value.length).toEqual(2);
      expect(environment_varControl.value[1].key).toEqual('');
      expect(environment_varControl.value[1].value).toEqual('');
    }));
    it('should be able to remove a environmentVar to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const environment_varControl = component.form.get('environment_var') as FormArray;
      expect(environment_varControl.value.length).toEqual(1);
      expect(environment_varControl.value[0].key).toEqual('foo');
      expect(environment_varControl.value[0].value).toEqual('bar');
      component.removeEnvironmentVar(0);
      expect(environment_varControl.value.length).toEqual(0);
    }));
    it('should be able to add a new defined configmap reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const configMapRef = new EnvironmentVar();
      const config_varControl = component.form.get('config_map_ref') as FormArray;
      configMapRef.config_key = 'newConfigKey', configMapRef.config_name = 'newConfigName';
      component.addConfigMapRef(configMapRef);
      expect(config_varControl.value.length).toEqual(2);
      expect(config_varControl.value[1].config_key).toEqual('newConfigKey');
      expect(config_varControl.value[1].config_name).toEqual('newConfigName');
    }));
    it('should be able to add a new undefined configmap reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const config_varControl = component.form.get('config_map_ref') as FormArray;
      component.addConfigMapRef();
      expect(config_varControl.value.length).toEqual(2);
      expect(config_varControl.value[1].config_key).toEqual('');
      expect(config_varControl.value[1].config_name).toEqual('');
    }));
    it('should be able to remove a configmap reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const configRef_varControl = component.form.get('config_map_ref') as FormArray;
      expect(configRef_varControl.value.length).toEqual(1);
      expect(configRef_varControl.value[0].config_key).toEqual('config1');
      expect(configRef_varControl.value[0].config_name).toEqual('config1');
      component.removeConfigMapRef(0);
      expect(configRef_varControl.value.length).toEqual(0);
    }));
    it('should be able to add a new defined secret reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const secretRef = new EnvironmentVar();
      const secretRef_varControl = component.form.get('env_secret_ref') as FormArray;
      secretRef.secret_key = 'newSecretKey', secretRef.secret_name = 'newSecretName';
      component.addEnvSecretRef(secretRef);
      expect(secretRef_varControl.value.length).toEqual(2);
      expect(secretRef_varControl.value[1].secret_key).toEqual('newSecretKey');
      expect(secretRef_varControl.value[1].secret_name).toEqual('newSecretName');
    }));
    it('should be able to add a new undefined secret reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const secretRef_varControl = component.form.get('env_secret_ref') as FormArray;
      component.addEnvSecretRef();
      expect(secretRef_varControl.value.length).toEqual(2);
      expect(secretRef_varControl.value[1].secret_key).toEqual('');
      expect(secretRef_varControl.value[1].secret_name).toEqual('');
    }));
    it('should be able to remove a secret reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const secretRef_varControl = component.form.get('env_secret_ref') as FormArray;
      expect(secretRef_varControl.value.length).toEqual(1);
      expect(secretRef_varControl.value[0].secret_key).toEqual('secret1');
      expect(secretRef_varControl.value[0].secret_name).toEqual('secret1');
      component.removeEnvSecretRef(0);
      expect(secretRef_varControl.value.length).toEqual(0);
    }));
    it('should be able to add a new defined field reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const fieldRef = new EnvironmentVar();
      const fieldRef_varControl = component.form.get('env_field_ref') as FormArray;
      fieldRef.apiVersion = 'v2', fieldRef.fieldPath = 'metadata.annotations';
      component.addFieldRef(fieldRef);
      expect(fieldRef_varControl.value.length).toEqual(2);
      expect(fieldRef_varControl.value[1].apiVersion).toEqual('v2');
      expect(fieldRef_varControl.value[1].fieldPath).toEqual('metadata.annotations');
    }));
    it('should be able to add a new undefined field reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const fieldRef_varControl = component.form.get('env_field_ref') as FormArray;
      component.addFieldRef();
      expect(fieldRef_varControl.value.length).toEqual(2);
      expect(fieldRef_varControl.value[1].key).toEqual('');
      expect(fieldRef_varControl.value[1].apiVersion).toEqual('v1');
      expect(fieldRef_varControl.value[1].fieldPath).toEqual('-- Select a path --');
    }));
    it('should be able to remove a field reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const fieldRef_varControl = component.form.get('env_field_ref') as FormArray;
      expect(fieldRef_varControl.value.length).toEqual(1);
      expect(fieldRef_varControl.value[0].apiVersion).toEqual('v1');
      expect(fieldRef_varControl.value[0].fieldPath).toEqual('metadata.annotations');
      component.removeFieldRef(0);
      expect(fieldRef_varControl.value.length).toEqual(0);
    }));
    it('should be able to add a new defined resource field reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const resourceFieldRef = new EnvironmentVar();
      const resourceFieldRef_varControl = component.form.get('env_resource_field_ref') as FormArray;
      resourceFieldRef.containerName = 'newResourceFieldRef', resourceFieldRef.divisor = '2', resourceFieldRef.resource = 'limits.cpu';
      component.addResourceFieldRef(resourceFieldRef);
      expect(resourceFieldRef_varControl.value.length).toEqual(2);
      expect(resourceFieldRef_varControl.value[1].containerName).toEqual('newResourceFieldRef');
      expect(resourceFieldRef_varControl.value[1].divisor).toEqual('2');
      expect(resourceFieldRef_varControl.value[1].resource).toEqual('limits.cpu');
    }));
    it('should be able to add a new undefined resource field reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const resourceFieldRef_varControl = component.form.get('env_resource_field_ref') as FormArray;
      component.addResourceFieldRef();
      expect(resourceFieldRef_varControl.value.length).toEqual(2);
      expect(resourceFieldRef_varControl.value[1].key).toEqual('');
      expect(resourceFieldRef_varControl.value[1].containerName).toEqual('');
      expect(resourceFieldRef_varControl.value[1].divisor).toEqual('1');
      expect(resourceFieldRef_varControl.value[1].resource).toEqual('-- Select a resource --');
    }));
    it('should be able to remove a resource field reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const resourceFieldRef_varControl = component.form.get('env_resource_field_ref') as FormArray;
      expect(resourceFieldRef_varControl.value.length).toEqual(1);
      expect(resourceFieldRef_varControl.value[0].containerName).toEqual('mongodb');
      expect(resourceFieldRef_varControl.value[0].divisor).toEqual('1');
      expect(resourceFieldRef_varControl.value[0].resource).toEqual('limits.cpu');
      component.removeResourceFieldRef(0);
      expect(resourceFieldRef_varControl.value.length).toEqual(0);
    }));
    it('should replace existing environment variables when handleBulkEnvReplace() is called', () => {
      const environment_varControl = component.form.get('environment_var') as FormArray;
      expect(environment_varControl.value.length).toEqual(1);
      expect(environment_varControl.value[0].key).toEqual('foo');
      expect(environment_varControl.value[0].value).toEqual('bar');
      const newEnvVars = 'newVariable=newValue';
      component.handleBulkEnvReplace(newEnvVars);
      expect(environment_varControl.value.length).toEqual(1);
      expect(environment_varControl.value[0].key).toEqual('newVariable');
      expect(environment_varControl.value[0].value).toEqual('newValue');
    });
    it('should append new environment variables to existing environment variables when handleBulkEnvAppend() is called', () => {
      const environment_varControl = component.form.get('environment_var') as FormArray;
      expect(environment_varControl.value.length).toEqual(1);
      expect(environment_varControl.value[0].key).toEqual('foo');
      expect(environment_varControl.value[0].value).toEqual('bar');
      const newEnvVars = 'newFoo=newBar';
      component.handleBulkEnvAppend(newEnvVars);
      expect(environment_varControl.value.length).toEqual(2);
      expect(environment_varControl.value[1].key).toEqual('newFoo');
      expect(environment_varControl.value[1].value).toEqual('newBar');
    });
  });

  describe(`volume_ref's`, () => {
    it('should autofill with the values from editor service', inject([EditorService], (editorService: EditorService) => {
      const volume_refControl = component.form.get('volume_ref') as FormArray;
      expect(volume_refControl.value.length).toEqual(1);
      expect(volume_refControl.value[0].path).toEqual('/pvc');
    }));
    it('should be able to mutate the volume_ref value in the editor service', inject([EditorService], (editorService: EditorService) => {
      const volumeRefControl = (component.form.get('volume_ref') as FormArray).controls[0];
      expect(volumeRefControl.value.path).toEqual('/pvc');
      const volumeRefGroup = volumeRefControl as FormGroup;
      volumeRefGroup.controls.path.setValue('wefwe');
      expect(volumeRefControl.value.path).toEqual('wefwe');
      expect(editorService.k8sFile.containers[0].volume_ref[0].path).toEqual('wefwe');
      volumeRefGroup.controls.access_mode.setValue('newaccessmode');
      expect(volumeRefControl.value.access_mode).toEqual('newaccessmode');
      expect(editorService.k8sFile.containers[0].volume_ref[0].access_mode).toEqual('newaccessmode');
    }));
  });

  describe(`empty_dir_ref's`, () => {
    it('should autofill with the values from editor service', inject([EditorService], (editorService: EditorService) => {
      const empty_dir_refControl = component.form.get('empty_dir_ref') as FormArray;
      expect(empty_dir_refControl.value.length).toEqual(1);
      expect(empty_dir_refControl.value[0].path).toEqual('/cache');
    }));
    it('should be able to mutate the volume_ref value in the editor service', inject([EditorService], (editorService: EditorService) => {
      const emptyDirRefControl = (component.form.get('empty_dir_ref') as FormArray).controls[0];
      expect(emptyDirRefControl.value.path).toEqual('/cache');
      const emptyDirRefGroup = emptyDirRefControl as FormGroup;
      emptyDirRefGroup.controls.path.setValue('wefefewfwefwefewwe');
      expect(emptyDirRefControl.value.path).toEqual('wefefewfwefwefewwe');
      expect(editorService.k8sFile.containers[0].empty_dir_ref[0].path).toEqual('wefefewfwefwefewwe');
    }));
  });

  describe(`config_ref`, () => {
    it('should autofill with the config_ref values from editor service', inject([EditorService], (editorService: EditorService) => {
      const config_refControl = component.form.get('config_ref') as FormArray;
      expect(config_refControl.value.length).toEqual(1);
      expect(config_refControl.value[0].config).toEqual('b5d7d86f-5351-4ae8-9923-85bd0854a4eb');
      expect(config_refControl.value[0].path).toEqual('/config');
    }));
    it('should be able to create a config_ref formGroup', inject([EditorService], (editorService: EditorService) => {
      const testConfigRef = new ConfigRef();
      testConfigRef.config = 'config3', testConfigRef.path = 'path2';
      const testSubject = component.createConfigRef(testConfigRef);
      expect(testSubject).toEqual(jasmine.any(FormGroup));
      expect(testSubject.value.config).toEqual('config3');
      expect(testSubject.value.path).toEqual('path2');
    }));
    it('should be able to create a new defined config_ref to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const configRef = new ConfigRef();
      const configRef_varControl = component.form.get('config_ref') as FormArray;
      configRef.path = 'newPath', configRef.config = 'b5d7d86f-5351-4ae8-9923-85bd0854a8uy';
      component.addConfigRef(configRef);
      expect(configRef_varControl.value.length).toEqual(2);
      expect(configRef_varControl.value[0].path).toEqual('/config');
      expect(configRef_varControl.value[0].config).toEqual('b5d7d86f-5351-4ae8-9923-85bd0854a4eb');
      expect(configRef_varControl.value[1].path).toEqual('newPath');
      expect(configRef_varControl.value[1].config).toEqual('b5d7d86f-5351-4ae8-9923-85bd0854a8uy');
    }));
    it('should be able to create a new undefined config_ref to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const configRef_varControl = component.form.get('config_ref') as FormArray;
      component.addConfigRef();
      expect(configRef_varControl.value.length).toEqual(2);
      expect(configRef_varControl.value[0].path).toEqual('/config');
      expect(configRef_varControl.value[0].config).toEqual('b5d7d86f-5351-4ae8-9923-85bd0854a4eb');
      expect(configRef_varControl.value[1].path).toEqual('');
      expect(configRef_varControl.value[1].config).toEqual('b5d7d86f-5351-4ae8-9923-85bd0854a4eb');
    }));
    it('should be able to mutate the config_ref value in the editor service', inject([EditorService], (editorService: EditorService) => {
      const configRefControl = (component.form.get('config_ref') as FormArray).controls[0];
      expect(configRefControl.value.config).toEqual('b5d7d86f-5351-4ae8-9923-85bd0854a4eb');
      expect(configRefControl.value.path).toEqual('/config');
      const configRefGroup = configRefControl as FormGroup;
      configRefGroup.controls.config.setValue('weewfwefwefwe');
      expect(configRefControl.value.config).toEqual('weewfwefwefwe');
      expect(editorService.k8sFile.containers[0].config_ref[0].config).toEqual('weewfwefwefwe');
      configRefGroup.controls.path.setValue('newPath5');
      expect(configRefControl.value.path).toEqual('newPath5');
      expect(editorService.k8sFile.containers[0].config_ref[0].path).toEqual('newPath5');
    }));
    it('should be able to remove a config reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const configRef_varControl = component.form.get('config_ref') as FormArray;
      expect(configRef_varControl.value.length).toEqual(1);
      component.removeConfigRef(0);
      expect(configRef_varControl.value.length).toEqual(0);
    }));
  });

  describe(`k8s_secret_ref`, () => {
    it('should autofill with the k8s_secret_ref values from editor service', inject([EditorService], (editorService: EditorService) => {
      const secret_refControl = component.form.get('k8s_secret_ref') as FormArray;
      expect(secret_refControl.value.length).toEqual(1);
      expect(secret_refControl.value[0].mount_path).toEqual('/foo');
    }));
    it('should be able to add a new defined k8s secret reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const secretRef = new K8sSecretRef();
      const secretRef_varControl = component.form.get('k8s_secret_ref') as FormArray;
      secretRef.secret_volume = 'newVolume', secretRef.mount_path = '/bar';
      component.addSecretRef(secretRef);
      expect(secretRef_varControl.value.length).toEqual(2);
      expect(secretRef_varControl.value[0].mount_path).toEqual('/foo');
      expect(secretRef_varControl.value[1].mount_path).toEqual('/bar');
    }));
    it('should be able to add a new undefined k8s secret reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const secretRef_varControl = component.form.get('k8s_secret_ref') as FormArray;
      component.addSecretRef();
      expect(secretRef_varControl.value.length).toEqual(2);
      expect(secretRef_varControl.value[0].mount_path).toEqual('/foo');
      expect(secretRef_varControl.value[1].mount_path).toEqual('');
    }));
    it('should be able to remove a k8s secret reference to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const secretRef_varControl = component.form.get('k8s_secret_ref') as FormArray;
      expect(secretRef_varControl.value.length).toEqual(1);
      component.removeSecretRef(0);
      expect(secretRef_varControl.value.length).toEqual(0);
    }));
  });

  describe(`readiness & liveness probes`, () => {
    it('should create a readiness probe with http when initReadinessProbeForm() is called with http', inject([EditorService], (editorService: EditorService) => {
      const readinessProbe_varControl = component.form.get('readinessProbe') as FormArray;
      component.initReadinessProbeForm('http');
      expect(readinessProbe_varControl.value.interval).toEqual(40);
      expect(readinessProbe_varControl.value.retries).toEqual(60);
      expect(readinessProbe_varControl.value.timeout).toEqual(50);
      expect(readinessProbe_varControl.value.httpGet.host).toEqual('');
      expect(readinessProbe_varControl.value.httpGet.path).toEqual('');
      expect(readinessProbe_varControl.value.httpGet.port).toEqual('');
      expect(readinessProbe_varControl.value.httpGet.scheme).toEqual('HTTP');
    }));
    it('should create a readiness probe with exec when initReadinessProbeForm() is called with exec', inject([EditorService], (editorService: EditorService) => {
      const readinessProbe_varControl = component.form.get('readinessProbe') as FormArray;
      component.initReadinessProbeForm('exec');
      expect(readinessProbe_varControl.value.interval).toEqual(40);
      expect(readinessProbe_varControl.value.retries).toEqual(60);
      expect(readinessProbe_varControl.value.timeout).toEqual(50);
      expect(readinessProbe_varControl.value.healthcmd).toEqual([]);
    }));
    it('should remove http or exec on a readiness probe when initReadinessProbeForm() is called with nothing', inject([EditorService], (editorService: EditorService) => {
      const readinessProbe_varControl = component.form.get('readinessProbe') as FormArray;
      component.initReadinessProbeForm('');
      expect(readinessProbe_varControl.value.interval).toEqual(40);
      expect(readinessProbe_varControl.value.retries).toEqual(60);
      expect(readinessProbe_varControl.value.timeout).toEqual(50);
      expect(readinessProbe_varControl.value.httpGet).toBeUndefined();
      expect(readinessProbe_varControl.value.healthcmd).toBeUndefined();
    }));
    it('should add an http header to readiness probe when addProbeHttpHeader', inject([EditorService], (editorService: EditorService) => {
      const readinessProbe_varControl = component.form.get('readinessProbe') as FormArray;
      component.initReadinessProbeForm('http');
      component.addProbeHttpHeader('readinessProbe', 'header1');
      expect(readinessProbe_varControl.value.httpGet.httpHeaders.length).toEqual(1);
    }));
    it('should add an http header to readiness probe when addProbeHttpHeader', inject([EditorService], (editorService: EditorService) => {
      const readinessProbe_varControl = component.form.get('readinessProbe') as FormArray;
      component.initReadinessProbeForm('http');
      component.addProbeHttpHeader('readinessProbe');
      expect(readinessProbe_varControl.value.httpGet.httpHeaders.length).toEqual(1);
    }));
    it('should remove an http header from readiness probe when removeProbeHttpHeader', inject([EditorService], (editorService: EditorService) => {
      const readinessProbe_varControl = component.form.get('readinessProbe') as FormArray;
      component.initReadinessProbeForm('http');
      component.addProbeHttpHeader('readinessProbe');
      expect(readinessProbe_varControl.value.httpGet.httpHeaders.length).toEqual(1);
      component.removeProbeHttpHeader('readinessProbe', 0);
      expect(readinessProbe_varControl.value.httpGet.httpHeaders.length).toEqual(0);
    }));
    it('should add a health command header to readiness probe when addReadinessProbeHealthCmd', inject([EditorService], (editorService: EditorService) => {
      const readinessProbe_varControl = component.form.get('readinessProbe') as FormArray;
      component.initReadinessProbeForm('exec');
      component.addReadinessProbeHealthCmd('readinessProbe');
      expect(readinessProbe_varControl.value.healthcmd.length).toEqual(1);
    }));
    it('should remove a health command from readiness probe when remove', inject([EditorService], (editorService: EditorService) => {
      const readinessProbe_varControl = component.form.get('readinessProbe') as FormArray;
      component.initReadinessProbeForm('exec');
      component.addReadinessProbeHealthCmd('readinessProbe');
      expect(readinessProbe_varControl.value.healthcmd.length).toEqual(1);
      component.removeReadinessProbeHealthCmd(0);
      expect(readinessProbe_varControl.value.healthcmd.length).toEqual(0);
    }));
    it('should create a liveness probe with http when initlivenessProbeForm() is called with http', inject([EditorService], (editorService: EditorService) => {
      const livenessProbe_varControl = component.form.get('livenessProbe') as FormArray;
      component.initLivenessProbeForm('http');
      expect(livenessProbe_varControl.value.interval).toEqual(10);
      expect(livenessProbe_varControl.value.retries).toEqual(30);
      expect(livenessProbe_varControl.value.timeout).toEqual(20);
      expect(livenessProbe_varControl.value.httpGet.host).toEqual('');
      expect(livenessProbe_varControl.value.httpGet.path).toEqual('');
      expect(livenessProbe_varControl.value.httpGet.port).toEqual('');
      expect(livenessProbe_varControl.value.httpGet.scheme).toEqual('HTTP');
    }));
    it('should create a liveness probe with exec when initLivenessProbeForm() is called with exec', inject([EditorService], (editorService: EditorService) => {
      const livenessProbe_varControl = component.form.get('livenessProbe') as FormArray;
      component.initLivenessProbeForm('exec');
      expect(livenessProbe_varControl.value.interval).toEqual(10);
      expect(livenessProbe_varControl.value.retries).toEqual(30);
      expect(livenessProbe_varControl.value.timeout).toEqual(20);
      expect(livenessProbe_varControl.value.healthcmd).toEqual([]);
    }));
    it('should remove http or exec on a liveness probe when initLivenessProbeForm() is called with nothing', inject([EditorService], (editorService: EditorService) => {
      const livenessProbe_varControl = component.form.get('livenessProbe') as FormArray;
      component.initLivenessProbeForm('');
      expect(livenessProbe_varControl.value.interval).toEqual(10);
      expect(livenessProbe_varControl.value.retries).toEqual(30);
      expect(livenessProbe_varControl.value.timeout).toEqual(20);
      expect(livenessProbe_varControl.value.httpGet).toBeUndefined();
      expect(livenessProbe_varControl.value.healthcmd).toBeUndefined();
    }));
    it('should add an http header to liveness probe when addProbeHttpHeader', inject([EditorService], (editorService: EditorService) => {
      const livenessProbe_varControl = component.form.get('livenessProbe') as FormArray;
      component.initLivenessProbeForm('http');
      component.addProbeHttpHeader('livenessProbe', 'header1');
      expect(livenessProbe_varControl.value.httpGet.httpHeaders.length).toEqual(1);
    }));
    it('should add an http header to liveness probe when addProbeHttpHeader', inject([EditorService], (editorService: EditorService) => {
      const livenessProbe_varControl = component.form.get('livenessProbe') as FormArray;
      component.initLivenessProbeForm('http');
      component.addProbeHttpHeader('livenessProbe');
      expect(livenessProbe_varControl.value.httpGet.httpHeaders.length).toEqual(1);
    }));
    it('should remove an http header from liveness probe when removeProbeHttpHeader', inject([EditorService], (editorService: EditorService) => {
      const livenessProbe_varControl = component.form.get('livenessProbe') as FormArray;
      component.initLivenessProbeForm('http');
      component.addProbeHttpHeader('livenessProbe');
      expect(livenessProbe_varControl.value.httpGet.httpHeaders.length).toEqual(1);
      component.removeProbeHttpHeader('livenessProbe', 0);
      expect(livenessProbe_varControl.value.httpGet.httpHeaders.length).toEqual(0);
    }));
    it('should add a health command header to liveness probe when addReadinessProbeHealthCmd', inject([EditorService], (editorService: EditorService) => {
      const livenessProbe_varControl = component.form.get('livenessProbe') as FormArray;
      component.initLivenessProbeForm('exec');
      component.addLivenessProbeHealthCmd('livenessProbe');
      expect(livenessProbe_varControl.value.healthcmd.length).toEqual(1);
    }));
    it('should remove a health command from liveness probe when remove', inject([EditorService], (editorService: EditorService) => {
      const livenessProbe_varControl = component.form.get('livenessProbe') as FormArray;
      component.initLivenessProbeForm('exec');
      component.addLivenessProbeHealthCmd('livenessProbe');
      expect(livenessProbe_varControl.value.healthcmd.length).toEqual(1);
      component.removeLivenessProbeHealthCmd(0);
      expect(livenessProbe_varControl.value.healthcmd.length).toEqual(0);
    }));
  });
});
