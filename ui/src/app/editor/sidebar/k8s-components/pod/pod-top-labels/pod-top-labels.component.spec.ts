import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

import { PodTopLabelsComponent } from './pod-top-labels.component';

describe('PodTopLabelsComponent', () => {
  let component: PodTopLabelsComponent;
  let fixture: ComponentFixture<PodTopLabelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ PodTopLabelsComponent ],
      providers: [ FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(PodTopLabelsComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({ top_label: formBuilder.array([]) });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
