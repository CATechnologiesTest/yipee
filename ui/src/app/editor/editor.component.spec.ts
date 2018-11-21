import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

import { EditorComponent } from './editor.component';
import { EditorService } from './editor.service';
import { YipeeFileService } from '../shared/services/yipee-file.service';
import { YipeeFileMetadata } from '../models/YipeeFileMetadata';
import { YipeeFileMetadataRaw } from '../models/YipeeFileMetadataRaw';
import { YipeeFileResponse } from '../models/YipeeFileResponse';
import { DownloadService } from '../shared/services/download.service';
import { FeatureService } from '../shared/services/feature.service';
import { EditorEventService, SelectionChangedEvent } from './editor-event.service';
import { EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../shared/services/api.service';

import { Subject } from 'rxjs/Subject';
import { UserService } from '../shared/services/user.service';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  class MockDownloadService {
    constructor() { }
  }
  class MockYipeeFileService {
    constructor() { }
    onSelectionChange: EventEmitter<SelectionChangedEvent> = new EventEmitter();
  }
  class MockActivatedRoute {
    constructor() { }
    snapshot = { params: {} };
    addId(id) {
      this.snapshot.params['id'] = id;
    }
  }
  class MockApiService {
    requestedId: string;
    constructor() { }
    getApp(id) {
      this.requestedId = id;
      const yfmdr: YipeeFileMetadataRaw = {
        name: 'foo',
        _id: id,
        author: '',
        username: ''
      };
      const yfr: YipeeFileResponse = {
        success: true,
        total: 1,
        data: [yfmdr]
      };
      return of(yfr);
    }
  }
  class MockEditorService {
    yipeeFileID: string;
    metadata: YipeeFileMetadata;
    fatalText: string[] = [];
    alertText: string[] = [];
    infoText: string[] = [];
    invalidKeys: string[];
    lastYipeeId: string;

    constructor() {
      this.invalidKeys = [];
      this.metadata = new YipeeFileMetadata();
    }
    setYipeeFileID(yipeeFileId: string): Observable<boolean> {
      this.yipeeFileID = yipeeFileId;
      return of(true);
    }
    loadYipeeFile(id): Observable<boolean> {
      this.lastYipeeId = id;
      this.metadata = YipeeFileService.newTestYipeeFileMetadata('test');
      return of(true);
    }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditorComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ],
      imports: [
        HttpModule,
        RouterTestingModule
      ],
      providers: [
        { provide: DownloadService, useClass: MockDownloadService },
        FeatureService, UserService, EditorEventService, YipeeFileService,
        { provide: EditorService, useClass: MockEditorService },
        { provide: ApiService, useClass: MockApiService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load model from URL', inject([EditorService, ApiService, ActivatedRoute], (service: MockEditorService, apiService: MockApiService, ar: MockActivatedRoute) => {
    ar.addId('foo');
    expect(component.ui.loading).toBeTruthy();
    fixture.detectChanges();
    expect(apiService.requestedId).toBe('foo');
    expect(component.ui.loading).toBeFalsy();
  }));
});
