import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

// import models
import { DockerhubContainer } from '../../models/Dockerhub';

// import custom services
import { ApiService } from '../../shared/services/api.service';

@Injectable()
export class ContainerSearchService {

  constructor(
    private apiService: ApiService
  ) { }

  search(searchQuery: string, dataset: string): Observable<DockerhubContainer[]> {

    if (dataset === 'dockerhub') {
      return this.searchDockerhub(searchQuery);
    } else if (dataset === 'dockerhubOfficial') {
      return this.searchDockerhubOfficial(searchQuery);
    }

  }

  searchDockerhub(searchQuery: string): Observable<DockerhubContainer[]> {
    return this.apiService.getDockerhubContainers(searchQuery)
      .map((response) => {
        return (response.json().results);
      });
  }

  searchDockerhubOfficial(searchQuery: string): Observable<DockerhubContainer[]> {
    return this.apiService.getDockerhubContainers(searchQuery)
      .map((response) => {
        return response.json().results.filter(result => (result.is_official === true));
      });
  }

  getTags(namespaceAndRepository) {
    return this.apiService.getDockerhubTags(namespaceAndRepository)
      .map((response) => {
        return response.json();
      });
  }

}
