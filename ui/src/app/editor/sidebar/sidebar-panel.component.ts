import { Component, OnInit, Output, EventEmitter, AfterContentInit } from '@angular/core';

import { SidebarGroupComponent } from './sidebar-group.component';

@Component({
  selector: 'app-sidebar-panel',
  templateUrl: './sidebar-panel.component.html',
  styleUrls: ['./sidebar-panel.component.css']
})

export class SidebarPanelComponent implements OnInit, AfterContentInit {

  groups: Array<SidebarGroupComponent> = [];
  contentInit: boolean;
  selectNextCreated: boolean;

  constructor() {
    this.contentInit = false;
    this.selectNextCreated = false;
  }

  ngAfterContentInit() {
    if (!this.contentInit) {
      this.openDefault();
      this.contentInit = true;
    }
  }

  ngOnInit() {
  }

  add(group: SidebarGroupComponent): void {
    this.groups.push(group);
    if (this.selectNextCreated) {
      this.openWithKey(group.key);
      this.selectNextCreated = false;
    }
  }

  remove(group: SidebarGroupComponent): void {
    const index = this.groups.indexOf(group);
    if (index !== -1) {
      this.groups.splice(index, 1);
    }
  }

  openDefault(): void {
    this.groups.forEach((group: SidebarGroupComponent) => {
      if (group.isDefault) {
        group.isVisible = true;
      } else {
        group.isVisible = false;
      }
    });
  }

  openWithKey(key: string): void {
    let found = false;
    this.groups.forEach((group: SidebarGroupComponent) => {
      if (group.key === key) {
        group.isVisible = true;
        found = true;
      } else {
        group.isVisible = false;
      }
    });
    if (!found) {
      this.selectNextCreated = true;
    }
  }

  closeOthers(openGroup: SidebarGroupComponent): void {
    this.groups.forEach((group: SidebarGroupComponent) => {
      if (group !== openGroup) {
        group.isVisible = false;
      }
    });
  }

}
