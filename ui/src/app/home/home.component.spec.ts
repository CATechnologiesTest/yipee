import { HomeComponent } from './home.component';
import { ComponentFixture, async, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { NamespaceService } from '../shared/services/namespace.service';
import { ApiService } from '../shared/services/api.service';
import { DownloadService } from '../shared/services/download.service';
import { UpdateService } from '../shared/services/update.service';
import { YipeeFileService } from '../shared/services/yipee-file.service';
import { UserService } from '../shared/services/user.service';

const response1 = {
  success: true,
  total: 1,
  data: [{ YIPEE_INSTALL_TYPE: 'cluster' }]
};

const namespaceObject = {
  name: 'namespace'
};

const deleteNamespaceResponseSuccess = {
  success: true,
  total: 1,
  data: ['namespace delete initiated successfully']
};

const deleteNamespaceResponseFailure = {
  success: true,
  total: 1,
  data: ['namespace delete unsuccessfull']
};

const deleteNamespaceResponseNetworkFailure = {
  success: false,
  total: 1,
  data: ['network error']
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],

      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        NamespaceService,
        ApiService,
        DownloadService,
        UpdateService,
        YipeeFileService,
        UserService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    component.route.snapshot.data = { isLive: { value: true } };
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it('should be created and on destroy the timer should be cleaned up', fakeAsync(inject([HttpTestingController],
    (backend: HttpTestingController) => {

      fixture.detectChanges();
      expect(component).toBeTruthy();
      backend.expectOne('/api/namespaces').flush({
        success: false,
        total: 1,
        data: [{ name: 'foo' }]
      });
      fixture.destroy();

    }
  )));

  it('should return success when deleteNamespace() is called with a valid namespace and deleteNamespaceError should be blank', async(inject([HttpTestingController], (backend: HttpTestingController) => {
    expect(component.deleteNamespaceError).toEqual('');
    component.onDelete(namespaceObject);
    backend.expectOne('/api/namespaces/namespace')
      .flush({
        success: true,
        total: 1,
        data: ['namespace delete initiated successfully']
      }, { status: 200, statusText: 'badDev' }
      );
      expect(component.deleteNamespaceError).toEqual('');
  })));

  it('should return network error when deleteNamespace() is called with an invalid namespace and deleteNamespaceError should be set to the error', async(inject([HttpTestingController], (backend: HttpTestingController) => {
    expect(component.deleteNamespaceError).toEqual('');
    component.onDelete(namespaceObject);
    backend.expectOne('/api/namespaces/namespace')
      .flush({
        success: false,
        total: 1,
        data: ['network error']
      }, {
        status: 500, statusText: 'badDev'
        });
    expect(component.deleteNamespaceError).toEqual('network error');
  })));

  it('should return error when deleteNamespace() is called and returns an error and deleteNamespaceError should be set to the error', async(inject([HttpTestingController], (backend: HttpTestingController) => {
    expect(component.deleteNamespaceError).toEqual('');
    component.onDelete(namespaceObject);
    backend.expectOne('/api/namespaces/namespace')
      .flush({
        success: false,
        total: 1,
        data: ['namespace delete unsuccessfull']
      }, {
        status: 200, statusText: 'badDev'
        });
    expect(component.deleteNamespaceError).toEqual('namespace delete unsuccessfull');
  })));

  it('should clear deleteNamespaceError variable when onDeleteNamespaceErrorClose() is called', () => {
    component.deleteNamespaceError = 'error';
    expect(component.deleteNamespaceError).toEqual('error');
    component.onDeleteNamespaceErrorClose();
    expect(component.deleteNamespaceError).toEqual('');
  });

});
