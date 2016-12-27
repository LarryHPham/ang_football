import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UniversalModule, isBrowser, isNode } from 'angular2-universal/node'; // for AoT we need to manually split universal packages

// import { AppModule, AppComponent } from './+app/app.module'; //TODO
import { AppModule, AppDomain } from './app/ngModules/app.ngmodule';
import { GlobalModule } from './app/ngModules/global.ngmodule';
import { ProfileNgModule } from './app/ngModules/profile.ngmodule';
import { DeepDiveNgModule } from './app/ngModules/deep-dive.ngmodule';

// Will be merged into @angular/platform-browser in a later release
// see https://github.com/angular/angular/pull/12322
import { Meta } from './angular2-meta';

export function getLRU() {
  return new Map();
}
export function getRequest() {
  return Zone.current.get('req') || {};
}
export function getResponse() {
  return Zone.current.get('res') || {};
}

@NgModule({
  bootstrap: [ AppDomain ],
  imports: [
    // MaterialModule.forRoot() should be included first

    FormsModule,
    RouterModule.forRoot([], { useHash: false }),
    GlobalModule.forRoot(),
    ProfileNgModule.forRoot(),
    DeepDiveNgModule.forRoot(),

    AppModule,
    UniversalModule, // BrowserModule, HttpModule, and JsonpModule are included
  ],
  providers: [
    { provide: 'isBrowser', useValue: isBrowser },
    { provide: 'isNode', useValue: isNode },

    { provide: 'req', useFactory: getRequest },
    { provide: 'res', useFactory: getResponse },

    { provide: 'LRU', useFactory: getLRU, deps: [] },

    Meta,
  ]
})
export class MainModule {

}
