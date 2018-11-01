import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { NewAppModalComponent } from './new-app-modal.component';
import { YipeeFileResponse } from '../../../models/YipeeFileResponse';
import { YipeeFileMetadata } from '../../../models/YipeeFileMetadata';
import { YipeeFileMetadataRaw } from '../../../models/YipeeFileMetadataRaw';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { YipeeFileService } from '../../services/yipee-file.service';
import { FeatureService } from '../../services/feature.service';
import { EditorService } from '../../../editor/editor.service';
import { EditorEventService } from '../../../editor/editor-event.service';
import { DownloadService } from '../../services/download.service';

describe('NewAppModalComponent', () => {
  let component: NewAppModalComponent;
  let fixture: ComponentFixture<NewAppModalComponent>;

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
    hasLogo: false,
    flatFile: []
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
    hasLogo: false,
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
    hasLogo: false,
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

  class MockApiService {
    constructor() { }

    newApp(metadata: YipeeFileMetadata): Observable<YipeeFileResponse> {
      return Observable.of(yipeeFileResponse);
    }

  }

  class MockFeatureService {
    constructor() { }

    names: string[] = [];
  }

  class MockOrgService {
    availableOrgs = [];

    changeCurrentOrgSubscription(id): Observable<boolean> {
      return Observable.of(true);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAppModalComponent ],
      imports: [
        HttpModule,
        ReactiveFormsModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      providers: [
        YipeeFileService,
        EditorService,
        EditorEventService,
        DownloadService,
        {provide: UserService, useClass: MockUserService},
        {provide: ApiService, useClass: MockApiService},
        {provide: FeatureService, useClass: MockFeatureService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAppModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.newApplicationForm.valid).toBeFalsy();
  });

  it('create application should finish successfully when the form has a valid application name, clear the form, and close the modal', () => {
     const applicationName = component.newApplicationForm.controls['applicationName'];
     applicationName.setValue('GoodNameTest');
     component.newApplicationForm.controls['applicationName'].markAsDirty();
     expect(component.newApplicationForm.controls['applicationName'].dirty).toBeTruthy();
     component.onCreate.subscribe(value => {
     });
     component.createNewApp(applicationName);
     expect(component.newApplicationForm.controls['applicationName'].pristine).toBeTruthy();
     expect(component.show).toBeFalsy();
  });

  it('cancel application should finish successfully by clearing the form, and closing the modal', () => {
    component.newApplicationForm.controls['applicationName'].setValue('hello');
    component.newApplicationForm.controls['applicationName'].markAsDirty();
    expect(component.newApplicationForm.controls['applicationName'].dirty).toBeTruthy();
    component.onCancel.subscribe(value => {
      expect(value).toBeFalsy();
    });
    component.cancelNewApp();
    expect(component.newApplicationForm.controls['applicationName'].pristine).toBeTruthy();
    expect(component.show).toBeFalsy();
  });

  // Begin form validation tests
  it('applicationName field validity should be falsy when empty', () => {
    const applicationName = component.newApplicationForm.controls['applicationName'];
    expect(applicationName.valid).toBeFalsy();
  });

  it('applicationName field validity error required should be truthy when empty', () => {
    let errors = {};
    const applicationName = component.newApplicationForm.controls['applicationName'];
    errors = applicationName.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('applicationName field validity error max length should be truthy when name is 65 characters long', () => {
    let errors = {};
    const applicationName = component.newApplicationForm.controls['applicationName'];
    applicationName.setValue('asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfa');
    errors = applicationName.errors || {};
    expect(errors['maxlength']).toBeTruthy();
  });

  it('applicationName field validity error max length should be falsy when name is 64 characters long', () => {
    let errors = {};
    const applicationName = component.newApplicationForm.controls['applicationName'];
    applicationName.setValue('asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf');
    errors = applicationName.errors || {};
    expect(errors['maxlength']).toBeFalsy();
  });

  it('applicationName field validity error alphaNumeric should be falsy when name only contains letters, numbers, "_", and "-"', () => {
    let errors = {};
    const applicationName = component.newApplicationForm.controls['applicationName'];
    applicationName.setValue('Aa1_-');
    errors = applicationName.errors || {};
    expect(errors['alphaNumeric']).toBeFalsy();
  });

  it('applicationName field validity error alphaNumeric should be truthy when name contains characters besides: letters, numbers, "_", and "-"', () => {
    let errors = {};
    const applicationName = component.newApplicationForm.controls['applicationName'];
    applicationName.setValue('Aa1_-:');
    errors = applicationName.errors || {};
    expect(errors['alphaNumeric']).toBeTruthy();
  });

  it('applicationName field validity error firstCharAlphaNumeric should be falsy when first character is a letter', () => {
    let errors = {};
    const applicationName = component.newApplicationForm.controls['applicationName'];
    applicationName.setValue('Aa1_-');
    errors = applicationName.errors || {};
    expect(errors['firstCharAlphaNumeric']).toBeFalsy();
  });

  it('applicationName field validity error firstCharAlphaNumeric should be falsy when first character is a number', () => {
    let errors = {};
    const applicationName = component.newApplicationForm.controls['applicationName'];
    applicationName.setValue('5Aa1_-');
    errors = applicationName.errors || {};
    expect(errors['firstCharAlphaNumeric']).toBeFalsy();
  });

  it('applicationName field validity error firstCharAlphaNumeric should be truthy when first character is not alphaNumeric', () => {
    let errors = {};
    const applicationName = component.newApplicationForm.controls['applicationName'];
    applicationName.setValue(':Aa1_-');
    errors = applicationName.errors || {};
    expect(errors['firstCharAlphaNumeric']).toBeTruthy();
  });

  it('applicationName field validity error firstCharAlphaNumeric should be falsy when applicationName is null', () => {
    let errors = {};
    const applicationName = component.newApplicationForm.controls['applicationName'];
    errors = applicationName.errors || {};
    expect(errors['firstCharAlphaNumeric']).toBeFalsy();
  });
  // End form validation tests
});
