import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclaimerModalComponent } from './disclaimer-modal.component';

describe('DisclaimerModalComponent', () => {
  let component: DisclaimerModalComponent;
  let fixture: ComponentFixture<DisclaimerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisclaimerModalComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclaimerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cancel', () => {
    expect(component).toBeTruthy();
    component.onClose.subscribe(value => {
      expect(value).toBeFalsy();
    });
    component.closeDisclaimer();
  });
});
