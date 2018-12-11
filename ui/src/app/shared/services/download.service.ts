import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as FileSaver from 'file-saver';

import { ApiService } from './api.service';
import { Subscriber } from 'rxjs';

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

  download(file: any, downloadFunc: string, fileNameType: string, b64Encode: boolean, resultFileType: string): Observable<boolean> {
    const modelName = file['app-info'][0].name;
    let subscriber: Subscriber<any>;
    const result = new Observable<boolean>((s) => subscriber = s);
    const temp = this.apiService[downloadFunc](file);
    console.log('TEMP: ', temp);
    temp.subscribe(
      (data) => {
        const fileData = data[resultFileType];
        const fileName = this.generateName(modelName, fileNameType);
        if (b64Encode) {
          this.saveFile(this.convertB64(fileData), fileName, fileNameType, 'k8s', false);
        } else {
          this.saveFile([fileData], fileName, fileNameType, 'k8s', false);
        }
        console.log('SUBSCRIBER: ', subscriber);
        if (subscriber) {
          subscriber.next(true);
          subscriber.complete();
        }
      },
      (error) => {
        if (subscriber) {
          subscriber.next(false);
          subscriber.complete();
        }
      }
    );
    console.log('TEMP: ', temp);
    return result;
  }

  downloadKubernetesFile(isKubernetes: boolean, file: any): Observable<boolean> {
    return this.download(file, 'getKubernetesFileData', 'kubernetes', false, 'kubernetesFile');
  }

  downloadHelmArchive(isKubernetes: boolean, file: any): Observable<boolean> {
    return this.download(file, 'getHelmFileArchiveData', 'helmbundle', true, 'helmFile');
  }

  downloadKubernetesArchive(isKubernetes: boolean, file: any): Observable<boolean> {
    return this.download(file, 'getKubernetesArchiveFileData', 'kubernetesarchive', true, 'kubernetesFile');
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

  saveFile(data: any[], fileName: string, downloadType: string, modelType: string, live: boolean): void {
    downloadType = downloadType.charAt(0).toUpperCase() + downloadType.substr(1);
    const blob = new Blob(data, { type: 'text/plain' });
    FileSaver.saveAs(blob, fileName);
  }

}
