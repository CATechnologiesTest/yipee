import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { CloseAppModalComponent } from './close-app-modal.component';
import { YipeeFileResponse } from '../../../models/YipeeFileResponse';
import { YipeeFileMetadata } from '../../../models/YipeeFileMetadata';
import { YipeeFileService } from '../../services/yipee-file.service';
import { YipeeFileMetadataRaw } from '../../../models/YipeeFileMetadataRaw';

const yipeeFileRaw: YipeeFileMetadataRaw = {
  _id: '5551212',
  name: 'string',
  author: 'string',
  username: 'string',
  containers: ['one'],
  downloads: 5,
  likes: 1,
  canvasdata: null,
  revcount: 5,
  ownerorg: 'string',
  fullname: 'string',
  orgname: 'string',
  isPrivate: false,
  dateCreated: new Date().toDateString(),
  dateModified: new Date().toDateString(),
  id: '5551212',
  hasLogo: false,
  flatFile: []
};
const metadata = new YipeeFileMetadata(yipeeFileRaw);

describe('CloseAppModalComponent', () => {
  let component: CloseAppModalComponent;
  let fixture: ComponentFixture<CloseAppModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CloseAppModalComponent
      ],
      imports: [
        HttpModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseAppModalComponent);
    component = fixture.componentInstance;
    component.metadata = metadata;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cancel', () => {
    expect(component).toBeTruthy();
    component.onCancel.subscribe(value => {
      expect(value).toBeFalsy();
    });
    component.cancelClose();
  });

  it('should call ignore', () => {
    expect(component).toBeTruthy();
    component.ignoreChanges();
  });

});
