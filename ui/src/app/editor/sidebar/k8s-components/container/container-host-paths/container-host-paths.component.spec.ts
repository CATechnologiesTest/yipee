import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { EditorEventService } from '../../../../editor-event.service';

import { ContainerHostPathsComponent } from './container-host-paths.component';

describe('ContainerHostPathsComponent', () => {
  let component: ContainerHostPathsComponent;
  let fixture: ComponentFixture<ContainerHostPathsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ ContainerHostPathsComponent ],
      providers: [
        EditorEventService,
        FormBuilder
      ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(ContainerHostPathsComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({ host_path_ref: formBuilder.array([]) });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
