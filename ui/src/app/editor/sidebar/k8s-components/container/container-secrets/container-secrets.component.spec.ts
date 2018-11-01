import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

import { ContainerSecretsComponent } from './container-secrets.component';

describe('ContainerSecretsComponent', () => {
  let component: ContainerSecretsComponent;
  let fixture: ComponentFixture<ContainerSecretsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ ContainerSecretsComponent ],
      providers: [ FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(ContainerSecretsComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({ k8s_secret_ref: formBuilder.array([]) });
    component.secretOptions = [];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
