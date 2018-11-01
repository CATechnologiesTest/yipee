import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { PodImagePullSecretsComponent } from './pod-image-pull-secrets.component';

describe('PodImagePullSecretsComponent', () => {
  let component: PodImagePullSecretsComponent;
  let fixture: ComponentFixture<PodImagePullSecretsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ PodImagePullSecretsComponent ],
      providers: [ FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(PodImagePullSecretsComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({ image_pull_secrets: formBuilder.array([]) });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
