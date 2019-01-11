import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';

import { YipeeFileMetadataRaw } from '../../models/YipeeFileMetadataRaw';
import { KubernetesFile } from '../../models/KubernetesFile';
import { HelmFile } from '../../models/HelmFile';
import { YipeeFileResponse, YipeeResponse } from '../../models/YipeeFileResponse';
import { UserInfoResponse } from '../../models/UserInfo';
import { YipeeFileRaw } from '../../models/YipeeFileRaw';

@Injectable()
export class ApiService {
  static MISSING_NAMESPACE = 'Namespace must be defined';

  currentContextHeaderId: string;

  constructor(private http: HttpClient) { }

  /* ----------------------------------- */
  /* APPLICATION CONFIGURATION ENDPOINTS */
  /* ----------------------------------- */

  getTimeoutDuration(): Observable<string> {
    const api_endpoint = '/api/configurations/SESSION_TIMEOUT_MILLIS';
    return this.http.get<YipeeFileResponse>(api_endpoint).map((response) => {
      return <string> response.data[0].val;
    });
  }

  /* --------------------------------------- */
  /* END APPLICATION CONFIGURATION ENDPOINTS */
  /* --------------------------------------- */

  /* -------------- */
  /* USER ENDPOINTS */
  /* -------------- */

  getUserInfo(): Observable<UserInfoResponse> {
    const api_endpoint = '/api/userInfo';
    return this.http.get<UserInfoResponse>(api_endpoint);
  }

  // validate the githubUsername is valid in yipee and return the id, null if
  // not valid
  validateGithubId(githubUsername: string): Observable<string> {
    const api_endpoint = '/api/query';
    const graphQLQuery = '{userByIdentity(service:"github", identity:"' + githubUsername + '") {id}}';
    const queryObject = { query: graphQLQuery };
    return this.http.post<YipeeFileResponse>(api_endpoint, JSON.stringify(queryObject)).map((response) => {
      if (response.data['userByIdentity'] === null) {
        return <string>null;
      }
      return <string>response.data['userByIdentity'].id;
    });
  }

  /* ------------------ */
  /* END USER ENDPOINTS */
  /* ------------------ */

  importApp(yipeeFile: any): Observable<YipeeFileResponse> {
    const api_endpoint = '/api/import';
    return this.http.post<YipeeFileResponse>(api_endpoint, yipeeFile);
  }

  /* --------------------- */
  /* END CATALOG ENDPOINTS */
  /* --------------------- */


  /* -------------------------- */
  /* DOWNLOAD SERVICE ENDPOINTS */
  /* -------------------------- */

  getKubernetesFileData(yipeeFile: YipeeFileRaw): Observable<KubernetesFile> {
    const api_endpoint = '/api/convert/kubernetes?format=flat';
    return this.http.post<YipeeFileResponse>(api_endpoint, yipeeFile).map((response) => {
      return <KubernetesFile>response.data[0];
    });
  }

  getKubernetesArchiveFileData(yipeeFile: YipeeFileRaw): Observable<KubernetesFile> {
    const api_endpoint = '/api/download/k8sbundle';
    return this.http.post<YipeeFileResponse>(api_endpoint, yipeeFile).map((response) => {
      return <KubernetesFile>response.data[0];
    });
  }

  getHelmFileArchiveData(yipeeFile: YipeeFileRaw): Observable<HelmFile> {
    const api_endpoint = '/api/download/helm';
    return this.http.post<YipeeFileResponse>(api_endpoint, yipeeFile).map((response) => {
      return <HelmFile>response.data[0];
    });
  }
  /* ------------------------------ */
  /* END DOWNLOAD SERVICE ENDPOINTS */
  /* ------------------------------ */

  /* ------------------------------- */
  /* LIVE DOWNLOAD SERVICE ENDPOINTS */
  /* ------------------------------- */

  getLiveKubernetesFileData(yipeeFile: YipeeFileRaw): Observable<KubernetesFile> {
    const api_endpoint = '/api/convert/kubernetes';
    return this.http.post<YipeeFileResponse>(api_endpoint, yipeeFile).map((response) => {
      return <KubernetesFile>response.data[0];
    });
  }

