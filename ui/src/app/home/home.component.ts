import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { YipeeFileMetadata } from '../models/YipeeFileMetadata';
import { NamespaceService } from '../shared/services/namespace.service';
import { DownloadService } from '../shared/services/download.service';
import { NamespaceRaw } from '../models/YipeeFileRaw';


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showNewApplicationDialog = false;
  showImportApplicationDialog = false;
  showNamespaceDiffDialog = false;
  isLoading = true;
  hasError = false;
  parentNamespace = "";

  namespaces: NamespaceRaw[];

  constructor(
    private router: Router,
    private namespaceService: NamespaceService,
    private downloadService: DownloadService
  ) { }

  handleCreateNewApplicationCreated(metadata: YipeeFileMetadata): void {
    this.showNewApplicationDialog = false;
    this.router.navigate(['/editor']);
  }

  importApplication(metadata: YipeeFileMetadata): void {
    this.showImportApplicationDialog = false;
    this.router.navigate(['/editor']);
  }

  diffNamespace(parentNamespace: string) {
    this.parentNamespace = parentNamespace;
    this.showNamespaceDiffDialog = true;
  }

  closeNamespaceDiff() {
    this.showNamespaceDiffDialog = false;
  }

  onOpen(namespace): void {
    this.router.navigate(['namespace', namespace.name]);
  }

  ngOnInit() {
    this.namespaceService.loadAndReturnNamespaces().subscribe((namespaces: NamespaceRaw[]) => {
      this.namespaces = namespaces;
      this.isLoading = false;
    })
  }
}
