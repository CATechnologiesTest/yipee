import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { FeatureService } from '../../shared/services/feature.service';

let logoutCalled = false;

class MockAuthService {
  constructor() { }
  logout() {
    logoutCalled = true;
  }
}

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

class MockUserService {
  constructor() { }
  userInfo: any = mockUserInfo;
  permissions: any = mockPermissions;
}

class MockFeatureService {
  constructor() { }
  names: Array<string> = [];
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        RouterTestingModule
      ],
      declarations: [
        HeaderComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: FeatureService, useClass: MockFeatureService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit show settings dialog', () => {
    expect(component).toBeTruthy();
    component.showSettingsDialog.subscribe(value => {
      expect(value).toBeTruthy();
    });
    component.onShowSettingsDialog();
  });

});
