import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Router } from '@angular/router';


import { AuthResponse } from '../../models/AuthResponse';
import { LogoutResponse } from '../../models/LogoutResponse';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

describe('AuthService', () => {

  const githubCode = '45454545';
  const githubClientId = '398c8dba-97c1-11e7-9967-f753811b2bc4';
  const githubHost = 'github-isl-01.ca.com';

  const loginResponse: AuthResponse = {
    authenticated: true,
    githubUsername: 'copan02',
    registered: true
  };

  class MockApiService {
    constructor() { }

    getLoginStatus(): Observable<boolean> {
      return Observable.of(true);
    }

    loginToYipee(value: string): Observable<AuthResponse> {
      const response1: AuthResponse = {
        authenticated: true,
        githubUsername: 'copan02',
        registered: true
      };
      return Observable.of(response1);
    }

    logoutOfYipee(): Observable<LogoutResponse> {
      const response1: LogoutResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        type: 2,
        url: 'http://localhost:8080/',
      };
      return Observable.of(response1);
    }

    getGithubClientID(): Observable<string> {
      const response1 = '398c8dba-97c1-11e7-9967-f753811b2bc4';
      return Observable.of(response1);
    }

    getGitHubClientHost(): Observable<string> {
      const response1 = 'github-isl-01.ca.com';
      return Observable.of(response1);
    }

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpModule],
      providers: [
        { provide: ApiService, useClass: MockApiService },
        AuthService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
      ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  it('should return if an existing session exists', inject([ApiService, AuthService], (service: MockApiService, authService: AuthService) => {
    return authService.checkForAnExistingSession().subscribe(data => {
      expect(data).toEqual(true);
      expect(authService.isAuthenticated).toEqual(true);
    });
  }));

  it('should login to the yipee app', inject([ApiService, AuthService], (service: MockApiService, authService: AuthService) => {
    return authService.loginToYipee(githubCode).subscribe(data => {
      expect(data).toEqual(loginResponse);
      expect(authService.isAuthenticated).toEqual(data.authenticated);
    });
  }));

  it('should logout of the yipee app', inject([ApiService, AuthService, Router], (service: MockApiService, authService: AuthService, router) => {
    spyOn(router, 'navigate');
    authService.logout();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should load github client ID', inject([ApiService, AuthService], (service: MockApiService, authService: AuthService) => {
    authService.loadGithubClientID();
    expect(authService.githubClientId).toEqual(githubClientId);
  }));

  it('should load github host', inject([ApiService, AuthService], (service: MockApiService, authService: AuthService) => {
    authService.loadGithubHost();
    expect(authService.githubHost).toEqual(githubHost);
  }));

});
