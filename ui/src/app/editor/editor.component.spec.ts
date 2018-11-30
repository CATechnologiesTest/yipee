import { NO_ERRORS_SCHEMA } from '@angular/core';
import { tick, fakeAsync, async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

import { EditorComponent } from './editor.component';
import { CanvasComponent } from './canvas/canvas.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { EditorService } from './editor.service';
import { YipeeFileService } from '../shared/services/yipee-file.service';
import { YipeeFileMetadata } from '../models/YipeeFileMetadata';
import { DownloadService } from '../shared/services/download.service';
import { EditorEventService, SelectionChangedEvent, EventSource } from './editor-event.service';
import { EventEmitter } from '@angular/core';

class MockDownloadService {
  constructor() { }
}

class MockEditorEventService {
  constructor() { }
  onSelectionChange: EventEmitter<SelectionChangedEvent> = new EventEmitter();
}

class MockEditorService {
  yipeeFileID: string;
  metadata: YipeeFileMetadata;
  fatalText: string[] = [];
  alertText: string[] = [];
  infoText: string[] = [];
  invalidKeys: string[];
  dirty: boolean;

  constructor() {
    this.invalidKeys = [];
  }
  setYipeeFileID(yipeeFileId: string): Observable<boolean> {
    this.yipeeFileID = yipeeFileId;
    return of(true);
  }
  loadYipeeFile(): Observable<boolean> {
    this.metadata = YipeeFileService.newTestYipeeFileMetadata('test');
    return of(true);
  }
}

fdescribe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditorComponent,
        CanvasComponent,
        SidebarComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ],
      imports: [
        HttpModule,
        RouterTestingModule
      ],
      providers: [
        { provide: DownloadService, useClass: MockDownloadService },
        { provide: EditorService, useClass: MockEditorService },
        { provide: EditorEventService, useClass: MockEditorEventService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  xit('should set dirty flag and route to home when onClose is called with the true boolean', fakeAsync(inject([EditorService], (service: MockEditorService) => {
    expect(component).toBeTruthy();
    expect(location.path() === '').toBeTruthy();
    service.dirty = true;
    component.onClose(true);
    tick(500);
    expect(service.dirty).toBeFalsy();
    expect(component.showWarningModal).toBeFalsy();
    expect(location.path()).toBe('/');
  })));

  xit('should set showWarningModal to true when onClose is called with EditorService dirty flag set to true', inject([EditorService], (service: MockEditorService) => {
    expect(component.showWarningModal).toEqual(false);
    service.dirty = true;
    component.onClose();
    expect(component.showWarningModal).toEqual(true);
  }));

  xit('should call router.navigate home when onClose is called with EditorService dirty flag set to false', fakeAsync(inject([EditorService], (service: MockEditorService) => {
    expect(location.path() === '').toBeTruthy();
    expect(component.showWarningModal).toEqual(false);
    expect(service.dirty).toBeFalsy();
    service.dirty = false;
    component.onClose();
    tick(500);
    expect(location.path()).toBe('/');
  })));

});
