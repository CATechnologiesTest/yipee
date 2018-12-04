import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarnChangesModalComponent } from './warn-changes-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('WarnChangesModalComponent', () => {
  let component: WarnChangesModalComponent;
  let fixture: ComponentFixture<WarnChangesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarnChangesModalComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarnChangesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit true when onClose function is called', () => {
    component.onClose.subscribe((value: boolean) => {
      expect(value).toBeDefined();
      expect(value).toEqual(true);
    });
    component.navigateHome();
  });

  it('should emit false when onCancel function is called', () => {
    component.onCancel.subscribe((value: boolean) => {
      expect(value).toBeDefined();
      expect(value).toEqual(false);
    });
    component.cancel();
  });

});
