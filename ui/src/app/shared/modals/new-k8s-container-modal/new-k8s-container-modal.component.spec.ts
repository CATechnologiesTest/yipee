import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { EditorService } from '../../../editor/editor.service';
import { NewK8sContainerModalComponent } from './new-k8s-container-modal.component';

describe('NewK8aContainerModalComponent', () => {
  let component: NewK8sContainerModalComponent;
  let fixture: ComponentFixture<NewK8sContainerModalComponent>;

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
      containers: []
    };
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewK8sContainerModalComponent ],
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
    fixture = TestBed.createComponent(NewK8sContainerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
