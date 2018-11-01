import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvBulkAddModalComponent } from './env-bulk-add-modal.component';

describe('EnvBulkAddModalComponent', () => {
  let component: EnvBulkAddModalComponent;
  let fixture: ComponentFixture<EnvBulkAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EnvBulkAddModalComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvBulkAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
