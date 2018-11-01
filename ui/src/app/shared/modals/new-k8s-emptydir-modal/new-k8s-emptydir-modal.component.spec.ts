import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { EditorService } from '../../../editor/editor.service';
import { NewK8sEmptyDirModalComponent } from './new-k8s-emptydir-modal.component';

describe('NewK8sEmptyDirModalComponent', () => {
  let component: NewK8sEmptyDirModalComponent;
  let fixture: ComponentFixture<NewK8sEmptyDirModalComponent>;

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
      volumes: []
    };
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewK8sEmptyDirModalComponent ],
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
    fixture = TestBed.createComponent(NewK8sEmptyDirModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
