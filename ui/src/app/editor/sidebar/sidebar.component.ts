import { Component, OnInit, ViewChild } from '@angular/core';

import { EditorService } from '../editor.service';
import { EditorEventService, SelectionChangedEvent, EventSource, ServiceSecretChangedEvent } from '../editor-event.service';
import { SidebarPanelComponent } from './sidebar-panel.component';
import { YipeeFileMetadata } from '../../models/YipeeFileMetadata';
import { K8sFile } from '../../models/k8s/K8sFile';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  metadata: YipeeFileMetadata;
  k8sFile: K8sFile;
  subscription: any;
  viewType = 'app';
  editorMode: 'k8s';
  selectionId: string;

  @ViewChild(SidebarPanelComponent)
  private panel: SidebarPanelComponent;

  constructor(
    private editorService: EditorService,
    public editorSelectionService: EditorEventService,
    public editorEventService: EditorEventService
  ) {
    this.selectionId = 'APP_INFO';
  }

  ngOnInit(): void {
    this.metadata = this.editorService.metadata;
    this.k8sFile = this.editorService.k8sFile;
  }

  changeView(view: string): void {
    this.viewType = view;
  }

  selectionChanged(event: SelectionChangedEvent) {
    if (event.selectedKey === '') {
      this.selectionId = 'APP_INFO';
    } else {
      this.selectionId = event.selectedKey;
    }
    // below if else is not needed for k8s
    if (this.panel !== undefined) {
      if (event.selectDefault) {
        this.panel.openDefault();
      } else {
        this.panel.openWithKey(event.selectedKey);
      }
    }
  }

}
