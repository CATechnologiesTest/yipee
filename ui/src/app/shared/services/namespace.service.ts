import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { NamespaceRaw } from '../../models/YipeeFileRaw';
import 'rxjs/add/operator/map';
import { map, concatMap } from 'rxjs/operators';
import { timer, pipe, from} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NamespaceService {
  currentNamespaces: NamespaceRaw[];

  constructor(
    private apiService: ApiService
  ) { }

  loadAndReturnNamespaces() {
    return this.apiService.getNamespaceApps().map((response: NamespaceRaw[]) => {
      this.currentNamespaces = response;
      return this.currentNamespaces;
    });
  }

  pollNamespaces() {
    return timer(0, 5000)
      .pipe(concatMap(() => from(this.loadAndReturnNamespaces())
      .pipe(map((namespaces) => {
        this.currentNamespaces = namespaces;
      }))
    ));
  }

}
