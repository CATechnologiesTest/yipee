import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { UserInfoResponse } from '../../models/UserInfo';
import { UserService } from './user.service';
import { ApiService } from './api.service';

describe('UserService', () => {

  const userInfoResponse: UserInfoResponse = {
    loggedIn: true,
    userInfo: {
      githubUsername: 'copan02',
      avatarURL: 'https://avatars.github-isl-01.ca.com/u/4187?',
      activatedOn: '2017-09-19T14:50:51.307374+00:00'
    },
    permissions: {
      userId: 'd2587542-97c9-11e7-b422-73953baaabfc',
      id: 'copan02',
      viewYipeeCatalog: true,
      yipeeTeamMember: false,
      terms: true,
      paidUser: false,
      downloadKubernetesFiles: false
    }
  };

  class MockApiService {
    constructor() { }

    getUserInfo(): Observable<UserInfoResponse> {
      const response1: UserInfoResponse = {
        loggedIn: true,
        userInfo: {
          githubUsername: 'copan02',
          avatarURL: 'https://avatars.github-isl-01.ca.com/u/4187?',
          activatedOn: '2017-09-19T14:50:51.307374+00:00'
        },
        permissions: {
          userId: 'd2587542-97c9-11e7-b422-73953baaabfc',
          id: 'copan02',
          viewYipeeCatalog: true,
          yipeeTeamMember: false,
          terms: true,
          paidUser: false,
          downloadKubernetesFiles: false
        }
      };
      return Observable.of(response1);
    }

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        UserService,
        {provide: ApiService, useClass: MockApiService }
      ]
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('should refresh userInfo and permissions', inject([ApiService, UserService], (service: MockApiService, userService: UserService) => {
    userService.refreshUserInfo().subscribe( data => {
      expect(userService.permissions).toEqual(userInfoResponse.permissions);
      expect(userService.userInfo).toEqual(userInfoResponse.userInfo);
    });
  }));

});
