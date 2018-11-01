import { TestBed, inject } from '@angular/core/testing';

import { ContainerSearchService } from './container-search.service';
import { ApiService } from '../../shared/services/api.service';

describe('ContainerSearchService', () => {

  class MockApiService {

    constructor() { }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useClass: MockApiService },
        ContainerSearchService
      ]
    });
  });

  it('should be created', inject([ContainerSearchService], (service: ContainerSearchService) => {
    expect(service).toBeTruthy();
  }));
});
