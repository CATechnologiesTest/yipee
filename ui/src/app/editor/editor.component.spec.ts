import { NO_ERRORS_SCHEMA, NgZone } from '@angular/core';
import { tick, fakeAsync, async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

import { EditorComponent } from './editor.component';

import { EditorService } from './editor.service';
import { YipeeFileService } from '../shared/services/yipee-file.service';
import { YipeeFileMetadata } from '../models/YipeeFileMetadata';
import { YipeeFileMetadataRaw } from '../models/YipeeFileMetadataRaw';
import { YipeeFileResponse, YipeeFileErrorResponse } from '../models/YipeeFileResponse';
import { DownloadService } from '../shared/services/download.service';
import { EditorEventService, SelectionChangedEvent, EventSource } from './editor-event.service';
import { EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../shared/services/api.service';

import { Subject } from 'rxjs/Subject';
import { UserService } from '../shared/services/user.service';
import { FeatureService } from '../shared/services/feature.service';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let location: Location;

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
    static BAD_MODEL = 'bad_model';
    static CALL_ERROR = '404 error';
    static BAD_MODEL_ERROR = 'Missing or invalid model';

    constructor() { }
    }

    class MockEditorService {
    yipeeFileID: string;
    metadata: YipeeFileMetadata;
    fatalText: string[] = [];
    alertText: string[] = [];
    warningText: string[] = [];
    infoText: string[] = [];
    invalidKeys: string[];
    lastYipeeId: string;
    dirty: boolean;

    constructor() {
      this.invalidKeys = [];
      this.metadata = new YipeeFileMetadata();
      this.dirty = false;
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
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        FeatureService,
        UserService,
        EditorEventService,
        YipeeFileService,
        ApiService,
        { provide: DownloadService, useClass: MockDownloadService },
        { provide: EditorService, useClass: MockEditorService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    })
      .compileComponents();
      location = TestBed.get(Location);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
  });


  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load model from URL', async(inject([EditorService, ApiService, ActivatedRoute, HttpTestingController],
    (service: MockEditorService, apiService: ApiService, ar: MockActivatedRoute, backend: HttpTestingController) => {
      ar.addId('foo');
      expect(component.ui.loading).toBeTruthy();
      fixture.detectChanges();
      backend.expectOne('/api/import/foo').flush({
        success: true,
        total: 1,
        data: [{
          name: 'App Name',
          _id: '1010',
          author: '',
          username: ''
        }]
      });
      expect(component.ui.loading).toBeFalsy();
    })));

  it('should handle invalid model error, where 200 is returned', async(inject([EditorService, ApiService, ActivatedRoute, HttpTestingController],
    (service: MockEditorService, apiService: ApiService, ar: MockActivatedRoute, backend: HttpTestingController) => {
      ar.addId(MockApiService.BAD_MODEL);
      expect(component.ui.loading).toBeTruthy();
      fixture.detectChanges();
      backend.expectOne('/api/import/' + MockApiService.BAD_MODEL).flush({
        success: false,
        total: 1,
        data: [MockApiService.BAD_MODEL_ERROR]
      });
      expect(component.ui.loading).toBeFalsy();
      expect(component.ui.error).toBeTruthy();
      expect(service.fatalText[0]).toBe(EditorService.UNEXPECTED_RESPONSE + MockApiService.BAD_MODEL_ERROR);
    })));

  it('should handle invalid model error, where 4xx is returned', async(inject([EditorService, ActivatedRoute, HttpTestingController],
    (service: MockEditorService, ar: MockActivatedRoute, backend: HttpTestingController) => {
      ar.addId('foo');
      expect(component.ui.loading).toBeTruthy();
      fixture.detectChanges();

      backend.expectOne('/api/import/foo')
        .flush({success: false, total: 1, data: [MockApiService.BAD_MODEL_ERROR]}, {status: 404, statusText: 'Not found'});
      expect(component.ui.loading).toBeFalsy();
      expect(component.ui.error).toBeTruthy();
      expect(service.fatalText[0].indexOf('404') > 0).toBeTruthy('no 404 in the error message');
      expect(service.fatalText[0].indexOf('Not found') > 0).toBeTruthy('Not found - not in the error message');
      })));

  it('should handle a network error', async(inject([EditorService, ActivatedRoute, HttpTestingController, NgZone],
    (service: MockEditorService, ar: MockActivatedRoute, backend: HttpTestingController, ngZone: NgZone) => {
      ar.addId('foo');
      fixture.detectChanges();
      const req = ngZone.run(() => backend.expectOne('/api/import/foo') );
      const emsg = 'simulated network error';

      const mockError = new ErrorEvent('Network error', {
        message: emsg,
      });

      // Respond with mock error
      req.error(mockError);
      expect(component.ui.loading).toBeFalsy();
      expect(component.ui.error).toBeTruthy();
      expect(service.fatalText[0].indexOf(EditorService.UNEXPECTED_RESPONSE) >= 0).toBeTruthy();
    })));

    it('should set dirty flag and route to home when exitEditor is called with disregardChanges set to true', fakeAsync(inject([EditorService, NgZone], (service: MockEditorService, ngZone: NgZone) => {
      expect(component).toBeTruthy();
      expect(location.path() === '').toBeTruthy();
      service.dirty = true;
      component.disregardChanges = true;
      ngZone.run(() => component.canDeactivate());
      expect(service.dirty).toBeFalsy();
      expect(component.showWarningModal).toBeFalsy();
      ngZone.run(() => component.exitEditor());
      tick(500);
      expect(location.path()).toBe('/');
    })));

    it('should set showWarningModal to true when exitEditor is called with EditorService dirty flag set to true', fakeAsync(inject([EditorService, NgZone], (service: MockEditorService, ngZone: NgZone) => {
      expect(component.showWarningModal).toEqual(false);
      service.dirty = true;
      ngZone.run(() => component.canDeactivate());
      expect(component.showWarningModal).toEqual(true);
    })));

    it('should call router.navigate home when exitEditor is called with EditorService dirty flag set to false', fakeAsync(inject([EditorService, NgZone], (service: MockEditorService, ngZone: NgZone) => {
      expect(location.path() === '').toBeTruthy();
      expect(component.showWarningModal).toEqual(false);
      expect(service.dirty).toBeFalsy();
      ngZone.run(() => component.exitEditor());
      tick(500);
      expect(location.path()).toBe('/');
    })));

});
