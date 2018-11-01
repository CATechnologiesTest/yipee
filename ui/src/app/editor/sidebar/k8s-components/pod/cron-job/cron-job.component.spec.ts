import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';

import { CronJobComponent } from './cron-job.component';

describe('CronJobComponent', () => {
  let component: CronJobComponent;
  let fixture: ComponentFixture<CronJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ CronJobComponent ],
      providers: [ FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(CronJobComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({
      backoffLimit: '',
      activeDeadlineSeconds: '',
      startingDeadlineSeconds: '',
      completions: '',
      parallelism: '',
      concurrencyPolicy: '',
      schedule: ''
    });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
