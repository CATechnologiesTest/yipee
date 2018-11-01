import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { YipeeFileResponse } from '../../models/YipeeFileResponse';
import { OpenShiftFile } from '../../models/OpenShiftFile';
import { KubernetesFile } from '../../models/KubernetesFile';
import { DownloadService } from './download.service';
import { ApiService } from './api.service';

describe('DownloadService', () => {

  const openShiftFile1: OpenShiftFile = {
    openShiftFile: 'openShiftFile1',
    name: 'openShiftFile1',
    version: 2
  };

  const kubernetesFile1: KubernetesFile = {
    kubernetesFile: 'kubernetesFile1',
    name: 'kubernetesFile1',
    version: 2
  };

  class MockApiService {
    constructor() { }
    getOpenShiftFileData(appId): Observable<OpenShiftFile> {
      return Observable.of(openShiftFile1);
    }

    getOpenShiftArchiveFileData(appId): Observable<OpenShiftFile> {
      return Observable.of(openShiftFile1);
    }

    getKubernetesFileData(appId): Observable<KubernetesFile> {
      return Observable.of(kubernetesFile1);
    }

    getKubernetesArchiveFileData(appId): Observable<KubernetesFile> {
      return Observable.of(kubernetesFile1);
    }

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        DownloadService,
        { provide: ApiService, useClass: MockApiService }
      ]
    });
  });

  /* disable the download tests as they break Chrome v64

  it('should download a kubernetes archive file by id', inject([DownloadService], (service: DownloadService) => {
    service.downloadKubernetesArchivebyId('5551212');
  }));

  it('should download a kubernetes file by id', inject([DownloadService], (service: DownloadService) => {
    service.downloadKubernetesFileById('5551212');
  }));

  it('should download a openshift archive file by id', inject([DownloadService], (service: DownloadService) => {
    service.downloadOpenShiftArchiveById('5551212');
  }));

  it('should download a openshift file by id', inject([DownloadService], (service: DownloadService) => {
    service.downloadOpenShiftFileById('5551212');
  }));

  */

});
