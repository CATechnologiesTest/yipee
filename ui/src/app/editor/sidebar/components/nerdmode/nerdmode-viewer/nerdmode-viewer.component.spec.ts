import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NerdmodeViewerComponent } from './nerdmode-viewer.component';

describe('ViewerComponent', () => {
  let component: NerdmodeViewerComponent;
  let fixture: ComponentFixture<NerdmodeViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NerdmodeViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NerdmodeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
