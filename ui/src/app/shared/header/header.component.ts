import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { EditorService } from '../../editor/editor.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {


  isBeta: boolean;
  @Input() title: string;
  @Output() showSettingsDialog = new EventEmitter<boolean>();

  constructor(
    private editorService: EditorService,
    private router: Router
  ) {
  }

  onShowSettingsDialog() {
    this.showSettingsDialog.emit(true);
  }

}
