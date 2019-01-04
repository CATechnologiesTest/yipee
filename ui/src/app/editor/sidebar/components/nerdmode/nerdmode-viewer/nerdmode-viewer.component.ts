import { Component, Input, Output, EventEmitter } from '@angular/core';

// import custom services
import { EditorService } from '../../../../editor.service';

@Component({
  selector: 'nerdmode-viewer',
  templateUrl: './nerdmode-viewer.component.html',
  styleUrls: ['./nerdmode-viewer.component.css']
})
export class NerdmodeViewerComponent {

  @Input() nerdmode: any;
  @Output() switchType: EventEmitter<string> = new EventEmitter<string>();
  @Output() downloadByType: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    public editorService: EditorService
  ) { }

  onSwitchType(value: string): void {
    this.editorService.nerdModeType = value;
    this.switchType.emit(value);
  }

  onDownload(value: string): void {
    this.downloadByType.emit(value);
  }

  get openshift(): boolean {
    return (this.editorService.nerdModeType === 'openshift');
  }

  set openshift(value: boolean) {
    if (value && this.editorService.nerdModeType !== 'openshift') {
      this.onSwitchType('openshift');
    }
  }

  get kubernetes(): boolean {
    return (this.editorService.nerdModeType === 'kubernetes');
  }

  set kubernetes(value: boolean) {
    if (value && this.editorService.nerdModeType !== 'kubernetes') {
      this.onSwitchType('kubernetes');
    }
  }

  get helm(): boolean {
    return (this.editorService.nerdModeType === 'helm');
  }

  set helm(value: boolean) {
    if (value && this.editorService.nerdModeType !== 'helm') {
      this.onSwitchType('helm');
    }
  }


}
