import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { tick, async, fakeAsync, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { UserService } from '../../shared/services/user.service';
import { FeatureService } from '../../shared/services/feature.service';
import { EditorService } from '../../editor/editor.service';


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

class MockEditorService {
  constructor() { }
  dirty: boolean;
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let location: Location;

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
        { provide: EditorService, useClass: MockEditorService },
        { provide: UserService, useClass: MockUserService },
        { provide: FeatureService, useClass: MockFeatureService }
      ]
    })
      .compileComponents();
      location = TestBed.get(Location);
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

  it('should set dirty flag and route to home when onClose is called with the true boolean', fakeAsync(inject([EditorService], (service: MockEditorService) => {
    expect(component).toBeTruthy();
    expect(location.path() === '').toBeTruthy();
    service.dirty = true;
    component.onClose(true);
    tick(500);
    expect(service.dirty).toBeFalsy();
    expect(component.showWarningModal).toBeFalsy();
    expect(location.path()).toBe('/');
  })));

  it('should set showWarningModal to true when onClose is called with EditorService dirty flag set to true', inject([EditorService], (service: MockEditorService) => {
    expect(component.showWarningModal).toEqual(false);
    service.dirty = true;
    component.onClose();
    expect(component.showWarningModal).toEqual(true);
  }));

  it('should call router.navigate home when onClose is called with EditorService dirty flag set to false', fakeAsync(inject([EditorService], (service: MockEditorService) => {
    expect(location.path() === '').toBeTruthy();
    expect(component.showWarningModal).toEqual(false);
    expect(service.dirty).toBeFalsy();
    service.dirty = false;
    component.onClose();
    tick(500);
    expect(location.path()).toBe('/');
  })));

});