  getLiveKubernetesFileDataFromFlat(flatFile: any): Observable<KubernetesFile> {
    const api_endpoint = '/api/convert/kubernetes?format=flat';
    return this.http.post<YipeeFileResponse>(api_endpoint, flatFile).map((response) => {
      return <KubernetesFile>response.data[0];
    });
  }

  getLiveHelmFileData(yipeeFile: YipeeFileRaw): Observable<HelmFile> {
    const api_endpoint = '/api/convert/helm';
    return this.http.post<YipeeFileResponse>(api_endpoint, yipeeFile).map((response) => {
      return <HelmFile>response.data[0];
    });
  }

  getLiveHelmFileDataFromFlat(flatFile: any): Observable<HelmFile> {
    const api_endpoint = '/api/convert/helm?format=flat';
    return this.http.post<YipeeFileResponse>(api_endpoint, flatFile).map((response) => {
      return <HelmFile>response.data[0];
    });
  }

  /* ----------------------------------- */
  /* END LIVE DOWNLOAD SERVICE ENDPOINTS */
  /* ----------------------------------- */

  /* ************************ */
  /* YIPEEFILE CRUD ENDPOINTS */
  /* ************************ */
  getApp(appId: string): Observable<YipeeFileResponse> {
    const api_endpoint = '/api/import/' + appId;
    return this.http.get<YipeeFileResponse>(api_endpoint);
  }

  deleteApp(appId: string): Observable<YipeeFileResponse> {
    const api_endpoint = '/api/yipeefiles/' + appId;
    return this.http.delete<YipeeFileResponse>(api_endpoint);
  }

  updateApp(yipeeFile: YipeeFileMetadataRaw): Observable<YipeeFileResponse> {
    const api_endpoint = '/api/yipeefiles/' + yipeeFile.id;
    return this.http.put<YipeeFileResponse>(api_endpoint, yipeeFile);
  }

  forkk8sApp(yipeeFile: YipeeFileMetadataRaw): Observable<YipeeFileResponse> {
    const api_endpoint = '/api/yipeefiles/forktok8s/';
    return this.http.post<YipeeFileResponse>(api_endpoint, yipeeFile);
  }
  /* **************************** */
  /* END YIPEEFILE CRUD ENDPOINTS */
  /* **************************** */

  /* ******************* */
  /* DOCKERHUB ENDPOINTS */
  /* ******************* */
  getDockerhubContainers(searchQuery, page = 1, resultCount = 100): Observable<HttpResponse<Object>> {
    return this.http.get<HttpResponse<Object>>(`/docker/v1/search?q=${searchQuery}&page=${page}&n=${resultCount}`);
  }

  getDockerhubTags(namespaceAndRepository): Observable<HttpResponse<Object>> {
    return this.http.get<HttpResponse<Object>>(`/docker/v1/repositories/${namespaceAndRepository}/tags`);
  }
  /* *********************** */
  /* END DOCKERHUB ENDPOINTS */
  /* *********************** */


  /* ******************* */
  /* DASHBOARD API CALLS */
  /* ******************* */
  applyManifest(metadataRaw: YipeeFileMetadataRaw, namespace: String, manifestIsNewNamespace: Boolean): Observable<YipeeResponse> {
    if (!namespace || namespace ==='') {
      const res = {success: false, total:0, data: [ApiService.MISSING_NAMESPACE]};
      return Observable.create( (observer: Observer<Object>) => {
        observer.error({error: res})
      });
  
    }
    const endpoint = manifestIsNewNamespace ? `/api/namespaces/apply/${namespace}?createNamespace=true` : `/api/namespaces/apply/${namespace}`;
    const body = {
      flatFile: metadataRaw.flatFile
    };
    return this.http.post<YipeeResponse>(endpoint, body);
  }

  /* ******************* */
  /* END DASHBOARD API CALLS */
  /* ******************* */


}
