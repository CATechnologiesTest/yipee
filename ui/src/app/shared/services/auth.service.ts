import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { ApiService } from './api.service';
import { AuthResponse } from '../../models/AuthResponse';

@Injectable()
export class AuthService {
  githubPath = '/login/oauth/authorize';
  githubClientId: string;
  githubHost: string;
  callbackPath = environment.baseHref + '/callback';
  isAuthenticated = false;
  githubUsername: string;

  constructor(private router: Router, private apiService: ApiService) { }

  checkForAnExistingSession(): Observable<boolean> {
    return this.apiService.getLoginStatus().map((value) => {
      this.isAuthenticated = value;
      return value;
    });
  }

  /* see: https://developer.github.com/v3/guides/basics-of-authentication/ */

  loginToGithub(returnURL: any): void {

    let url = 'https://' + this.githubHost + this.githubPath;
    url += '?client_id=' + this.githubClientId;
    url += '&redirect_uri=' + document.location.protocol + '//' + document.location.host + this.callbackPath;

    // if we have a returnURL, add that (have to encode the ? and the =)

    if (returnURL) {
      url += '%3Furl%3D' + returnURL;
    }

    window.location.href = url;
  }

  loginToYipee(githubCode: string): Observable<AuthResponse> {
    return this.apiService.loginToYipee(githubCode).map((response: AuthResponse) => {
      this.githubUsername = response.githubUsername;
      this.isAuthenticated = response.authenticated;
      return response;
    });
  }

  // send logout req, once a response is recieved. We redirect to the login page.
  logout(): void {
    this.apiService.logoutOfYipee().subscribe((response: boolean) => {
      if (response) {
        this.router.navigate(['/login']);
      }
      // TODO: generic handle error
    });

  }

  /* get the github client id (part of the github auth url) from
  our config api */
  loadGithubClientID(): void {
    this.apiService.getGithubClientID().subscribe((value) => {
      this.githubClientId = value;
    });

  }

  // get the github host (part of teh github auth url) from our config api
  loadGithubHost(): void {
    this.apiService.getGitHubClientHost().subscribe((value) => {
      this.githubHost = value;
    });

  }

}

export class MockAuthService {
  githubPath = '/login/oauth/authorize';
  githubClientId: string;
  githubHost: string;
  callbackPath = '/callback';
  isAuthenticated = false;
  githubUsername: 'username';
  returnUrl: string;
}
