import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';

import { K8sInfoContainerComponent } from './k8s-info-container.component';
import { EditorService } from '../../../editor.service';
import { EditorEventService } from '../../../editor-event.service';
import { YipeeFileMetadata } from '../../../../models/YipeeFileMetadata';
import { YipeeFileMetadataRaw } from '../../../../models/YipeeFileMetadataRaw';
import { UserService } from '../../../../shared/services/user.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('K8sInfoContainerComponent (k8sFile.appInfo)', () => {
  let component: K8sInfoContainerComponent;
  let fixture: ComponentFixture<K8sInfoContainerComponent>;

  const yipeeFileRaw1: YipeeFileMetadataRaw = {
    _id: '5551212',
    name: 'fileOne',
    namespace: 'namespace1',
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
    uiFile: {
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
    },
    flatFile: []
  };
  const yipeeFile1 = new YipeeFileMetadata(yipeeFileRaw1);

  const yipeeFileRaw2: YipeeFileMetadataRaw = {
    _id: 'string2',
    name: 'fileTwo',
    namespace: 'namespace2',
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
    namespace: 'namespace3',
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

  class MockEditorService {
    // i didnt type this cus that would mean we would have to add a bunch of mock parser stuff that doesnt relate to this component
    k8sFile = {
      appInfo: {
        name: 'appName',
        namespace: 'namespace',
        description: 'app descriptionn',
        model_id: 'sdfsdfsdfsdfsdfsfsdfsdfsdf',
        readme: 'appp readme',
      },
      secrets: [],
      secret_volumes: [],
      k8s_secret_volumes: [],
      configs: []
    };

    reportInvalidForm(sericeId, isInavalid) {
      // null
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        EditorEventService,
        FormBuilder,
        { provide: EditorService, useClass: MockEditorService },
        { provide: UserService, useClass: MockUserService }
      ],
      declarations: [ K8sInfoContainerComponent ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach( inject([EditorService], (editorService: EditorService) => {
    fixture = TestBed.createComponent(K8sInfoContainerComponent);
    component = fixture.componentInstance;
    component.k8sFile = editorService.k8sFile;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // appInfo.name
  it(`name should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
    expect(editorService.k8sFile.appInfo.name).toEqual('appName');
    expect(component.form.value.name).toEqual('appName');
  }));
  it(`name should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
    component.form.get('name').setValue('new app name');
    expect(editorService.k8sFile.appInfo.name).toEqual('new app name');
  }));

  // appInfo.description
  it(`description should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
    expect(editorService.k8sFile.appInfo.description).toEqual('app descriptionn');
    expect(component.form.value.description).toEqual('app descriptionn');
  }));
  it(`description should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
    component.form.get('description').setValue('new app description');
    expect(editorService.k8sFile.appInfo.description).toEqual('new app description');
  }));

  // appInfo.id
  it(`id should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
    expect(editorService.k8sFile.appInfo.model_id).toEqual('sdfsdfsdfsdfsdfsfsdfsdfsdf');
    expect(component.form.controls.id.value).toEqual('sdfsdfsdfsdfsdfsfsdfsdfsdf');
  }));

  // appInfo.readme
  it(`readme should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
    expect(editorService.k8sFile.appInfo.readme).toEqual('appp readme');
    expect(component.form.value.readme).toEqual('appp readme');
  }));
  it(`readme should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
    component.form.get('readme').setValue('new app readme');
    expect(editorService.k8sFile.appInfo.readme).toEqual('new app readme');
  }));

});
