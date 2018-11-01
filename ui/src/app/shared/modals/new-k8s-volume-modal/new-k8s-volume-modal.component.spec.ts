import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { EditorService } from '../../../editor/editor.service';
import { NewK8sVolumeModalComponent } from './new-k8s-volume-modal.component';

describe('NewK8sVolumeModalComponent', () => {
  let component: NewK8sVolumeModalComponent;
  let fixture: ComponentFixture<NewK8sVolumeModalComponent>;

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
      declarations: [ NewK8sVolumeModalComponent ],
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
    fixture = TestBed.createComponent(NewK8sVolumeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
