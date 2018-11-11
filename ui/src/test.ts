// This file is required by karma.conf.js and loads recursively all the .spec and framework files

// import 'zone.js/dist/long-stack-trace-zone';
// import 'zone.js/dist/proxy.js';
// import 'zone.js/dist/sync-test';
// import 'zone.js/dist/async-test';
// import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/zone';  // Included with Angular CLI.

(window as any)['__zone_symbol__fakeAsyncPatchLock'] = true;
import 'zone.js/dist/zone-testing';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;
declare const require: any;

const tags = __karma__.config.args[0];

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
// const context = require.context('./', true, /\.spec\.ts$/);

// then we find all the tests.
const filterRegExp = (tags) ? new RegExp(tags, 'g') : /\.spec\.ts$/,
    context = require.context('./', true, /\.spec\.ts$/),
    specFiles = context.keys().filter(path => filterRegExp.test(path));
specFiles.map(context);
// And load the modules.
// context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();
