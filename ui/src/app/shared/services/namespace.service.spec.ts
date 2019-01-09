import { TestBed } from '@angular/core/testing';

import { NamespaceService } from './namespace.service';
import { ApiService } from './api.service';

class MockApiService {
  constructor() { }
}

describe('NamespaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: ApiService, useClass: MockApiService },
    ]
  }));

  it('should be created', () => {
    const service: NamespaceService = TestBed.get(NamespaceService);
    expect(service).toBeTruthy();
  });
});
