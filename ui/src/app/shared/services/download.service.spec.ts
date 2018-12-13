import { TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of, Subscriber } from 'rxjs';
import { delay } from 'rxjs/operators';


import { YipeeFileResponse } from '../../models/YipeeFileResponse';
import { OpenShiftFile } from '../../models/OpenShiftFile';
import { KubernetesFile } from '../../models/KubernetesFile';
import { DownloadService } from './download.service';
import { ApiService } from './api.service';
import { HelmFile } from '../../models/HelmFile';

describe('DownloadService', () => {

  const kubernetesFile1: KubernetesFile = {
    kubernetesFile: 'kubernetesFile1',
    name: 'kubernetesFile1',
    version: 2
  };

  const helmFile: HelmFile = {
    helmFile: 'helmFile1',
    name: 'helmFile1',
    version: 2
  };

  class MockApiService {
    constructor() { }

    getKubernetesFileData(file): Observable<KubernetesFile> {
      return of(kubernetesFile1).pipe(delay(50));
    }

    getKubernetesArchiveFileData(file): Observable<KubernetesFile> {
      return of(kubernetesFile1).pipe(delay(50));
    }

    getHelmFileArchiveData(file): Observable<HelmFile> {
      return of(helmFile).pipe(delay(50));
    }

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        DownloadService,
        { provide: ApiService, useClass: MockApiService }
      ]
    });
  });

  describe('Should download a type of file with or without a subscriber', () => {
    beforeEach(inject([DownloadService], (service: DownloadService) => {
      service.saveFile = () => { };
      service.convertB64 = () => {
        return [];
      };
    }));

    it('should download a kubernetes archive file if you do not subscribe', fakeAsync(inject([DownloadService], (service: DownloadService) => {
      let subscriber: Subscriber<any>;
      let result = new Observable<boolean>((s) => subscriber = s);
      try {
        result = service.download({ ['app-info']: [{ name: 'foo' }] }, 'getKubernetesArchiveFileData', 'kubernetesarchive', true, 'kubernetesFile');
      } catch (error) {
        fail(error);
      }
      tick(1000);
      expect(result).toBeTruthy();
    })));

    it('should download a kubernetes file if you do not subscribe', fakeAsync(inject([DownloadService], (service: DownloadService) => {
      let subscriber: Subscriber<any>;
      let result = new Observable<boolean>((s) => subscriber = s);
      try {
        result = service.download({ ['app-info']: [{ name: 'foo' }] }, 'getKubernetesFileData', 'kubernetes', false, 'kubernetesFile');
      } catch (error) {
        fail(error);
      }
      tick(1000);
    })));

    it('should download a helm file if you do not subscribe', fakeAsync(inject([DownloadService], (service: DownloadService) => {
      let subscriber: Subscriber<any>;
      let result = new Observable<boolean>((s) => subscriber = s);
      try {
        result = service.download({ ['app-info']: [{ name: 'foo' }] }, 'getHelmFileArchiveData', 'helmbundle', true, 'helmFile');
      } catch (error) {
        fail(error);
      }
      tick(1000);
    })));

    it('should download a kubernetes archive file if you subscribe', fakeAsync(inject([DownloadService], (service: DownloadService) => {
      let result: boolean;
      service.download({ ['app-info']: [{ name: 'foo' }] }, 'getKubernetesArchiveFileData', 'kubernetesarchive', true, 'kubernetesFile').subscribe(
        (data) => {
          result = data;
        },
        (error) => {
          result = error;
        }
      );
      tick(1000);
      expect(result).toBeTruthy();
    })));

    it('should download a kubernetes file if you subscribe', fakeAsync(inject([DownloadService], (service: DownloadService) => {
      let result: boolean;
      service.download({ ['app-info']: [{ name: 'foo' }] }, 'getKubernetesFileData', 'kubernetes', false, 'kubernetesFile').subscribe(
        (data) => {
          result = data;
        },
        (error) => {
          result = error;
        }
      );
      tick(1000);
      expect(result).toBeTruthy();
    })));

    it('should download a helm file if you subscribe', fakeAsync(inject([DownloadService], (service: DownloadService) => {
      let result: boolean;
      service.download({ ['app-info']: [{ name: 'foo' }] }, 'getHelmFileArchiveData', 'helmbundle', true, 'helmFile').subscribe(
        (data) => {
          result = data;
        },
        (error) => {
          result = error;
        }
      );
      tick(1000);
      expect(result).toBeTruthy();
    })));

  });

});
