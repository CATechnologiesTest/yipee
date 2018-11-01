import { TestBed, inject } from '@angular/core/testing';
import { HttpModule, Http, XHRBackend, RequestOptions, ConnectionBackend } from '@angular/http';


import { HttpInterceptorService } from './http-interceptor.service';
import { httpFactory } from './http-interceptor-factory';

describe('HttpInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: Http,
          useFactory: httpFactory,
          deps: [XHRBackend, RequestOptions]
        },
        HttpInterceptorService,
        ConnectionBackend
      ]
    });
  });

  it('should be created', inject([HttpInterceptorService], (service: HttpInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
