import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  onShowSettingsDialog() {
    this.showSettingsDialog.emit(true);
  }

  goHome() {
    this.router.navigate(['/'], {});
  }

}
