import { HomeComponent } from './home.component';
import { ComponentFixture, async, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NamespaceService } from '../shared/services/namespace.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from '../shared/services/api.service';
import { DownloadService } from '../shared/services/download.service';
import { Location } from '@angular/common';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          HomeComponent
        ],
        schemas: [NO_ERRORS_SCHEMA],

        imports: [
          HttpClientModule,
          HttpClientTestingModule,
          RouterTestingModule
        ],
        providers: [
          NamespaceService,
          ApiService,
          DownloadService,
          Location
        ]
      })
        .compileComponents();
      location = TestBed.get(Location);
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
    });

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    }));

    it('should be created and on destroy the timer should be cleaned up', fakeAsync(inject([HttpTestingController],
        (backend: HttpTestingController) => {

      fixture.detectChanges();
      expect(component).toBeTruthy();
      backend.expectOne('/api/namespaces').flush({
        success: false,
        total: 1,
        data: [{name: 'foo'}]
      });
      fixture.destroy();

    })));

});
