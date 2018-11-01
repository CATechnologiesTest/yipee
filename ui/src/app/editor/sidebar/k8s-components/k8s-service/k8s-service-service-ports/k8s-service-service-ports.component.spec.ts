import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { K8sServiceServicePortsComponent } from './k8s-service-service-ports.component';

describe('K8sServiceServicePortsComponent', () => {
  let component: K8sServiceServicePortsComponent;
  let fixture: ComponentFixture<K8sServiceServicePortsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ K8sServiceServicePortsComponent ],
      providers: [
        FormBuilder
      ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(K8sServiceServicePortsComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({ service_port_mapping: formBuilder.array([]) });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
