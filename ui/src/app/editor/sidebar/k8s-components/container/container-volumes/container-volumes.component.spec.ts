import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { ContainerVolumesComponent } from './container-volumes.component';
import { EditorEventService } from '../../../../editor-event.service';

describe('ContainerVolumesComponent', () => {
  let component: ContainerVolumesComponent;
  let fixture: ComponentFixture<ContainerVolumesComponent>;

  class MockEditorEventService {
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ ContainerVolumesComponent ],
      providers: [
        FormBuilder,
        { provide: EditorEventService, useClass: MockEditorEventService }
      ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(ContainerVolumesComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({ volume_ref: formBuilder.array([]) });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
