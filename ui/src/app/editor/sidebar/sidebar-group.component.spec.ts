import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarPanelComponent } from './sidebar-panel.component';
import { SidebarGroupComponent } from './sidebar-group.component';

describe('SidebarGroupComponent', () => {
  let component: SidebarGroupComponent;
  let fixture: ComponentFixture<SidebarGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarGroupComponent ],
      providers: [
        SidebarPanelComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle open if not open', () => {
    expect(component).toBeTruthy();
    expect(component.isVisible).toBeFalsy();
    component.isVisible = true;
    expect(component.isVisible).toBeTruthy();
  });
});
