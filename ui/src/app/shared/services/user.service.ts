import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';

import { UserInfo } from '../../models/UserInfo';
import { Permissions } from '../../models/UserInfo';
import { UserInfoResponse } from '../../models/UserInfo';

@Injectable()
export class UserService {
  userInfo: UserInfo;
  permissions: Permissions;

  constructor(private apiService: ApiService) { }

  refreshUserInfo(): Observable<boolean> {
    return this.apiService.getUserInfo().map((response: UserInfoResponse) => {
      this.permissions = response.permissions;
      this.userInfo = response.userInfo;
      return true;
    });

  }

}
