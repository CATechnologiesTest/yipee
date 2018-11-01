import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';

import { K8sEmptyDirComponent } from './k8s-empty-dir.component';
import { EditorService } from '../../../editor.service';

describe('K8sEmptyDirComponent', () => {
  let component: K8sEmptyDirComponent;
  let fixture: ComponentFixture<K8sEmptyDirComponent>;

  class MockEditorService {
    k8sFile = {
      empty_dirs: [
        {
          name: 'empty dir name one',
          description: 'empty dir one description',
          medium: 'Memory'
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
      declarations: [ K8sEmptyDirComponent ]
    })
    .compileComponents();
  }));

  beforeEach( inject([EditorService], (editorService: EditorService) => {
    fixture = TestBed.createComponent(K8sEmptyDirComponent);
    component = fixture.componentInstance;
    component.emptydir = editorService.k8sFile.empty_dirs[0];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(`empty dir's (top level items)`, () => {
    it(`name should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.empty_dirs[0].name).toEqual('empty dir name one');
      expect(component.form.value.name).toEqual('empty dir name one');
    }));
    it(`name should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('name').setValue('new empty dir name one');
      expect(editorService.k8sFile.empty_dirs[0].name).toEqual('new empty dir name one');
    }));
    it(`description should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.empty_dirs[0].description).toEqual('empty dir one description');
      expect(component.form.value.description).toEqual('empty dir one description');
    }));
    it(`description should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('description').setValue('new empty dir one description');
      expect(editorService.k8sFile.empty_dirs[0].description).toEqual('new empty dir one description');
    }));
    it(`medium should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.empty_dirs[0].medium).toEqual('Memory');
      expect(component.form.value.medium).toEqual(true);
    }));
    it(`medium should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('medium').setValue(false);
      expect(editorService.k8sFile.empty_dirs[0].medium).toEqual('');
    }));
  });

});
