import { TestBed } from '@angular/core/testing';

import { UpdateService } from './update.service';
import { YipeeFileService } from './yipee-file.service';

class MockYipeeFileService {
  constructor() { }
}

describe('UpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      UpdateService,
      { provide: YipeeFileService, useClass: MockYipeeFileService }
    ]
  }));

  it('should be created', () => {

    const service: UpdateService = TestBed.get(UpdateService);
    expect(service).toBeTruthy();
  });
});
