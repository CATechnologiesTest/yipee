import { CUSTOM_ELEMENTS_SCHEMA, NgZone } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

import { ImportAppModalComponent } from './import-app-modal.component';
import { YipeeFileResponse } from '../../../models/YipeeFileResponse';
import { YipeeFileMetadata } from '../../../models/YipeeFileMetadata';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { ImportAppService } from '../../services/import-app.service';
import { YipeeFileMetadataRaw } from '../../../models/YipeeFileMetadataRaw';
import { EditorService } from '../../../editor/editor.service';
import { EditorEventService } from '../../../editor/editor-event.service';
import { YipeeFileService } from '../../services/yipee-file.service';
import { DownloadService } from '../../services/download.service';

describe('ImportAppModalComponent', () => {
  let component: ImportAppModalComponent;
  let fixture: ComponentFixture<ImportAppModalComponent>;

  // BEGIN MOCK SERVICES

  const yipeeFileRaw1: YipeeFileMetadataRaw = {
    _id: '5551212',
    name: 'fileOne',
    author: 'string',
    username: 'string',
    containers: ['one'],
    downloads: 5,
    likes: 1,
    canvasdata: null,
    revcount: 5,
    ownerorg: 'string',
    fullname: 'string',
    orgname: 'copan02',
    isPrivate: false,
    dateCreated: new Date().toDateString(),
    dateModified: new Date().toDateString(),
    id: '5551212',
    flatFile: {
      appinfo: {
        id: '',
        name: '',
        description: '',
        ui: {},
        readme: ''
      },
      networks: [],
      volumes: [],
      services: [],
      secrets: []
    }
  };
  const yipeeFile1 = new YipeeFileMetadata(yipeeFileRaw1);

  const yipeeFileRaw2: YipeeFileMetadataRaw = {
    _id: 'string2',
    name: 'fileTwo',
    author: 'string',
    username: 'string',
    containers: ['one'],
    downloads: 5,
    likes: 1,
    canvasdata: null,
    revcount: 5,
    ownerorg: 'string',
    fullname: 'string',
    orgname: 'copan02',
    isPrivate: false,
    dateCreated: new Date().toDateString(),
    dateModified: new Date().toDateString(),
    id: 'string2',
    flatFile: []
  };
  const yipeeFile2 = new YipeeFileMetadata(yipeeFileRaw2);

  const yipeeFileRaw3: YipeeFileMetadataRaw = {
    _id: 'string3',
    name: 'fileThree',
    author: 'string',
    username: 'string',
    containers: ['one'],
    downloads: 5,
    likes: 1,
    canvasdata: null,
    revcount: 5,
    ownerorg: 'string',
    fullname: 'string',
    orgname: 'copan02',
    isPrivate: false,
    dateCreated: new Date().toDateString(),
    dateModified: new Date().toDateString(),
    id: 'string3',
    flatFile: []
  };
  const yipeeFile3 = new YipeeFileMetadata(yipeeFileRaw3);

  const mockUserInfo: any = {
    githubUsername: 'copan02',
    avatarURL: 'https://avatars.github-isl-01.ca.com/u/4187?',
    firstName: 'AJ',
    lastName: 'Copley',
    email: 'ca@ca.com',
    phone: '555-555-5555',
    organization: 'String',
    leadSrc: 'Capgemini Architects Webcast',
    activatedOn: '2017-09-19T14:50:51.307374+00:00'
  };

  const mockPermissions: any = {
    userId: 'd2587542-97c9-11e7-b422-73953baaabfc',
    id: 'copan02',
    viewYipeeCatalog: true,
    yipeeTeamMember: false,
    terms: true,
    paidUser: false,
    downloadKubernetesFiles: false
  };

  const yipeeFileResponse: YipeeFileResponse = {
    success: true,
    total: 1,
    data: [yipeeFileRaw1]
  };

  class MockCatalogService {
    constructor() { } // null constructor
    privateApps: any = [yipeeFile1, yipeeFile2, yipeeFile3];
    publicApps: any = [yipeeFile1, yipeeFile2, yipeeFile3];

    getCleanCatalog() {
      return this.publicApps;
    }
  }

  class MockUserService {
    constructor() { } // null constructor
    userInfo: any = mockUserInfo;
    permissions: any = mockPermissions;
  }

  class MockOrgService {
    availableOrgs = [];

    changeCurrentOrgSubscription(id): Observable<boolean> {
      return of(true);
    }
  }

  // END MOCK SERVICES

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportAppModalComponent],
      imports: [
        HttpModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      providers: [
        ImportAppService,
        EditorService,
        EditorEventService,
        YipeeFileService,
        DownloadService,
        ApiService,
        { provide: UserService, useClass: MockUserService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAppModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.importApplicationForm.valid).toBeFalsy();
  });

  it('create application should finish successfully when the form has a valid application name, clear the form, and close the modal', async(inject([EditorService, HttpTestingController],
    (service: EditorService, backend: HttpTestingController) => {
      const applicationName = component.importApplicationForm.controls['applicationName'];
      applicationName.setValue('GoodNameTest');
      component.importApplicationForm.controls['applicationName'].markAsDirty();
      expect(component.importApplicationForm.controls['applicationName'].dirty).toBeTruthy();
      component.onCreate.subscribe(value => {
      });
      component.importApplication(true, false, yipeeFileRaw1);

      backend.expectOne({ method: 'POST', url: '/api/import' }).flush({
        success: true,
        total: 1,
        data: [yipeeFileRaw1]
      });

      expect(component.show).toBeFalsy();
    })));

  it('cancel application should finish successfully by clearing the form, and closing the modal', () => {
    component.importApplicationForm.controls['applicationName'].setValue('hello');
    component.importApplicationForm.controls['applicationName'].markAsDirty();
    expect(component.importApplicationForm.controls['applicationName'].dirty).toBeTruthy();
    component.onCancel.subscribe(value => {
      expect(value).toBeFalsy();
    });
    component.cancelImportApp();
    expect(component.show).toBeFalsy();
  });

  // Begin form validation tests
  it('applicationName field validity should be falsy when empty', () => {
    const applicationName = component.importApplicationForm.controls['applicationName'];
    expect(applicationName.valid).toBeFalsy();
  });

  it('applicationName field validity error required should be truthy when empty', () => {
    let errors = {};
    const applicationName = component.importApplicationForm.controls['applicationName'];
    errors = applicationName.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('applicationName field validity error max length should be truthy when name is 65 characters long', () => {
    let errors = {};
    const applicationName = component.importApplicationForm.controls['applicationName'];
    applicationName.setValue('asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfa');
    errors = applicationName.errors || {};
    expect(errors['maxlength']).toBeTruthy();
  });

  it('applicationName field validity error max length should be falsy when name is 64 characters long', () => {
    let errors = {};
    const applicationName = component.importApplicationForm.controls['applicationName'];
    applicationName.setValue('asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf');
    errors = applicationName.errors || {};
    expect(errors['maxlength']).toBeFalsy();
  });

  it('applicationName field validity error alphaNumeric should be falsy when name only contains letters, numbers, "_", and "-"', () => {
    let errors = {};
    const applicationName = component.importApplicationForm.controls['applicationName'];
    applicationName.setValue('Aa1_-');
    errors = applicationName.errors || {};
    expect(errors['alphaNumeric']).toBeFalsy();
  });

  it('applicationName field validity error alphaNumeric should be truthy when name contains characters besides: letters, numbers, "_", and "-"', () => {
    let errors = {};
    const applicationName = component.importApplicationForm.controls['applicationName'];
    applicationName.setValue('Aa1_-:');
    errors = applicationName.errors || {};
    expect(errors['alphaNumeric']).toBeTruthy();
  });

  it('applicationName field validity error firstCharAlphaNumeric should be falsy when first character is a letter', () => {
    let errors = {};
    const applicationName = component.importApplicationForm.controls['applicationName'];
    applicationName.setValue('Aa1_-');
    errors = applicationName.errors || {};
    expect(errors['firstCharAlphaNumeric']).toBeFalsy();
  });

  it('applicationName field validity error firstCharAlphaNumeric should be falsy when first character is a number', () => {
    let errors = {};
    const applicationName = component.importApplicationForm.controls['applicationName'];
    applicationName.setValue('5Aa1_-');
    errors = applicationName.errors || {};
    expect(errors['firstCharAlphaNumeric']).toBeFalsy();
  });

  it('applicationName field validity error firstCharAlphaNumeric should be truthy when first character is not alphaNumeric', () => {
    let errors = {};
    const applicationName = component.importApplicationForm.controls['applicationName'];
    applicationName.setValue(':Aa1_-');
    errors = applicationName.errors || {};
    expect(errors['firstCharAlphaNumeric']).toBeTruthy();
  });

  it('applicationName field validity error firstCharAlphaNumeric should be falsy when applicationName is null', () => {
    let errors = {};
    const applicationName = component.importApplicationForm.controls['applicationName'];
    errors = applicationName.errors || {};
    expect(errors['firstCharAlphaNumeric']).toBeFalsy();
  });

  it('should handle invalid model error, where 400 is returned', async(inject([EditorService, HttpTestingController],
    (service: EditorService, backend: HttpTestingController) => {
      fixture.detectChanges();
      component.importApplication(true, false, yipeeFileRaw1);

      backend.expectOne({ method: 'POST', url: '/api/import' }).flush({
        success: false,
        total: 1,
        data: ['test error']
      }, { status: 400, statusText: 'badDev' });

      expect(component.alertText).toEqual(['test error']);
    })));

  it('should handle invalid model error, where 200 is returned', async(inject([EditorService, HttpTestingController],
    (service: EditorService, backend: HttpTestingController) => {
      fixture.detectChanges();
      component.importApplication(true, false, yipeeFileRaw1);

      backend.expectOne({ method: 'POST', url: '/api/import' }).flush({
        success: false,
        total: 1,
        data: ['test error']
      });

      expect(component.alertText).toEqual(['test error']);
    })));

  it('should handle a network error', async(inject([EditorService, HttpTestingController, NgZone],
    (service: EditorService, backend: HttpTestingController, ngZone: NgZone) => {
      fixture.detectChanges();

      component.importApplication(true, false, yipeeFileRaw1);

      const err = 'bad req';
      backend.expectOne({ method: 'POST', url: '/api/import' })
        .flush({
          success: false,
          total: 0,
          data: [err]
        },
          {
            status: 500, statusText: 'badDev'
          });

      expect(component.error).toBeTruthy();
    })));

});
