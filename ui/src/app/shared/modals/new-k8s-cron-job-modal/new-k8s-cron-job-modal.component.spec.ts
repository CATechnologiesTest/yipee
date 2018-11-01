import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { EditorService } from '../../../editor/editor.service';
import { NewK8sCronJobModalComponent } from './new-k8s-cron-job-modal.component';

describe('NewK8sDaemonSetModalComponent', () => {
  let component: NewK8sCronJobModalComponent;
  let fixture: ComponentFixture<NewK8sCronJobModalComponent>;

  class MockEditorService {
    constructor() { }
    k8sFile = {
      services: [
        {
          name: 'service name one',
          selector: [],
          service_type: 'loadbalancer',
          port_mapping: []
        }
      ],
      containerGroups: []
    };
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewK8sCronJobModalComponent ],
      imports: [ ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: EditorService, useClass: MockEditorService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewK8sCronJobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
