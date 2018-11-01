import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sServiceContainerPortsComponent } from './k8s-service-container-ports.component';

describe('K8sServiceServicePortsComponent', () => {
  let component: K8sServiceContainerPortsComponent;
  let fixture: ComponentFixture<K8sServiceContainerPortsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ K8sServiceContainerPortsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sServiceContainerPortsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
