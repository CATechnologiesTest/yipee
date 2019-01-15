import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { NamespaceDiffModalComponent } from './namespace-diff-modal.component';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NamespaceService } from '../../services/namespace.service';

class MockNamespaceService {
  constructor() { }
  currentNamespaces = [];
}

describe('NamespaceDiffModalComponent', () => {
  let component: NamespaceDiffModalComponent;
  let fixture: ComponentFixture<NamespaceDiffModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NamespaceDiffModalComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        ApiService,
        FormBuilder,
        { provide: NamespaceService, useClass: MockNamespaceService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamespaceDiffModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a successful diff', async(inject([HttpTestingController], (backend: HttpTestingController) => {
    component.parentNamespace = 'foo';
    component.childNamespace = 'bar';
    component.compare();
    backend.expectOne('/api/namespaces/diff').flush({
      success: true,
      total: 1,
      data: ['foo, bar']
    });
    expect(component.diffResults).toEqual('foo, bar');
  })));

  it('should return an unsuccessful diff', async(inject([HttpTestingController], (backend: HttpTestingController) => {
    component.parentNamespace = 'foo';
    component.diffForm.controls.childNamespace.setValue('bar');
    component.diffForm.controls.childNamespace.markAsDirty();
    const err = 'Bad yaml';
    component.compare();
    backend.expectOne({ method: 'POST', url: '/api/namespaces/diff' })
      .flush({
        success: false,
        total: 0,
        data: [err]
      },
        {
          status: 200, statusText: 'badyaml'
        });
    expect(component.diffResults).toEqual(NamespaceDiffModalComponent.ERROR_MSG + err);
  })));

  it('should handle a network error', async(inject([HttpTestingController], (backend: HttpTestingController) => {
    component.parentNamespace = 'foo';
    component.childNamespace = null;
    const err = 'bad child namespace';
    component.compare();
    backend.expectOne({ method: 'POST', url: '/api/namespaces/diff' })
      .flush({
        success: false,
        total: 0,
        data: [err]
      },
        {
          status: 500, statusText: 'badDev'
        });
    expect(component.diffResults).toEqual(NamespaceDiffModalComponent.ERROR_MSG + err);

  })));

  it('should emit a string of closeNamespaceDiff, clear diffResults, and set showDiffResults to false, when component close() function is called', () => {
    component.onClose.subscribe((value: string) => {
      expect(component.diffResults).toEqual('');
      expect(component.showDiffResults).toBeFalsy();
      expect(value).toBeDefined();
      expect(value).toEqual('closeNamespaceDiff');
    });
    component.close();
  });

});
