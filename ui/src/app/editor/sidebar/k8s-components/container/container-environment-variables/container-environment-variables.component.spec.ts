import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { ContainerEnvironmentVariablesComponent } from './container-environment-variables.component';

describe('ContainerEnvironmentVariablesComponent', () => {
  let component: ContainerEnvironmentVariablesComponent;
  let fixture: ComponentFixture<ContainerEnvironmentVariablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ContainerEnvironmentVariablesComponent],
      providers: [
        FormBuilder
      ]
    })
      .compileComponents();
  }));

  beforeEach(inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(ContainerEnvironmentVariablesComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({
      environment_var: formBuilder.array([]),
      config_map_ref: formBuilder.array([]),
      env_secret_ref: formBuilder.array([]),
      env_field_ref: formBuilder.array([]),
      env_resource_field_ref: formBuilder.array([])
    });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a true value when handleAddEnvironmentVar is called', () => {
    component.addEnvironmentVar.subscribe((value: boolean) => {
      expect(value).toBeDefined();
      expect(value).toEqual(true);
    });
    component.handleAddEnvironmentVar();
  });

  it('should emit a number when handleRemoveEnvironmentVar is called', () => {
    component.removeEnvironmentVar.subscribe((value: number) => {
      expect(value).toBeDefined();
      expect(value).toEqual(34);
    });
    component.handleRemoveEnvironmentVar(34);
  });

  it('should emit a true value when handleOpenBulkEdit is called', () => {
    component.toggleBulkEdit.subscribe((value: boolean) => {
      expect(value).toBeDefined();
      expect(value).toEqual(true);
    });
    component.handleOpenBulkEdit();
  });

  it('should emit a true value when handleToggleSortKey is called for the first time', () => {
    component.toggleSortKey.subscribe((value: boolean) => {
      expect(value).toBeDefined();
      expect(value).toEqual(true);
    });
    component.handleToggleSortKey();
  });

  it('should emit a true value when handleToggleSortValue is called for the first time', () => {
    component.toggleSortValue.subscribe((value: boolean) => {
      expect(value).toBeDefined();
      expect(value).toEqual(true);
    });
    component.handleToggleSortValue();
  });

  it('should emit a true value when handleAddConfigMapRef is called', () => {
    component.addConfigMapRef.subscribe((value: boolean) => {
      expect(value).toBeDefined();
      expect(value).toEqual(true);
    });
    component.handleAddConfigMapRef();
  });

  it('should emit a number when handleRemoveConfigMapRef is called', () => {
    component.removeConfigMapRef.subscribe((value: number) => {
      expect(value).toBeDefined();
      expect(value).toEqual(27);
    });
    component.handleRemoveConfigMapRef(27);
  });

  it('should emit a true value when handleAddEnvSecretRef is called', () => {
    component.addEnvSecretRef.subscribe((value: boolean) => {
      expect(value).toBeDefined();
      expect(value).toEqual(true);
    });
    component.handleAddEnvSecretRef();
  });

  it('should emit a number when handleRemoveEnvSecretRef is called', () => {
    component.removeEnvSecretRef.subscribe((value: number) => {
      expect(value).toBeDefined();
      expect(value).toEqual(51);
    });
    component.handleRemoveEnvSecretRef(51);
  });

  it('should emit a true value when handleAddFieldRef is called', () => {
    component.addFieldRef.subscribe((value: boolean) => {
      expect(value).toBeDefined();
      expect(value).toEqual(true);
    });
    component.handleAddFieldRef();
  });

  it('should emit a number when handleRemoveFieldRef is called', () => {
    component.removeFieldRef.subscribe((value: number) => {
      expect(value).toBeDefined();
      expect(value).toEqual(63);
    });
    component.handleRemoveFieldRef(63);
  });

  it('should emit a true value when handleAddResourceFieldRef is called', () => {
    component.addResourceFieldRef.subscribe((value: boolean) => {
      expect(value).toBeDefined();
      expect(value).toEqual(true);
    });
    component.handleAddResourceFieldRef();
  });

  it('should emit a number when handleRemoveResourceFieldRef is called', () => {
    component.removeResourceFieldRef.subscribe((value: number) => {
      expect(value).toBeDefined();
      expect(value).toEqual(77);
    });
    component.handleRemoveResourceFieldRef(77);
  });

});
