import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

import { ContainerConfigsComponent } from './container-configs.component';

describe('ContainerSecretsComponent', () => {
  let component: ContainerConfigsComponent;
  let fixture: ComponentFixture<ContainerConfigsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ ContainerConfigsComponent ],
      providers: [ FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(ContainerConfigsComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({ config_ref: formBuilder.array([]) });
    component.configOptions = [];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
