import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { EditorService } from '../../../editor/editor.service';
import { NewK8sDeploymentModalComponent } from './new-k8s-deployment-modal.component';

describe('NewK8sDeploymenbtModalComponent', () => {
  let component: NewK8sDeploymentModalComponent;
  let fixture: ComponentFixture<NewK8sDeploymentModalComponent>;

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
      declarations: [ NewK8sDeploymentModalComponent ],
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
    fixture = TestBed.createComponent(NewK8sDeploymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
