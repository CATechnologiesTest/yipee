import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

import { ApiService } from '../../../../shared/services/api.service';
import { DownloadService } from '../../../../shared/services/download.service';

import { NerdmodeContainerComponent } from './nerdmode-container.component';
import { EditorService } from '../../../editor.service';
import { YipeeFileRaw } from '../../../../models/YipeeFileRaw';
import { OpenShiftFile } from '../../../../models/OpenShiftFile';
import { KubernetesFile } from '../../../../models/KubernetesFile';
import { HelmFile } from '../../../../models/HelmFile';
import { YipeeFileService } from '../../../../shared/services/yipee-file.service';
import { K8sFile } from '../../../../models/k8s/K8sFile';

describe('NerdmodeContainerComponent', () => {
  let component: NerdmodeContainerComponent;
  let fixture: ComponentFixture<NerdmodeContainerComponent>;

  class MockEditorService {
    constructor() { }
    invalidKeys: string[];
    k8sFile = new K8sFile();
    alertText: string[];
    nerdModeType: undefined;
    metadata = YipeeFileService.newTestYipeeFileMetadata('doggy');

    downloadKubernetes(): boolean {
      return true;
    }

  }

  class MockAPIService {

    getLiveKubernetesFileDataFromFlat(yipeeFile: YipeeFileRaw): Observable<KubernetesFile> {
      return of({ name: 'name', version: 0, kubernetesFile: 'k file data' });
    }

    getLiveHelmFileDataFromFlat(yipeeFile: YipeeFileRaw): Observable<HelmFile> {
      return of({ name: 'name', version: 0, helmFile: 'h file data' });
    }

    constructor() { }

  }

  class MockDownloadService {

    generateName(name: string, version: number, type: string): string {
      return name;
    }

    downloadFile(data: any, fileName: string): void {
      expect(data).toBeDefined();
      expect(fileName).toBeDefined();
    }

    constructor() { }

  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NerdmodeContainerComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: EditorService, useClass: MockEditorService },
        { provide: ApiService, useClass: MockAPIService },
        { provide: DownloadService, useClass: MockDownloadService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NerdmodeContainerComponent);
    component = fixture.componentInstance;
    component.id = '234wdfkjwefwef';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should eventually set load and type properly on loadFile on loadFile(kubernetes)', inject([ApiService], (service: ApiService) => {
    component.getFile('kubernetes').subscribe((code) => {
      expect(code).toEqual('k file data');
    });
  }));

  it('should eventually set load and type properly on loadFile on loadFile(helm)', inject([ApiService], (service: ApiService) => {
    component.getFile('helm').subscribe((code) => {
      expect(code).toEqual('h file data');
    });
  }));

  it('should call the helm download service properly on downloadFile()', inject([DownloadService, EditorService], (service: DownloadService, editorService: EditorService) => {
    editorService.invalidKeys = [];
    const result = component.downloadFile('helm');
    expect(result).toEqual(true);
  }));

  it('should call the kubernetes download service properly on downloadFile()', inject([DownloadService, EditorService], (service: DownloadService, editorService: EditorService) => {
    editorService.invalidKeys = [];
    const result = component.downloadFile('kubernetes');
    expect(result).toEqual(true);
  }));
});
