import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, EventEmitter, } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { CanvasComponent } from './canvas.component';
import { CanvasUtility } from './canvas.utility';
import { EditorService } from '../editor.service';
import { ApiService } from '../../shared/services/api.service';
import { FeatureService } from '../../shared/services/feature.service';
import { EditorEventService } from '../editor-event.service';
import { K8sFile } from '../../models/k8s/K8sFile';
import { YipeeFileMetadata } from '../../models/YipeeFileMetadata';
import { YipeeFileMetadataRaw } from '../../models/YipeeFileMetadataRaw';
import { Container } from '../../models/common/Container';

class MockApiService {

}

class MockFeatureService {
  features = [];
}

class MockEditorService {
  dirty: false;
  yipeeFileLogo: string;
  yipeeFileRaw: YipeeFileMetadataRaw = {
    id: '123',
    hasLogo: true,
    flatFile: [],
    name: '',
    author: '',
    username: '',
    containers: [],
    isPrivate: false,
    uiFile: {
      appinfo: {
        id: 'foo',
        name: '',
        description: '',
      },
      secrets: [],
      volumes: [
        {
          id: '1111',
          name: 'volume1',
          annotations: {}
        }
      ],
      services: [
        {
          id: '3333',
          name: 'svc1',
          annotations: {
            description: 'service description 1',
            override: 'none',
            development_config: {
              image: 'service development_config image 1',
              repository: 'service development_config repository 1',
              tag: 'service development_config tag 1'
            },
            external_config: {
              image: 'HA Proxy',
              'proxy-type': 'HTTP',
              server: 'server address 1',
              ports: ['8888:9999', '1101:5555']
            }
          },
          ports: ['1111:2222', '3333:4444'],
          environment: ['variable1=value1', 'variable2=value2'],
          restart: 'no',
          command: 'service command 1',
          build: 'service build 1',
          deploy: {
            mode: 'replicated',
            count: 2
          },
          entrypoint: 'service entrypoint 1',
          labels: ['label1=value1', 'label2=value2'],
          logging: {
            driver: 'service logging driver 1',
            options: [
              { name: 'service logging option name 1',
                value: 'service logging option value 1'
              },
              {
                name: 'service logging option name 2',
                value: 'service logging option value 2'
              }
            ]
          },
          healthcheck: {
            interval: 0,
            retries: 0,
            timeout: 0,
            healthcmd: [
              'service healthcmd string 1',
              'service healthcmd string 2'
            ]
          },
          image: 'serviceRegistry1:1111/serviceImage1:serviceTag1',
          secrets: [
            {
              source: 'sc1',
              target: 'target 1',
              uid: '2222',
              gid: '3333',
              mode: '777',
            },
            {
              source: 'sc2',
              target: 'target 2',
              uid: '8888',
              gid: '6666',
              mode: '999'
            }
          ],
          volumes: ['volume1:/mountpoint:ro', '/path1:/mountpoint:rw']
      }]
    }
  };

  metadata: YipeeFileMetadata = new YipeeFileMetadata(this.yipeeFileRaw);
  k8sFile: K8sFile = new K8sFile();
  onContainerAdd = new EventEmitter<Container>();
  invalidKeys: string[] = [];

  constructor() { }


}

describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CanvasComponent],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: EditorService, useClass: MockEditorService },
        EditorEventService,
        { provide: ApiService, useClass: MockApiService },
        { provide: FeatureService, useClass: MockFeatureService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should truncate text', () => {
    expect(component).toBeTruthy();
    const truncated = CanvasUtility.getStringForSize('this is a long string', 50, '14px', 'Helvetica', 'bold');
    expect(truncated).toEqual('this i...');
  });

});
