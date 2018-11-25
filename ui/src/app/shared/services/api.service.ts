import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Feature } from '../../models/Feature';
import { YipeeFileMetadataRaw } from '../../models/YipeeFileMetadataRaw';
import { OpenShiftFile } from '../../models/OpenShiftFile';
import { KubernetesFile } from '../../models/KubernetesFile';
import { HelmFile } from '../../models/HelmFile';
import { YipeeFileResponse } from '../../models/YipeeFileResponse';
import { UserInfoResponse } from '../../models/UserInfo';
import { YipeeFileRaw } from '../../models/YipeeFileRaw';

@Injectable()
export class ApiService {
  currentContextHeaderId: string;

  constructor(private http: HttpClient) { }

  /* ----------------------------------- */
  /* APPLICATION CONFIGURATION ENDPOINTS */
  /* ----------------------------------- */

  getAnalyticsKey(): Observable<string> {
    const api_endpoint = '/api/configurations/ANALYTICS_KEY';
    return this.http.get<YipeeFileResponse>(api_endpoint).map((response) => {
      return <string> response.data[0].val;
    });
  }

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

  getActiveFeatures(userId: string): Observable<Feature[]> {
    const api_endpoint = '/api/query';
    const graphQLQuery = '{activeFeatures(user: "' + userId + '") { features {id, name}}}';
    const queryObject = { query: graphQLQuery };
    return this.http.post<YipeeFileResponse>(api_endpoint, JSON.stringify(queryObject)).map((response) => {
      return <Feature[]>response.data['activeFeatures'].features;
    });
  }

  importApp(yipeeFile: any): Observable<YipeeFileResponse> {
    const api_endpoint = '/api/import';
    return this.http.post<YipeeFileResponse>(api_endpoint, yipeeFile);
    // .map((response: HttpResponse) => {
    //   return <YipeeFileResponse>response.json();
    // });
  }

  /* --------------------- */
  /* END CATALOG ENDPOINTS */
  /* --------------------- */


  /* -------------------------- */
  /* DOWNLOAD SERVICE ENDPOINTS */
  /* -------------------------- */

  getKubernetesFileData(yipeeFile: YipeeFileRaw): Observable<KubernetesFile> {
    console.log('API SERVICE kubernetes: ', yipeeFile);
    const api_endpoint = '/api/convert/kubernetes?format=flat';
    return this.http.post<YipeeFileResponse>(api_endpoint, yipeeFile).map((response) => {
      console.log('API SERVICE DATA: ', <KubernetesFile>response.data[0]);
      return <KubernetesFile>response.data[0];
    });
  }

  getKubernetesArchiveFileData(yipeeFile: YipeeFileRaw): Observable<KubernetesFile> {
    console.log('API SERVICE kubernetesarchive: ', yipeeFile);
    const api_endpoint = '/api/download/k8sbundle';
    return this.http.post<YipeeFileResponse>(api_endpoint, yipeeFile).map((response) => {
      console.log('API SERVICE DATA: ', <KubernetesFile>response.data[0]);
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
    const api_endpoint = '/api/yipeefiles/' + appId;
    const source_query = '?source=korn'; // TODO &format=flat
    return this.http.get<YipeeFileResponse>(api_endpoint + source_query);
  }

  deleteApp(appId: string): Observable<YipeeFileResponse> {
    const api_endpoint = '/api/yipeefiles/' + appId;
    const source_query = '?source=korn';
    return this.http.delete<YipeeFileResponse>(api_endpoint + source_query);
  }

  updateApp(yipeeFile: YipeeFileMetadataRaw): Observable<YipeeFileResponse> {
    const api_endpoint = '/api/yipeefiles/' + yipeeFile.id;
    let query = '?source=korn';
    if (yipeeFile.isFlat) {
      query += '&format=flat';
    }
    return this.http.put<YipeeFileResponse>(api_endpoint + query, yipeeFile);
  }

  forkk8sApp(yipeeFile: YipeeFileMetadataRaw): Observable<YipeeFileResponse> {
    const api_endpoint = '/api/yipeefiles/forktok8s/';
    const query = '?source=korn';
    return this.http.post<YipeeFileResponse>(api_endpoint + query, yipeeFile);
  }
  /* **************************** */
  /* END YIPEEFILE CRUD ENDPOINTS */
  /* **************************** */

  /* ************************ */
  /* YIPEEFILE LOGO ENDPOINTS */
  /* ************************ */
  getYipeeFileLogo(yipeeFileId: string): Observable<YipeeFileResponse> {
    const api_endpoint = '/api/uploadLogo/' + yipeeFileId;
    return this.http.get<YipeeFileResponse>(api_endpoint);
  }

  putYipeeFileLogo(yipeeFileId: string, base64ImgString: string): Observable<boolean> {
    const api_endpoint = '/api/uploadLogo';
    const logo_object = {
      _id: yipeeFileId,
      serializedData: base64ImgString
    };
    return this.http.post(api_endpoint, logo_object).map((response: HttpResponse<Object>) => {
      if (response.status === 200) {
        return true;
      }
      return false;
    });
  }
  /* **************************** */
  /* END YIPEEFILE LOGO ENDPOINTS */
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

  // metrics/trackingblocked
  trackingPrevented(): Observable<boolean> {
    return this.http.post('/api/metrics/trackingblocked', '').map((response: HttpResponse<Object>) => {
      if (response.status === 200) {
        return true;
      }
      return false;
    });
  }

  // this sends the google analytics key to the backend
  sendGoogleAnalyticsKey(gaKey): Observable<HttpResponse<Object>> {
    return this.http.post<HttpResponse<object>>('/api/metrics/setgakey', { 'Google Analytics': { clientId: gaKey }});
  }

}
