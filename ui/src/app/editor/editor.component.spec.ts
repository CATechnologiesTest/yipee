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
import { DownloadService } from '../shared/services/download.service';
import { FeatureService } from '../shared/services/feature.service';
import { EditorEventService, SelectionChangedEvent } from './editor-event.service';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';

class MockDownloadService {
  constructor() { }
}

class MockFeatureService {
  constructor() { }
  names: string[] = [];
  refreshFeatures(): Observable<boolean> {
    return of(true);
  }
}

class MockEditorEventService {
  constructor() { }
  onSelectionChange: EventEmitter<SelectionChangedEvent> = new EventEmitter();
}

class MockEditorService {
  yipeeFileID: string;
  metadata: YipeeFileMetadata;
  fatalText: string[] = [];
  alertText: string[] = [];
  infoText: string[] = [];
  invalidKeys: string[];

  constructor() {
    this.invalidKeys = [];
  }
  setYipeeFileID(yipeeFileId: string): Observable<boolean> {
    this.yipeeFileID = yipeeFileId;
    return of(true);
  }
  loadYipeeFile(): Observable<boolean> {
    this.metadata = YipeeFileService.newTestYipeeFileMetadata('test');
    return of(true);
  }
}

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

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
        { provide: FeatureService, useClass: MockFeatureService },
        { provide: EditorService, useClass: MockEditorService },
        { provide: EditorEventService, useClass: MockEditorEventService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should be created', inject([MockEditorService], (service: MockEditorService) => {
    service.loadYipeeFile().subscribe((response) => {
      expect(component).toBeTruthy();
    });
  }));
});
