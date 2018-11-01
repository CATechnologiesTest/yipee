import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';
import { UserService } from './user.service';
import { YipeeFileResponse } from '../../models/YipeeFileResponse';

@Injectable()
export class ImportAppService {
  privateOnImport = true;
  fileObject: ComposeImportObject;

  constructor(private apiService: ApiService, private userService: UserService) { }

  importFile(name: string, file: string, isK8s: boolean, isTgz: boolean): Observable<YipeeFileResponse> {
    this.fileObject = {
      author: '',
      branch: null,
      isPrivate: this.privateOnImport,
      name: name,
      path: null,
      repo: null,
      importFile: null
    };

    this.fileObject.importFile = file;
    return this.apiService.importApp(this.fileObject).map((response) => {
      return response;
    });
  }

}

interface ComposeImportObject {
  author: string;
  branch: string;
  importFile: string;
  isPrivate: boolean;
  name: string;
  path: string;
  repo: string;
}
