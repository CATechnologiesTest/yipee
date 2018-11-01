import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Feature } from '../../models/Feature';
import { YipeeFileMetadataRaw } from '../../models/YipeeFileMetadataRaw';
import { OpenShiftFile } from '../../models/OpenShiftFile';
import { KubernetesFile } from '../../models/KubernetesFile';
import { HelmFile } from '../../models/HelmFile';
import { YipeeFileResponse } from '../../models/YipeeFileResponse';
import { UserInfoResponse } from '../../models/UserInfo';
import { AuthResponse } from '../../models/AuthResponse';
import { LogoutResponse } from '../../models/LogoutResponse';
import { YipeeFileRaw } from '../../models/YipeeFileRaw';

@Injectable()
export class ApiService {
  currentContextHeaderId: string;

  constructor(private http: Http) { }

  /* ------------------------ */
  /* AUTHENTICATION ENDPOINTS */
  /* ------------------------ */

  // login to yipee
  loginToYipee(github_callback_code: string): Observable<AuthResponse> {
    const api_endpoint = '/api/auth';
    const github_code_query: string = '?code=' + github_callback_code;

    return this.http.get(api_endpoint + github_code_query).map((response: Response) => {
      return <AuthResponse>response.json();
    });
  }

  // get authentication status
  getLoginStatus(): Observable<boolean> {
    const api_endpoint = '/api/userInfo';
    return this.http.get(api_endpoint).map((response: Response) => {
      return response.json().loggedIn;
    });

  }

  /* NOTE: here that we used to take in the whole reponse and return the
  response object. However, the API is using a 304 redirect for zebra which
  is probably for the best. Because of technicalities the response we actually
  get is a refresh root req of the root page, basically the body of localhost:8080,
  we can get more advanced with this once we remove this 304 after zerba but right
  now we can just check for a 200 sucess status code */
  logoutOfYipee(): Observable<boolean> {
    const api_endpoint = '/api/logout';

    return this.http.get(api_endpoint).map((response: Response) => {
      if (response.status === 200) {
        return true;
      }
      // TODO: generic handle error
    });
  }
  /* ---------------------------- */
  /* END AUTHENTICATION ENDPOINTS */
  /* ---------------------------- */

  /* ----------------------------------- */
  /* APPLICATION CONFIGURATION ENDPOINTS */
  /* ----------------------------------- */
  getGithubClientID(): Observable<string> {
    const api_endpoint = '/api/configurations/CLIENT_ID';
    return this.http.get(api_endpoint).map((response: Response) => {
      return response.json().data[0].val;
    });

  }

  getGitHubClientHost(): Observable<string> {
    const api_endpoint = '/api/configurations/GITHUB_HOST';
    return this.http.get(api_endpoint).map((response: Response) => {
      return response.json().data[0].val;
    });
  }

  getYipeeStoreRepo(): Observable<string> {
    const api_endpoint = '/api/configurations/YIPEE_STORE_REPO';
    return this.http.get(api_endpoint).map((response: Response) => {
      return <string> response.json().data[0].val;
    });
  }

  getAnalyticsKey(): Observable<string> {
    const api_endpoint = '/api/configurations/ANALYTICS_KEY';
    return this.http.get(api_endpoint).map((response: Response) => {
      return <string> response.json().data[0].val;
    });
  }

