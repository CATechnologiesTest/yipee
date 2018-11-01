import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { DeploymentComponent } from './deployment.component';
import { EditorEventService } from '../../../../editor-event.service';
import { Service as k8sService } from '../../../../../models/k8s/Service';

describe('DeploymentComponent', () => {
  let component: DeploymentComponent;
  let fixture: ComponentFixture<DeploymentComponent>;

  class MockEditorEventService {
    public onServiceModelOnRefresh = new Subject<k8sService>();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ DeploymentComponent ],
      providers: [
        FormBuilder,
        { provide: EditorEventService, useClass: MockEditorEventService }
      ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(DeploymentComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({ service_name: formBuilder.control([]), revisionHistoryLimit: formBuilder.control([]) });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
