import {XHRBackend, Http, RequestOptions} from '@angular/http';
import { HttpInterceptorService } from './http-interceptor.service';

export function httpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions): Http {
    return new HttpInterceptorService(xhrBackend, requestOptions);
}
