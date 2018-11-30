declare var $: JQueryStatic;
import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';

import { EditorService } from './editor.service';
import { CanvasComponent } from './canvas/canvas.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DownloadService } from '../shared/services/download.service';
import { EditorEventService, SelectionChangedEvent, EventSource } from './editor-event.service';

@Component({
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, AfterViewChecked {

  showWarningModal: boolean;

  @ViewChild(CanvasComponent)
  private canvasComponent: CanvasComponent;

  @ViewChild(SidebarComponent)
  private sidebarComponent: SidebarComponent;

  yipeeFileID: string;
  disregardChanges = false;
  resizing = false;
  viewType = 'app';

  ui = {
    loading: true,
    error: false,
    saving: false
  };

  constructor(
    public editorService: EditorService,
    public downloadService: DownloadService,
    private router: Router,
    private editorEventService: EditorEventService,
    private cd: ChangeDetectorRef,
  ) {
    this.showWarningModal = false;
  }

  ngOnInit() {

    // this.featureService.refreshFeatures().subscribe((value) => {
      // this.orgService.refreshOrgs().subscribe((orgResponse: boolean) => {
        // this.orgService.changeCurrentOrg(this.activatedRoute.snapshot.params['context']);
        // this.editorService.loadYipeeFile(this.activatedRoute.snapshot.params['id']).subscribe((response) => {
          this.ui.loading = false;
          this.ui.error = false;
          // this.yipeeFileID = this.editorService.yipeeFileID;
          // this.editorService.fatalText.length = 0;
          // this.editorService.alertText.length = 0;
          // this.editorService.infoText.length = 0;
          // if (this.editorService.readOnly) {
          //   this.editorService.infoText.push('This is a read only view of the model, changes cannot be saved.');
          // }
        // }, (error) => {
        //   this.ui.error = true;
        //   this.ui.loading = false;
        //   this.editorService.metadata = null;
        //   if (error.status === 403) {
        //     this.editorService.fatalText.push(
        //       'You do not have permission to view this application. ' +
        //       'Please ask the owner of this application to add you to their team.'
        //     );
        //   } else {
        //     try {
        //       const response = JSON.parse(error._body) as YipeeFileErrorResponse;
        //       this.editorService.fatalText.push.apply(this.editorService.fatalText, response.data);
        //     } catch (e) {
        //       this.editorService.fatalText.length = 0;
        //       this.editorService.fatalText.push('Unexpected response from server: ' + error);
        //     }
        //   }
        // });
      // });
    // });

    this.editorEventService.onSelectionChange.subscribe((event) => {
      this.handleSelectionChanged(event);
    });

  }

  handleSelectionChanged(event: SelectionChangedEvent): void {
    if (event.source === EventSource.Canvas) {
      this.changeView('app');
      this.sidebarComponent.selectionChanged(event);
    }
  }

  onAlertClose(text: string) {
    const index = this.editorService.alertText.indexOf(text);
    if (index !== -1) {
      this.editorService.alertText.splice(index, 1);
    }
  }

  onInfoClose(text: string) {
    const index = this.editorService.infoText.indexOf(text);
    if (index !== -1) {
      this.editorService.infoText.splice(index, 1);
    }
  }

  onLayout() {
    this.canvasComponent.layoutGraph();
  }

  fatalExit() {
    this.router.navigate(['/catalog']);
  }

  doChangeView(view: string): void {
    this.changeView(view);
  }

  changeView(view: string): void {
    this.viewType = view;
    if (this.sidebarComponent !== undefined) {
      this.sidebarComponent.changeView(view);
    }
  }

  resizeStop(event): boolean {
    this.resizing = false;
    return false;
  }

  resizeMove(event): boolean {
    if (this.resizing) {
      const width = $('.editor-page').width();
      if (event.x < 600) {
        return;
      }
      let right = width - event.x;
      if (right < 0) {
        right = 0;
      }
      $('.editor-description').css({ right: right + 'px' });
      $('.canvas-header').css({ right: right + 'px' });
      $('.canvas-paper').css({ right: (right + 15) + 'px' });
      $('.canvas-navigator').css({ right: (right + 15) + 'px' });
      $('.splitter').css({ right: right + 'px' });
      $('.sidebar-area').css({ width: right + 'px' });
      // this.canvasComponent.resized();
      return false;
    }
    return true;
  }

  startResize(event): boolean {
    this.resizing = true;
    return false;
  }

  onClose(forceClose?: boolean): void {
    if (forceClose || (this.editorService.dirty === false)) {
      this.editorService.dirty = false;
      this.router.navigate(['/'], {});
    } else {
      this.showWarningModal = true;
    }
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  exitEditor(): void {
    this.router.navigate(['']);
  }

}
