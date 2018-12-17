import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

import { EditorEventService } from './editor-event.service';
import { EditorService } from './editor.service';
import { YipeeFileService } from '../shared/services/yipee-file.service';
import { YipeeFileMetadata } from '../models/YipeeFileMetadata';
import { FeatureService } from '../shared/services/feature.service';
import { DownloadService } from '../shared/services/download.service';
import { ApiService } from '../shared/services/api.service';

describe('EditorService', () => {

  const yipeeMetadata1: YipeeFileMetadata = YipeeFileService.newTestYipeeFileMetadata('doggy');

  class MockApiService {
    constructor() { }
  }

  class MockDownloadService {
    constructor() {
    }

    downloadKubernetesFile() {
      return of(true);
    }

    downloadKubernetesArchive() {
      return of(true);
    }

    downloadHelmArchive() {
      return of(true);
    }

  }

  class MockYipeeFileService {
    constructor() { }

    read(yipeeFile_id: string): Observable<YipeeFileMetadata> {
      return of(yipeeMetadata1);
    }

    update(metadata: YipeeFileMetadata): Observable<YipeeFileMetadata> {
      return of(yipeeMetadata1);
    }
  }


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ],
      imports: [HttpModule],
      providers: [
        EditorEventService,
        EditorService,
        { provide: ApiService, useClass: MockApiService },
        { provide: DownloadService, useClass: MockDownloadService },
        { provide: YipeeFileService, useClass: MockYipeeFileService }
      ]
    }).compileComponents();
  });

  it('should be created', inject([EditorService], (service: EditorService) => {
    expect(service).toBeTruthy();
  }));

  it('should set readonly correctly', inject([EditorService], (service: EditorService) => {
    expect(service.readOnly).toBeFalsy();
    service.readOnly = true;
    expect(service.readOnly).toBeTruthy();
  }));

  it('should set dirty correctly', inject([EditorService], (service: EditorService) => {
    expect(service.dirty).toBeFalsy();
    service.dirty = true;
    expect(service.dirty).toBeTruthy();
  }));

  describe(`should check when downloads are successful that it resets the dirty flag to false (download methods)`, () => {

    beforeEach(inject([EditorService], (service: EditorService) => {

      expect(service.dirty).toBeFalsy();
      service.dirty = true;
      expect(service.dirty).toBeTruthy();
    }));

    afterEach(inject([EditorService], (service: EditorService) => {
      expect(service.dirty).toBeFalsy();
    }));

    it(`should check when downloadCurrentModel is Successful that it resets the dirty flag to false`, inject([EditorService], (service: EditorService) => {
      service.downloadCurrentModel();
    }));
    it(`should check when downloadKubernetes is Successful that it resets the dirty flag to false`, inject([EditorService], (service: EditorService) => {
      service.downloadKubernetes();
    }));
    it(`should check when downloadKubernetesArchive is Successful that it resets the dirty flag to false`, inject([EditorService], (service: EditorService) => {
      service.downloadKubernetesArchive();
    }));
    it(`should check when downloadHelm is Successful that it resets the dirty flag to false`, inject([EditorService], (service: EditorService) => {
      service.downloadHelm();
    }));

  });

  describe(`should check when downloads are unSuccessful that it sets warningText and the dirty flag remains true (download methods)`, () => {

    beforeEach(inject([EditorService, DownloadService], (service: EditorService, ds: DownloadService) => {
      const falseFunction = function () {
        return of(false);
      };
      ds.downloadKubernetesFile = falseFunction;
      ds.downloadKubernetesArchive = falseFunction;
      ds.downloadHelmArchive = falseFunction;

      expect(service.dirty).toBeFalsy();
      service.dirty = true;
      expect(service.dirty).toBeTruthy();
    }));

    afterEach(inject([EditorService], (service: EditorService) => {
      const errorArray: string[] = ['Unexpected response from server: failed to download'];
      expect(service.dirty).toBeTruthy();
      expect(service.warningText).toEqual(errorArray);
    }));

    it(`should check when downloadCurrentModel is unSuccessful that it sets warningText and the dirty flag remains true`, inject([EditorService], (service: EditorService) => {
      service.downloadCurrentModel();
    }));
    it(`should check when downloadKubernetes is unSuccessful that it sets warningText and the dirty flag remains true`, inject([EditorService], (service: EditorService) => {
      service.downloadKubernetes();
    }));
    it(`should check when downloadKubernetesArchive is unSuccessful that it sets warningText and the dirty flag remains true`, inject([EditorService], (service: EditorService) => {
      service.downloadKubernetesArchive();
    }));
    it(`should check when downloadHelm is unSuccessful that it sets warningText and the dirty flag remains true`, inject([EditorService], (service: EditorService) => {
      service.downloadHelm();
    }));
  });

});
