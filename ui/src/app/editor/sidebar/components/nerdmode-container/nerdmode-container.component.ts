import { Component, Input, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

// import services
import { ApiService } from '../../../../shared/services/api.service';
import { DownloadService } from '../../../../shared/services/download.service';
import { EditorService } from '../../../editor.service';
import { YipeeFileErrorResponse } from '../../../../models/YipeeFileResponse';

@Component({
  selector: 'nerdmode-container',
  template: `
    <div class="container">
      <nerdmode-viewer
        [nerdmode]="nerdmode"
        (switchType)="loadFile($event)"
        (downloadByType)="downloadFile($event)">
      </nerdmode-viewer>
    </div>
  `
})
export class NerdmodeContainerComponent implements OnInit {
  @Input() id: string;

  nerdmode = {
    errors: false,
    loading: true,
    code: null,
    name: null,
    version: 0
  };

  constructor(
    private apiService: ApiService,
    private downloadService: DownloadService,
    private editorService: EditorService
  ) { }

  // load nerd mode file from nerdmode endpoint
  getFile(fileType: string): Observable<string> {
    const flat = this.editorService.k8sFile.toFlat();
      switch (fileType) {
        case 'kubernetes': {
          return this.apiService.getLiveKubernetesFileDataFromFlat(flat).map((response) => {
            this.nerdmode.name = response.name;
            this.nerdmode.version = response.version;
            return response.kubernetesFile.trim();
          });
        }
        case 'helm': {
          return this.apiService.getLiveHelmFileDataFromFlat(flat).map((response) => {
            this.nerdmode.name = response.name;
            this.nerdmode.version = response.version;
            return response.helmFile.trim();
          });
        }
      }
  }

  loadFile(type: string): void {
    this.nerdmode.loading = true;
    this.getFile(type).subscribe((code: string) => {
      this.nerdmode.errors = false;
      this.nerdmode.code = code;
      this.editorService.nerdModeType = type;
      this.nerdmode.loading = false;
    }, (error) => {
      this.nerdmode.errors = true;
      this.nerdmode.loading = false;
      this.editorService.nerdModeType = type;
      try {
        const response = JSON.parse(error._body) as YipeeFileErrorResponse;
        this.nerdmode.code = 'Errors exist in application';
      } catch (e) {
        this.editorService.alertText.length = 0;
        this.editorService.alertText.push('Unexpected response from server: ' + error._body);
      }
    });
  }

  downloadFile(type: string): boolean {
    const filename = this.downloadService.generateName(this.nerdmode.name, type);
    const modelType = this.editorService.metadata.isFlat ? 'k8s' : 'c11y';
    this.downloadService.downloadFile([this.nerdmode.code], filename, type, modelType, true);
    return true;
  }

  ngOnInit(): void {
    if (this.editorService.nerdModeType !== undefined) {
      this.loadFile(this.editorService.nerdModeType);
    } else if (this.editorService.editMode === 'k8s') {
      this.loadFile('kubernetes');
    }
  }

}
