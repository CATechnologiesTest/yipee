import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Resolve, ActivatedRoute } from '@angular/router';
import { YipeeFileMetadata } from '../models/YipeeFileMetadata';
import { NamespaceService } from '../shared/services/namespace.service';
import { DownloadService } from '../shared/services/download.service';
import { NamespaceRaw } from '../models/YipeeFileRaw';
import { Subscription, Observable } from 'rxjs';


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  showNewApplicationDialog = false;
  showImportApplicationDialog = false;
  showNamespaceDiffDialog = false;
  deleteNamespaceError: string;
  isLive: boolean;
  isLoading = true;
  hasError = false;
  parentNamespace = '';
  private nsPollTimer: Subscription;

  namespaces: NamespaceRaw[];

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private namespaceService: NamespaceService,
    private downloadService: DownloadService,
  ) {
    this.deleteNamespaceError = '';
  }

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

  onDelete(namespace): void {
    this.namespaceService.deleteNamespace(namespace).subscribe(
      (response) => {
        if (response.success) {
          this.namespaceService.loadAndReturnNamespaces();
        } else {
          this.deleteNamespaceError = response.data[0];
        }
      }, (err) => {
        if (err.error.data) {
          this.deleteNamespaceError = err.error.data[0];
        }
      });
  }

  onDeleteNamespaceErrorClose() {
    this.deleteNamespaceError = '';
  }

  ngOnInit() {
    this.isLive = this.route.snapshot.data.isLive.value;
    if (this.isLive) {
      // get initial set of namespaces
      this.namespaceService.loadAndReturnNamespaces().subscribe((namespaces: NamespaceRaw[]) => {
        this.namespaces = namespaces;
        this.isLoading = false;
      });

      // poll namespaces every 5 seconds to refresh namespaces on page
      this.nsPollTimer = this.namespaceService.pollNamespaces().subscribe(() => {
        this.namespaces = this.namespaceService.currentNamespaces;
      });
    } else {
      this.isLoading = false;
    }

  }
  ngOnDestroy() {
    if (this.isLive) {
      this.nsPollTimer.unsubscribe();
    }
  }
}
