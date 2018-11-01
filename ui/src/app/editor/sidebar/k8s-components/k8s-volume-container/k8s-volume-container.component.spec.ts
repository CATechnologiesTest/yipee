import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';

import { K8sVolumeContainerComponent } from './k8s-volume-container.component';
import { EditorService } from '../../../editor.service';

describe('K8sVolumeContainerComponent', () => {
  let component: K8sVolumeContainerComponent;
  let fixture: ComponentFixture<K8sVolumeContainerComponent>;

  class MockEditorService {
    k8sFile = {
      volumes: [
        {
          name: 'volume name one',
          description: 'volume one description',
          access_modes: ['ReadOnlyMany'],
          volume_mode: 'Filesystem',
          storage_class: 'string',
          storage: '2Gi'
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
      declarations: [ K8sVolumeContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach( inject([EditorService], (editorService: EditorService) => {
    fixture = TestBed.createComponent(K8sVolumeContainerComponent);
    component = fixture.componentInstance;
    component.volume = editorService.k8sFile.volumes[0];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 describe(`volumes's (top level items)`, () => {
    it(`name should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.volumes[0].name).toEqual('volume name one');
      expect(component.form.value.name).toEqual('volume name one');
    }));
    it(`name should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('name').setValue('new volume name one');
      expect(editorService.k8sFile.volumes[0].name).toEqual('new volume name one');
    }));
    it(`description should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.volumes[0].description).toEqual('volume one description');
      expect(component.form.value.description).toEqual('volume one description');
    }));
    it(`description should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('description').setValue('new volume one description');
      expect(editorService.k8sFile.volumes[0].description).toEqual('new volume one description');
    }));
    it(`access_modes should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.volumes[0].access_modes).toEqual(['ReadOnlyMany']);
      expect(component.form.value.access_modes_ReadOnlyMany).toEqual(true);
      expect(component.form.value.access_modes_ReadWriteOnce).toEqual(false);
      expect(component.form.value.access_modes_ReadWriteMany).toEqual(false);
    }));
    it(`access_modes should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('access_modes_ReadWriteOnce').setValue(true);
      expect(editorService.k8sFile.volumes[0].access_modes).toEqual(['ReadOnlyMany', 'ReadWriteOnce']);
    }));
    it(`volume_mode should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.volumes[0].volume_mode).toEqual('Filesystem');
      expect(component.form.value.volume_mode).toEqual('Filesystem');
    }));
    it(`volume_mode should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('volume_mode').setValue('Block');
      expect(editorService.k8sFile.volumes[0].volume_mode).toEqual('Block');
    }));
    it(`storage_class should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.volumes[0].storage_class).toEqual('string');
      expect(component.form.value.storage_class).toEqual('string');
    }));
    it(`storage_class should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('storage_class').setValue('new_storage_class');
      expect(editorService.k8sFile.volumes[0].storage_class).toEqual('new_storage_class');
    }));
    it(`storage should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.volumes[0].storage).toEqual('2Gi');
      expect(component.form.value.storage).toEqual('2Gi');
    }));
    it(`storage should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('storage').setValue('4Gi');
      expect(editorService.k8sFile.volumes[0].storage).toEqual('4Gi');
    }));
    it('access_mode should autofill value from the editorservice', inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.volumes[0].access_modes).toEqual(['ReadOnlyMany']);
      expect(component.form.value.access_modes_ReadOnlyMany).toEqual(true);
      expect(component.form.value.access_modes_ReadWriteOnce).toEqual(false);
      expect(component.form.value.access_modes_ReadWriteMany).toEqual(false);
    }));
    it('access_mode should be able to mutate value in the editorService', inject([EditorService], (editorService: EditorService) => {
      (component.form.get('access_modes_ReadOnlyMany') as FormControl).setValue(false);
      (component.form.get('access_modes_ReadWriteOnce') as FormControl).setValue(true);
      (component.form.get('access_modes_ReadWriteMany') as FormControl).setValue(true);
      expect(component.form.value.access_modes_ReadOnlyMany).toEqual(false);
      expect(component.form.value.access_modes_ReadWriteOnce).toEqual(true);
      expect(component.form.value.access_modes_ReadWriteMany).toEqual(true);
      expect(editorService.k8sFile.volumes[0].access_modes).toEqual(['ReadWriteOnce', 'ReadWriteMany']);
    }));
  });
});
