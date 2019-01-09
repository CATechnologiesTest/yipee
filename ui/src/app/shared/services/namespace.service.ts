import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { NamespaceRaw } from '../../models/YipeeFileRaw';
import 'rxjs/add/operator/map';

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


}
