import { TestBed, async, inject } from '@angular/core/testing';

import { NamespaceService } from './namespace.service';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { YipeeResponse } from '../../models/YipeeFileResponse';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NamespaceRaw } from '../../models/YipeeFileRaw';
import { Http } from '@angular/http';

const response1 = {
  success: true,
  total: 1,
  data: [{ YIPEE_INSTALL_TYPE: 'cluster' }]
};

const namespaces1 = {
    name: 'default',
    dateCreated: '2018-12-20T18:01:35Z',
    containerCount: 1,
    podCount: 1,
    phase: 'active',
    status: 'green'
};

// class MockApiService {
//   constructor() { }

//   getConfig(): Observable<YipeeResponse> {
//     return Observable.of(response1);
//   }

//   getNamespaceApps(): Observable<NamespaceRaw[]> {
//       return Observable.of([namespaces1]);
//   }
// }

describe('NamespaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      HttpClientTestingModule
    ],
    providers: [
      NamespaceService,
      ApiService
    ]
  }));

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it('should be created', () => {
    const service: NamespaceService = TestBed.get(NamespaceService);
    expect(service).toBeTruthy();
  });

  it('should set _isLive to a boolean & return a boolean when loadAndReturnLiveStatus() is called', async(inject([NamespaceService, HttpTestingController], (namespaceService: NamespaceService, backend: HttpTestingController) => {
    namespaceService.loadAndReturnLiveStatus().subscribe(response => {
      console.log('XXXXXX: ', response);
      console.log('YYYYYY: ', Observable.of(true));
      expect(response.value).toEqual(true);
      expect(namespaceService._isLive).toEqual(true);
    });
    backend.expectOne('/api/configs').flush(response1);
  })));

  it('should set currentNamespaces to a list of namespaces & return a list of namespaces when loadAndReturnNamespaces() is called', async(inject([NamespaceService, HttpTestingController], (namespaceService: NamespaceService, backend: HttpTestingController) => {
    namespaceService.loadAndReturnNamespaces().subscribe(response => {
      console.log('XXXXXX: ', response);
      console.log('YYYYYY: ', namespaces1);
      expect(response).toEqual([namespaces1]);
      expect(namespaceService.currentNamespaces).toEqual([namespaces1]);
    });
    backend.expectOne('/api/namespaces').flush({data: [namespaces1]});
  })));

});
