declare var $: JQueryStatic;
import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { EditorService } from './editor.service';
import { CanvasComponent } from './canvas/canvas.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DownloadService } from '../shared/services/download.service';
import { EditorEventService, SelectionChangedEvent, EventSource } from './editor-event.service';
import { YipeeFileService } from '../shared/services/yipee-file.service';
import { FeatureService } from '../shared/services/feature.service';

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
    public featureService: FeatureService,
    public downloadService: DownloadService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private editorEventService: EditorEventService,
    private yipeeFileService: YipeeFileService,
    private cd: ChangeDetectorRef,
  ) {
    this.showWarningModal = false;
  }

  ngOnInit() {
    // Are we "deep linking" into a model that is saved on the backend?
    const deepLinkId = this.activatedRoute.snapshot.params['id'];
    if (deepLinkId) {
      this.yipeeFileService.read(deepLinkId).subscribe(
        (yipeeFile) => {
          this.editorService.loadYipeeFile(yipeeFile).subscribe(
            (response) => {
              this.ui.loading = false;
              this.yipeeFileID = this.editorService.yipeeFileID;

            });
        },
        (error) => {
          this.ui.error = true;
          this.ui.loading = false;
          this.editorService.metadata = null;
          this.editorService.fatalText.length = 0;
          this.editorService.fatalText.push(EditorService.UNEXPECTED_RESPONSE + error.message);
        });
    } else {
      this.ui.loading = false;
    }
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

  onFatalClose(text: string) {
    const index = this.editorService.fatalText.indexOf(text);
    if (index !== -1) {
      this.editorService.fatalText.splice(index, 1);
    }
  }

  onWarningClose(text: string) {
    const index = this.editorService.warningText.indexOf(text);
    if (index !== -1) {
      this.editorService.warningText.splice(index, 1);
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
    this.router.navigate(['/']);
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

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  exitEditor(): void {
    this.router.navigate(['']);
  }

  canDeactivate(): boolean {
    if (this.disregardChanges || (this.editorService.dirty === false)) {
      this.editorService.dirty = false;
      return true;
    } else {
      this.showWarningModal = true;
      return false;
    }
  }

}
