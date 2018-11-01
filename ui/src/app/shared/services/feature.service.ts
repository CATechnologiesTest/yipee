
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Feature } from '../../models/Feature';
import { UserService } from './user.service';
import { ApiService } from './api.service';

@Injectable()
export class FeatureService {
  features: Feature[] = [];
  names: string[] = [];

  constructor(private userService: UserService, private apiService: ApiService) { }

  refreshFeatures(): Observable<boolean> {
    return this.apiService.getActiveFeatures(this.userService.permissions.userId).map((response) => {
      this.features = response;
      this.names = this.features.map(f => f.name);
      if (this.names === undefined) {
        this.names = [];
      }
      return true;
    });
  }

}