  getTimeoutDuration(): Observable<string> {
    const api_endpoint = '/api/configurations/SESSION_TIMEOUT_MILLIS';
    return this.http.get(api_endpoint).map((response: Response) => {
      return <string> response.json().data[0].val;
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
    return this.http.get(api_endpoint).map((response: Response) => {
      return <UserInfoResponse>response.json();
    });
  }

  // validate the githubUsername is valid in yipee and return the id, null if
  // not valid
  validateGithubId(githubUsername: string): Observable<string> {
    const api_endpoint = '/api/query';
    const graphQLQuery = '{userByIdentity(service:"github", identity:"' + githubUsername + '") {id}}';
    const queryObject = { query: graphQLQuery };
    return this.http.post(api_endpoint, JSON.stringify(queryObject)).map((response: Response) => {
      if (response.json().data.userByIdentity === null) {
        return <string>null;
      }
      return <string>response.json().data.userByIdentity.id;
    });
  }

  /* ------------------ */
  /* END USER ENDPOINTS */
  /* ------------------ */

  getActiveFeatures(userId: string): Observable<Feature[]> {
    const api_endpoint = '/api/query';
    const graphQLQuery = '{activeFeatures(user: "' + userId + '") { features {id, name}}}';
    const queryObject = { query: graphQLQuery };
    return this.http.post(api_endpoint, JSON.stringify(queryObject)).map((response: Response) => {
      return <Feature[]>response.json().data.activeFeatures.features;
    });
  }

  /* ----------------- */
  /* CATALOG ENDPOINTS */
  /* ----------------- */

  getPrivateApps(): Observable<YipeeFileMetadataRaw[]> {
    const api_endpoint = '/api/yipeefiles/myapps';
    const source_query = '?source=korn';
    return this.http.get(api_endpoint + source_query).map((response: Response) => {
      return <YipeeFileMetadataRaw[]>response.json().data;
    });
  }

  getPublicApps(): Observable<YipeeFileMetadataRaw[]> {
    const api_endpoint = '/api/yipeefiles';
    const source_query = '?source=korn';
    return this.http.get(api_endpoint + source_query).map((response: Response) => {
      return <YipeeFileMetadataRaw[]>response.json().data;
    });
  }

  makePublic(appId: string): Observable<YipeeFileResponse> {
    const api_endpoint = '/api/yipeefiles/make-public/' + appId;
    const source_query = '?source=korn';
    return this.http.put(api_endpoint + source_query, '').map((response: Response) => {
      return <YipeeFileResponse>response.json();
    });
  }

  importApp(yipeeFile: any): Observable<YipeeFileResponse> {
    const api_endpoint = '/api/import';
    return this.http.post(api_endpoint, yipeeFile).map((response: Response) => {
      return <YipeeFileResponse>response.json();
    });
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
    return this.http.post(api_endpoint, yipeeFile).map((response) => {
      console.log('API SERVICE DATA: ', <KubernetesFile>response.json().data[0]);
      return <KubernetesFile>response.json().data[0];
    });
  }

  getKubernetesArchiveFileData(yipeeFile: YipeeFileRaw): Observable<KubernetesFile> {
    console.log('API SERVICE kubernetesarchive: ', yipeeFile);
    const api_endpoint = '/api/download/k8sbundle';
    return this.http.post(api_endpoint, yipeeFile).map((response) => {
      console.log('API SERVICE DATA: ', <KubernetesFile>response.json().data[0]);
      return <KubernetesFile>response.json().data[0];
    });
  }

  getHelmFileArchiveData(yipeeFile: YipeeFileRaw): Observable<HelmFile> {
    const api_endpoint = '/api/download/helm';
    return this.http.post(api_endpoint, yipeeFile).map((response) => {
      return <HelmFile>response.json().data[0];
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
    return this.http.post(api_endpoint, yipeeFile).map((response) => {
      return <KubernetesFile>response.json().data[0];
    });
  }

  getLiveKubernetesFileDataFromFlat(flatFile: any): Observable<KubernetesFile> {
    const api_endpoint = '/api/convert/kubernetes?format=flat';
    return this.http.post(api_endpoint, flatFile).map((response) => {
      return <KubernetesFile>response.json().data[0];
    });
  }

  getLiveHelmFileData(yipeeFile: YipeeFileRaw): Observable<HelmFile> {
    const api_endpoint = '/api/convert/helm';
    return this.http.post(api_endpoint, yipeeFile).map((response) => {
      return <HelmFile>response.json().data[0];
    });
  }

  getLiveHelmFileDataFromFlat(flatFile: any): Observable<HelmFile> {
    const api_endpoint = '/api/convert/helm?format=flat';
    return this.http.post(api_endpoint, flatFile).map((response) => {
      return <HelmFile>response.json().data[0];
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
    return this.http.get(api_endpoint + source_query).map((response: Response) => {
      return <YipeeFileResponse>response.json();
    });
  }

  deleteApp(appId: string): Observable<YipeeFileResponse> {
    const api_endpoint = '/api/yipeefiles/' + appId;
    const source_query = '?source=korn';
    return this.http.delete(api_endpoint + source_query).map((response: Response) => {
      return <YipeeFileResponse>response.json();
    });
  }

  updateApp(yipeeFile: YipeeFileMetadataRaw): Observable<YipeeFileResponse> {
    const api_endpoint = '/api/yipeefiles/' + yipeeFile.id;
    let query = '?source=korn';
    if (yipeeFile.isFlat) {
      query += '&format=flat';
    }
    return this.http.put(api_endpoint + query, yipeeFile).map((response: Response) => {
      return <YipeeFileResponse>response.json();
    });
  }

  forkk8sApp(yipeeFile: YipeeFileMetadataRaw): Observable<YipeeFileResponse> {
    const api_endpoint = '/api/yipeefiles/forktok8s/';
    const query = '?source=korn';
    return this.http.post(api_endpoint + query, yipeeFile).map((response: Response) => {
      return <YipeeFileResponse>response.json();
    });
  }
  /* **************************** */
  /* END YIPEEFILE CRUD ENDPOINTS */
  /* **************************** */

  /* ************************ */
  /* YIPEEFILE LOGO ENDPOINTS */
  /* ************************ */
  getYipeeFileLogo(yipeeFileId: string) {
    const api_endpoint = '/api/uploadLogo/' + yipeeFileId;
    return this.http.get(api_endpoint).map((response) => {
      return response.json();
    });
  }

  putYipeeFileLogo(yipeeFileId: string, base64ImgString: string): Observable<boolean> {
    const api_endpoint = '/api/uploadLogo';
    const logo_object = {
      _id: yipeeFileId,
      serializedData: base64ImgString
    };
    return this.http.post(api_endpoint, logo_object).map((response) => {
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
  getDockerhubContainers(searchQuery, page = 1, resultCount = 100): Observable<Response> {
    return this.http.get(`/docker/v1/search?q=${searchQuery}&page=${page}&n=${resultCount}`)
      .map((response) => {
        return response;
      });
  }

  getDockerhubTags(namespaceAndRepository) {
    return this.http.get(`/docker/v1/repositories/${namespaceAndRepository}/tags`)
      .map((response) => {
        return response;
      });
  }
  /* *********************** */
  /* END DOCKERHUB ENDPOINTS */
  /* *********************** */

  /* ---------------------------------------- */
  /* METHODS TO MANAGE THE ORG CONTEXT HEADER */
  /* ---------------------------------------- */

  /* NOTE: here we still have a hack in the HTTP provider,
  would could modify it so that the headers are actually added
  in this service, which would be more ideal, but this is a more
  brute force way of doing the same thing for the time being */
  updateOrgContextHeaderId(newOrgContextId) {
    this.http.options(newOrgContextId, 'CHANGE_ORG_HEADER');
  }
  /* -------------------------------------------- */
  /* END METHODS TO MANAGE THE ORG CONTEXT HEADER */
  /* -------------------------------------------- */

  // metrics/trackingblocked
  trackingPrevented(): Observable<boolean> {
    return this.http.post('/api/metrics/trackingblocked', '').map((response) => {
      if (response.status === 200) {
        return true;
      }
      return false;
    });
  }

  // this sends the google analytics key to the backend
  sendGoogleAnalyticsKey(gaKey): Observable<Response> {
    return this.http.post('/api/metrics/setgakey', { 'Google Analytics': { clientId: gaKey }});
  }

}
