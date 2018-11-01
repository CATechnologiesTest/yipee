import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { DaemonSetComponent } from './daemon-set.component';
import { EditorEventService } from '../../../../editor-event.service';
import { Service as k8sService } from '../../../../../models/k8s/Service';

describe('DaemonSetComponent', () => {
  let component: DaemonSetComponent;
  let fixture: ComponentFixture<DaemonSetComponent>;

  class MockEditorEventService {
    public onServiceModelOnRefresh = new Subject<k8sService>();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ DaemonSetComponent ],
      providers: [
        FormBuilder,
        { provide: EditorEventService, useClass: MockEditorEventService }
      ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(DaemonSetComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({ revisionHistoryLimit: formBuilder.control([]) });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
