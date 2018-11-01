import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

import { EditorModule } from './editor/editor.module';
import { HomeModule } from './home/home.module';

import { CanDeactivateGuard } from './can-deactivate.guard';

import { httpFactory } from './http-interceptor-factory';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  { path: '', loadChildren: 'app/home/home.module#HomeModule' },
  { path: 'editor', loadChildren: 'app/editor/editor.module#EditorModule' }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClarityModule.forRoot(),
    HomeModule,
    EditorModule,
    RouterModule.forRoot(appRoutes),
    SharedModule.forRoot(),
    HttpModule,
    MomentModule,
    NgIdleKeepaliveModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    HttpClientModule,
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions]
    },
    CanDeactivateGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
