import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { NamespaceRaw } from '../../models/YipeeFileRaw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { map, concatMap } from 'rxjs/operators';
import { timer, pipe, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NamespaceService {
  currentNamespaces: NamespaceRaw[];
  _isLive: boolean;

  constructor(
    private apiService: ApiService,
  ) { }

  get isLive(): boolean {
    return this._isLive;
  }

  loadAndReturnLiveStatus(): Observable<any> {
    return this.apiService.getConfig().map((response: any) => {
      this._isLive = (response.data[0].YIPEE_INSTALL_TYPE === 'cluster');
      return Observable.of(this._isLive);
    });
  }

  loadAndReturnNamespaces() {
    return this.apiService.getNamespaceApps().map((response: NamespaceRaw[]) => {
      this.currentNamespaces = response;
      return this.currentNamespaces;
    });
  }

  pollNamespaces() {
    return timer(0, 5000)
      .pipe(concatMap(() => from(this.loadAndReturnNamespaces()).pipe(map((namespaces) => {
        this.currentNamespaces = namespaces;
      }))));
  }

  deleteNamespace(namespace): Observable<any> {
    return this.apiService.deleteNamespace(namespace).map((response: any) => {
      return response;
    });
  }

}
