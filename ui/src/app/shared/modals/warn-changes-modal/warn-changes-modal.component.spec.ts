import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarnChangesModalComponent } from './warn-changes-modal.component';

describe('WarnChangesModalComponent', () => {
  let component: WarnChangesModalComponent;
  let fixture: ComponentFixture<WarnChangesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarnChangesModalComponent ]
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
});
