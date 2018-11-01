import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

import { K8sConfigmapComponent } from './k8s-configmap.component';
import { CustomValidators } from '../../../../../shared/validators/custom-validators.validators';

describe('K8sConfigmapComponent', () => {
  let component: K8sConfigmapComponent;
  let fixture: ComponentFixture<K8sConfigmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ K8sConfigmapComponent ],
      providers: [
        FormBuilder
      ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(K8sConfigmapComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({ configs: formBuilder.array([
      formBuilder.group({
        name: [{ value: 'hello', disabled: this.isReadOnly }, [
          Validators.required,
          CustomValidators.maxLength4096
        ]],
        map_name: [{ value: 'Goodbye', disabled: this.isReadOnly }, [
          // Validators here
        ]],
        default_mode: [{ value: '420', disabled: this.isReadOnly }, []],
        id: [{ value: '1234', disabled: true }]
      })
    ]) });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a boolean value of true when handleAddConfigmap is called', () => {
    component.addConfigmap.subscribe((value: boolean) => {
      expect(value).toBeDefined();
      expect(value).toBeTruthy();
    });
    component.handleAddConfigmap();
  });

  it('should emit a value of an index when handleRemoveConfigmap is called', () => {
    component.removeConfigmap.subscribe((value: string) => {
      expect(value).toBeDefined();
      expect(value).toEqual('12');
    });
    component.handleRemoveConfigmap('12');
  });

  // Need to instantiate test to check the configs that are returned.
  // it('should return an array of configmaps when get configmaps is called ', (inject([FormBuilder], (formBuilder: FormBuilder) => {
  //   const temp = formBuilder.group({
  //     name: [{ value: 'hello', disabled: this.isReadOnly }, [
  //       Validators.required,
  //       CustomValidators.maxLength4096
  //     ]],
  //     map_name: [{ value: 'Goodbye', disabled: this.isReadOnly }, [
  //       // Validators here
  //     ]],
  //     id: [{ value: '1234', disabled: true }]
  //   });
  //   const maps = component.configmaps;
  //   expect(maps).toEqual(temp.controls);
  // })));

});
