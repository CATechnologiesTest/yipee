import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { PodExtraHostsComponent } from './pod-extra-hosts.component';

describe('PodExtraHostsComponent', () => {
  let component: PodExtraHostsComponent;
  let fixture: ComponentFixture<PodExtraHostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ PodExtraHostsComponent ],
      providers: [ FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(PodExtraHostsComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({ extra_hosts: formBuilder.array([]) });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
