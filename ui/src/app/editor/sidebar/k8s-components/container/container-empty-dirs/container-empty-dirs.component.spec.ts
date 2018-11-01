import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { EditorEventService } from '../../../../editor-event.service';

import { ContainerEmptyDirsComponent } from './container-empty-dirs.component';

describe('ContainerEmptyDirsComponent', () => {
  let component: ContainerEmptyDirsComponent;
  let fixture: ComponentFixture<ContainerEmptyDirsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ ContainerEmptyDirsComponent ],
      providers: [
        EditorEventService,
        FormBuilder
      ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(ContainerEmptyDirsComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({ empty_dir_ref: formBuilder.array([]) });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
