import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { NamespaceService } from '../shared/services/namespace.service';


@Injectable()
export class HomeResolverService implements Resolve<any> {

    constructor(private namespaceService: NamespaceService) { }

    resolve() {
        return this.namespaceService.loadAndReturnLiveStatus();
    }

}
