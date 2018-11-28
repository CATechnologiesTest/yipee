import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { EditorService } from '../../editor/editor.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  showWarningModal: boolean;

  isBeta: boolean;
  @Input() title: string;
  @Output() showSettingsDialog = new EventEmitter<boolean>();

  constructor(
    private editorService: EditorService,
    private router: Router
  ) {
    this.showWarningModal = false;
  }

  onShowSettingsDialog() {
    this.showSettingsDialog.emit(true);
  }

  onClose(forceClose?: boolean) {
    if (forceClose) {
      this.editorService.dirty = false;
      this.router.navigate(['/'], {});
    }
    if (this.editorService.dirty) {
      this.showWarningModal = true;
    } else {
      this.router.navigate(['/'], {});
    }
  }

  onCancel() {
    this.showWarningModal = false;
  }

}
