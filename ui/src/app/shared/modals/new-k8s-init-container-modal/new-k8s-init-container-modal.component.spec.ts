import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';


import { EditorService } from '../../../editor/editor.service';
import { NewK8sInitContainerModalComponent } from './new-k8s-init-container-modal.component';

describe('NewK8sInitContainerModalComponent', () => {
  let component: NewK8sInitContainerModalComponent;
  let fixture: ComponentFixture<NewK8sInitContainerModalComponent>;

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
      declarations: [NewK8sInitContainerModalComponent],
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: EditorService, useClass: MockEditorService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewK8sInitContainerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
