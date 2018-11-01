import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { UserService } from './user.service';
import { ApiService } from './api.service';
import { FeatureService } from './feature.service';
import { Feature } from '../../models/Feature';

class MockUserService {
  constructor() { }
  userInfo = {
    'githubUsername': 'murra10'
  };
  permissions = {
    'userId': '39639ac2-97c1-11e7-8968-a758867a2903'
  };
}


class MockApiService {
  constructor() { }

  getActiveFeatures(userId: string): Observable<Feature[]> {
    expect(userId).toBe('39639ac2-97c1-11e7-8968-a758867a2903');
    const features: Feature[] = [{
      id: '1234',
      name: 'foo'
    },
    {
      id: '2345',
      name: 'bar'
    }];
    return Observable.of(features);
  }
}

describe('FeatureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        FeatureService,
        { provide: UserService, useClass: MockUserService },
        { provide: ApiService, useClass: MockApiService }
      ]
    });
  });

  it('should be created', inject([FeatureService], (service: FeatureService) => {
    expect(service).toBeTruthy();
  }));

  it('refreshFeatures works and returns feature', inject([FeatureService], (service: FeatureService) => {
    const refreshSubscribed = service.refreshFeatures().subscribe();
    expect(refreshSubscribed).toBeTruthy();
    expect(service.names.indexOf('foo') > -1).toBeTruthy();
    expect(service.names.indexOf('bar') > -1).toBeTruthy();
  }));

  it('refreshFeatures works and returns no feature', inject([FeatureService], (service: FeatureService) => {
    const refreshSubscribed = service.refreshFeatures().subscribe();
    expect(refreshSubscribed).toBeTruthy();
    expect(service.names.indexOf('foobar') > -1).toBeFalsy();
  }));

});
