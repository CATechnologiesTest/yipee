import { NO_ERRORS_SCHEMA, NgZone } from '@angular/core';
import { tick, fakeAsync, async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';

import { EditorComponent } from './editor.component';

import { EditorService } from './editor.service';
import { YipeeFileService } from '../shared/services/yipee-file.service';
import { YipeeFileMetadata } from '../models/YipeeFileMetadata';
import { DownloadService } from '../shared/services/download.service';
import { EditorEventService } from './editor-event.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { UserService } from '../shared/services/user.service';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let location: Location;

  class MockDownloadService {
    constructor() { }
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
        UserService,
        EditorEventService,
        YipeeFileService,
        ApiService,
        { provide: DownloadService, useClass: MockDownloadService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        EditorService
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
    // Since we are using the real editor service, we need to initialize the metadata
    component.editorService.metadata = new YipeeFileMetadata();

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load model from URL', async(inject([ActivatedRoute, HttpTestingController],
    (ar: MockActivatedRoute, backend: HttpTestingController) => {
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

  it('should handle invalid model error, where 200 is returned', async(inject([EditorService, ActivatedRoute, HttpTestingController],
    (service: EditorService, ar: MockActivatedRoute, backend: HttpTestingController) => {
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
    (service: EditorService, ar: MockActivatedRoute, backend: HttpTestingController) => {
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
    (service: EditorService, ar: MockActivatedRoute, backend: HttpTestingController, ngZone: NgZone) => {
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

    it('should set dirty flag and route to home when exitEditor is called with disregardChanges set to true', fakeAsync(inject([EditorService, NgZone], (service: EditorService, ngZone: NgZone) => {
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

    it('should set showWarningModal to true when exitEditor is called with EditorService dirty flag set to true', fakeAsync(inject([EditorService, NgZone], (service: EditorService, ngZone: NgZone) => {
      expect(component.showWarningModal).toEqual(false);
      service.dirty = true;
      ngZone.run(() => component.canDeactivate());
      expect(component.showWarningModal).toEqual(true);
    })));

    it('should call router.navigate home when exitEditor is called with EditorService dirty flag set to false', fakeAsync(inject([EditorService, NgZone], (service: EditorService, ngZone: NgZone) => {
      expect(location.path() === '').toBeTruthy();
      expect(component.showWarningModal).toEqual(false);
      expect(service.dirty).toBeFalsy();
      ngZone.run(() => component.exitEditor());
      tick(500);
      expect(location.path()).toBe('/');
    })));

    it('should handle a successful apply', fakeAsync(inject([HttpTestingController, EditorService], (backend: HttpTestingController, service: EditorService) => {
      const ns = 'foo';
      service.metadata = new YipeeFileMetadata();
      service.metadata.name = ns;
      service.metadata.flatFile.appInfo.namespace = ns;
      expect(component.editorService.infoText.length).toBe(0);
      component.onApplyManifestClicked();

      backend.expectOne({method: 'POST', url: '/api/namespaces/apply/' + ns + '?createNamespace=true' })
        .flush({success: true, total: 1, data: ['applied successfully']});
      tick(50);
      expect(component.editorService.infoText.length).toBe(1);
    })));

    it('should handle an error from a namespace apply', fakeAsync(inject([HttpTestingController, EditorService], (backend: HttpTestingController, service: EditorService) => {

      const ns = 'foo';
      const err = 'bad apply';
      service.metadata = new YipeeFileMetadata();
      service.metadata.name = ns;
      service.metadata.flatFile.appInfo.namespace = ns;
      component.onApplyManifestClicked();
      expect(component.editorService.warningText.length).toBe(0);
      backend.expectOne({method: 'POST', url: '/api/namespaces/apply/' + ns + '?createNamespace=true'})
        .flush({success: false, total: 0, data: [err]}, {status: 500, statusText: 'badDev'});
      tick(50);
      expect(component.editorService.warningText.length).toBe(2);
      expect(component.editorService.warningText[1]).toBe(err);
    })));

    it('should handle an network error from a namespace apply',
      fakeAsync(
        inject([HttpTestingController],
          (backend: HttpTestingController) => {
      const ns = 'foo';
      const md = new YipeeFileMetadata();
      md.name = ns;
      md.flatFile.appInfo.namespace = ns;

      component.editorService.metadata = md;

      component.onApplyManifestClicked();

      expect(component.editorService.warningText.length).toBe(0);
      backend.expectOne({method: 'POST', url: '/api/namespaces/apply/' + ns + '?createNamespace=true'})
         .error(new ErrorEvent('Network issue'));
      tick(50);
      expect(component.editorService.warningText.length).toBe(2);
    })));

    it('should throw an error if namespace is empty', fakeAsync(inject([HttpTestingController, EditorService], (backend: HttpTestingController, service: EditorService) => {
      const ns = 'namespace';
      service.metadata = new YipeeFileMetadata();
      service.metadata.name = ns;

      expect(component.editorService.warningText.length).toBe(0);
      component.onApplyManifestClicked();
      tick(50);
      expect(component.editorService.warningText.length).toBe(2);
      expect(component.editorService.warningText[1]).toBe(ApiService.MISSING_NAMESPACE);

    })));



});
