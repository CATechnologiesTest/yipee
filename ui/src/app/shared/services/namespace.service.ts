import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { NamespaceRaw } from '../../models/YipeeFileRaw';
import { map, concatMap } from 'rxjs/operators';
import { timer, Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs'

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
