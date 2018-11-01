import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';

import { K8sHostPathComponent } from './k8s-host-path.component';
import { EditorService } from '../../../editor.service';

describe('K8sHostPathComponent', () => {
  let component: K8sHostPathComponent;
  let fixture: ComponentFixture<K8sHostPathComponent>;

  class MockEditorService {
    k8sFile = {
      host_paths: [
        {
          name: 'empty dir name one',
          description: 'empty dir one description'
        }
      ]
    };

    reportInvalidForm(volumeId, isInavalid) {

    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: EditorService, useClass: MockEditorService }
      ],
      declarations: [ K8sHostPathComponent ]
    })
    .compileComponents();
  }));

  beforeEach( inject([EditorService], (editorService: EditorService) => {
    fixture = TestBed.createComponent(K8sHostPathComponent);
    component = fixture.componentInstance;
    component.hostPath = editorService.k8sFile.host_paths[0];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
