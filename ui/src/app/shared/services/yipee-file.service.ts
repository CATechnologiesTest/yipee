import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';
import { UserService } from './user.service';

import { YipeeFileMetadata } from '../../models/YipeeFileMetadata';
// import { NameValuePair, PortPair } from '../../models/YipeeFile';
import { YipeeFileResponse } from '../../models/YipeeFileResponse';
// import { YipeeFile, AppInfo, Service, Network, Volume, Secret } from '../../models/YipeeFile';
import { YipeeFileMetadataRaw } from '../../models/YipeeFileMetadataRaw';
import { K8sFile } from '../../models/k8s/K8sFile';
import { Subscriber } from 'rxjs/Subscriber';
import { throwError } from 'rxjs';


@Injectable()
export class YipeeFileService {

  /** Construct a blank template for yipee file metadata with an empty yipee file. */
  public static newYipeeFileMetadataTemplate(applicationName: string): YipeeFileMetadata {

    // const yipeeFile = new YipeeFile();
    // const appinfo = new AppInfo();
    const yipeeFileMetadata = new YipeeFileMetadata();

    // appinfo.name = applicationName;
    // appinfo.show_progress_bar = true;
    // yipeeFile.appinfo = appinfo;
    yipeeFileMetadata.name = applicationName;
    yipeeFileMetadata.isFlat = false;
    // yipeeFileMetadata.uiFile = yipeeFile;

    return yipeeFileMetadata;

  }

  /** Construct a blank template for k8s file metadata with an empty k8s file. */
  public static newK8sFileMetadataTemplate(applicationName: string): YipeeFileMetadata {

    const k8sFile = new K8sFile();
    const yipeeFileMetadata = new YipeeFileMetadata();

    k8sFile.appInfo.name = applicationName;
    yipeeFileMetadata.name = applicationName;
    yipeeFileMetadata.isFlat = true;
    yipeeFileMetadata.flatFile = k8sFile;

    return yipeeFileMetadata;

  }

  /** Construct a test yipee file metadata object. */
  public static newTestYipeeFileMetadata(applicationName: string): YipeeFileMetadata {

    const metadata = YipeeFileService.newYipeeFileMetadataTemplate(applicationName);
    metadata._id = '5551212';
    metadata.name = applicationName;
    metadata.author = 'AJ Copley';
    metadata.username = 'copan02';
    metadata.containers = [];
    metadata.downloads = 0;
    metadata.likes = 0;
    metadata.canvasdata = null;
    metadata.revcount = 0;
    metadata.dateCreated = new Date();
    metadata.dateModified = new Date();
    metadata.ownerorg = 'd258da3c-97c9-11e7-b422-b74de07713aa';
    metadata.fullname = 'copan02@github/e@no@ent/copan02/doggy.yipee';
    metadata.orgname = 'copan02';
    metadata.isPrivate = true;
    metadata.id = '5551212';
    metadata.hasLogo = false;
    metadata.flatFile = new K8sFile();
    return metadata;

  }

  /** Construct a test K8s file metadata object. */
  public static newTestK8sFileMetadata(applicationName: string): YipeeFileMetadata {

    const metadata = YipeeFileService.newK8sFileMetadataTemplate(applicationName);
    metadata._id = '5551212';
    metadata.name = applicationName;
    metadata.author = 'AJ Copley';
    metadata.username = 'copan02';
    metadata.containers = [];
    metadata.downloads = 0;
    metadata.likes = 0;
    metadata.canvasdata = null;
    metadata.revcount = 0;
    metadata.dateCreated = new Date();
    metadata.dateModified = new Date();
    metadata.ownerorg = 'd258da3c-97c9-11e7-b422-b74de07713aa';
    metadata.fullname = 'copan02@github/e@no@ent/copan02/doggy.yipee';
    metadata.orgname = 'copan02';
    metadata.isPrivate = true;
    metadata.id = '5551212';
    metadata.hasLogo = false;
    metadata.flatFile = new K8sFile();
    return metadata;

  }

  /** Convert legacy yipee file canvas data to Yipee annotations. */

  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) { }

  k8sFork(applicationName: string, existing: YipeeFileMetadata, type: boolean): Observable<YipeeFileMetadata> {
    const metadata = this.forkApp(applicationName, existing).toRaw();
    return this.apiService.forkk8sApp(metadata).map((response) => {
      return this.convertServerResponse(response.data[0]);
    });
  }

  create(applicationName: string): YipeeFileMetadata {
    const yipeeFile = this.createNewApp(applicationName, true);
    return yipeeFile;
  }

  read(yipeeFile_id: string): Observable<YipeeFileMetadata> {
    return this.apiService.getApp(yipeeFile_id).map((response) => {
      if (typeof response.data[0] === 'string') {
        throw new Error(response.data[0].toString());
      } else {
        return this.convertServerResponse(response.data[0]);
      }
    });
  }

  update(metadata: YipeeFileMetadata): Observable<YipeeFileMetadata> {
    const clone = metadata.toRaw();
    clone.name = metadata.name;
    clone.yipeeFile = { services: {} }; // @HACK until dokken is fixed
    return this.apiService.updateApp(clone).map((response) => {
      return this.convertServerResponse(response.data[0]);
    });
  }

  delete(yipeeFile_id: string, modelType: string): Observable<YipeeFileMetadata> {
    return this.apiService.deleteApp(yipeeFile_id).map((response) => {
      return this.convertServerResponse(response.data[0]);
    });
  }

  createNewApp(applicationName: string, k8s: boolean): YipeeFileMetadata {
    const metadata = (k8s ? YipeeFileService.newK8sFileMetadataTemplate(applicationName) : YipeeFileService.newYipeeFileMetadataTemplate(applicationName));
    metadata.author = '';
    metadata.username = '';
    return metadata;
  }

  forkApp(applicationName: string, existing: YipeeFileMetadata): YipeeFileMetadata {
    const metadata = (existing.isFlat ? YipeeFileService.newK8sFileMetadataTemplate(applicationName) : YipeeFileService.newYipeeFileMetadataTemplate(applicationName));
    metadata.author = this.userService.userInfo.githubUsername;
    metadata.username = this.userService.userInfo.githubUsername;
    metadata.name = applicationName;
    metadata.isFlat = existing.isFlat;
    if (metadata.isFlat) {
      metadata.flatFile = new K8sFile();
      metadata.flatFile.fromFlat(existing.flatFile.toFlat());
      metadata.flatFile.appInfo.name = applicationName;
    } else {
      // delete
      // metadata.uiFile = new YipeeFile(existing.uiFile.toRaw());
      // metadata.uiFile.appinfo.name = applicationName;
    }
    return metadata;
  }

  getYipeeFileLogo(yipeeFileId: string): Observable<string> {
    return this.apiService.getYipeeFileLogo(yipeeFileId).map((data) => {
      return data.data[0].serializedData;
    });
  }

  putYipeeFileLogo(yipeeFileId: string, base64ImageString: string) {
    return this.apiService.putYipeeFileLogo(yipeeFileId, base64ImageString).map((response) => {
      return response;
    });
  }

  convertServerResponse(response: YipeeFileMetadataRaw): YipeeFileMetadata {
    let metadata: YipeeFileMetadata;
    return metadata = new YipeeFileMetadata(response);
  }

}
