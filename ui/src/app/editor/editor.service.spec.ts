import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

import { EditorEventService } from './editor-event.service';
import { EditorService } from './editor.service';
import { YipeeFileService } from '../shared/services/yipee-file.service';
import { YipeeFileMetadata } from '../models/YipeeFileMetadata';
import { DownloadService } from '../shared/services/download.service';
import { ApiService } from '../shared/services/api.service';

const yipeeMetadata1: YipeeFileMetadata = YipeeFileService.newTestYipeeFileMetadata('doggy');

class MockOrgService {
  constructor() { }
  userIsWriter(): boolean {
    return true;
  }
}

class MockDownloadService {
  constructor() { }
}

class MockApiService {
  constructor() { }
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

describe('EditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        EditorEventService,
        EditorService,
        { provide: ApiService, useClass: MockApiService },
        { provide: DownloadService, useClass: MockDownloadService },
        { provide: YipeeFileService, useClass: MockYipeeFileService }
      ]
    });
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

});
