import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

import { K8sHelmComponent } from './k8s-helm.component';

describe('K8sSecretsComponent', () => {
  let component: K8sHelmComponent;
  let fixture: ComponentFixture<K8sHelmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ K8sHelmComponent ],
      providers: [
        FormBuilder
      ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(K8sHelmComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({ secrets: formBuilder.array([]) });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
