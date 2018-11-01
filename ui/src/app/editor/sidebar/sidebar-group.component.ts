import { Component, OnDestroy, OnChanges, SimpleChange, Input } from '@angular/core';

import { SidebarPanelComponent } from './sidebar-panel.component';

@Component({
  selector: 'app-sidebar-group',
  templateUrl: './sidebar-group.component.html',
  styleUrls: ['./sidebar-group.component.css']
})
export class SidebarGroupComponent implements OnDestroy {

  @Input() key: string;
  @Input() isVisible = false;
  @Input() isDefault = false;

  constructor(private panel: SidebarPanelComponent) {
    this.panel.add(this);
  }

  ngOnDestroy() {
    this.panel.remove(this);
  }

}
