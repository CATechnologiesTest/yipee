import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as FileSaver from 'file-saver';

import { ApiService } from './api.service';
import { of, Subject } from 'rxjs';

@Injectable()
export class DownloadService {

  constructor(
    private apiService: ApiService
  ) { }

  generateName(name: string, type: string): string {
    switch (type) {
      case 'kubernetes': {
        return name + '_Kubernetes.yml';
      }
      case 'kubernetesarchive': {
        return name + '_Kubernetes.tgz';
      }
      case 'helmbundle': {
        return name + '_Helm.tgz';
      }
      case 'helm': {
        return name + '_Helm.yml';
      }
    }
    return name;
  }

  downloadKubernetesFile(isKubernetes: boolean, file: any): Observable<boolean> {
    const modelName = file['app-info'][0].name;
    const subject = new Subject<boolean>();
    this.apiService.getKubernetesFileData(file).subscribe(
      (data) => {
        const kubernetesFile = data.kubernetesFile;
        const fileName = this.generateName(modelName, 'kubernetes');
        this.downloadFile([kubernetesFile], fileName, 'Kubernetes', 'k8s', false);
        subject.next(true);
      }, (error) => {
        subject.next(false);
      }
    );
    return subject.asObservable();
  }

  downloadHelmArchive(isKubernetes: boolean, file: any): Observable<boolean> {
    const modelName = file['app-info'][0].name;
    const subject = new Subject<boolean>();
    this.apiService.getHelmFileArchiveData(file).subscribe(
      (data) => {
        const helmFile = data.helmFile;
        const fileName = this.generateName(modelName, 'helmbundle');
        this.downloadFile(this.convertB64(helmFile), fileName, 'Helm', 'k8s', false);
        subject.next(true);
      }, (error) => {
        subject.next(false);
      }
    );
    return subject.asObservable();
  }

  downloadKubernetesArchive(isKubernetes: boolean, file: any): Observable<boolean> {
    const modelName = file['app-info'][0].name;
    const subject = new Subject<boolean>();
    this.apiService.getKubernetesArchiveFileData(file).subscribe(
      (data) => {
        const kubernetesArchiveFile = data.kubernetesFile;
        const fileName = this.generateName(modelName, 'kubernetesarchive');
        this.downloadFile(this.convertB64(kubernetesArchiveFile), fileName, 'KubernetesArchive', 'k8s', false);
        subject.next(true);
      }, (error) => {
        subject.next(false);
      }
    );
    return subject.asObservable();
  }

  convertB64(b64Data) {
    const sliceSize = 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return byteArrays;
  }

  downloadFile(data: any[], fileName: string, downloadType: string, modelType: string, live: boolean): void {
    if (downloadType === 'compose') {
      downloadType = 'composeV3';
    }
    downloadType = downloadType.charAt(0).toUpperCase() + downloadType.substr(1);
    const blob = new Blob(data, { type: 'text/plain' });
    FileSaver.saveAs(blob, fileName);
  }

}
