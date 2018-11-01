import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ImportAppService } from './import-app.service';
import { UserService } from './user.service';
import { ApiService } from './api.service';


const ComposeImportObject = {
  author: null,
  branch: null,
  composeFile: null,
  isPrivate: true,
  name: null,
  path: null,
  repo: null
};

class MockUserService {
  constructor() { }
  userInfo = {
    'githubUsername': 'murra10'
  };
}

class MockApiService {
  constructor() { }

  importApp() {
    return Observable.of(true);
  }
}

describe('ImportAppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ImportAppService,
        { provide: ApiService, useClass: MockApiService },
        { provide: UserService, useClass: MockUserService }
      ]
    });
  });

  it('should be created', inject([ImportAppService], (service: ImportAppService) => {
    expect(service).toBeTruthy();
  }));

  it('should create the compose file object from the parameters passed in', inject([ImportAppService], (service: ImportAppService) => {
    service.importFile('application name', 'compose file contents', false, false);
    expect(service.fileObject.isPrivate).toEqual(true);
    expect(service.fileObject.importFile).toEqual('compose file contents');
    expect(service.fileObject.name).toEqual('application name');
  }));
});
