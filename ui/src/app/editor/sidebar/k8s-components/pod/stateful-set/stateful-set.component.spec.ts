import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { StatefulSetComponent } from './stateful-set.component';
import { EditorService } from '../../../../editor.service';
import { EditorEventService } from '../../../../editor-event.service';
import { Service as k8sService } from '../../../../../models/k8s/Service';

describe('StatefulSetComponent', () => {
  let component: StatefulSetComponent;
  let fixture: ComponentFixture<StatefulSetComponent>;

  class MockEditorService {
    public service_map = [];
  }

  class MockEditorEventService {
    public onServiceModelOnRefresh = new Subject<k8sService>();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ StatefulSetComponent ],
      providers: [
        FormBuilder,
        { provide: EditorService, useClass: MockEditorService },
        { provide: EditorEventService, useClass: MockEditorEventService }
      ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(StatefulSetComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({ service_name: formBuilder.control([]), revisionHistoryLimit: formBuilder.control([]) });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
