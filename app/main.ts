// ///<reference path="../typings/index.d.ts"/>
//
// import {AppDomain} from './app-domain/app.domain';
// import {GlobalFunctions} from './global/global-functions';
// import {GlobalSettings} from './global/global-settings';
// import {VerticalGlobalFunctions} from './global/vertical-global-functions';
// import {SearchService} from './services/search.service';
// import {DraftHistoryService, MLBDraftHistoryService} from './services/draft-history.service'; //testing a proof of concept
// import {provide} from "@angular/core";
//
// //For Seo Services and angular 2 services
// import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
// import {bootstrap} from '@angular/platform-browser-dynamic';
// import {Title} from '@angular/platform-browser';
// import {SeoService} from "./seo.service";
//
// // Needed for http map on observables
// import 'rxjs/add/operator/map';
// import {HTTP_PROVIDERS} from "@angular/http";
// import {enableProdMode} from '@angular/core';
//
//
// // enable production mode and thus disable debugging information
// if(GlobalSettings.isProd()) {
//     enableProdMode();
// }
//
// bootstrap(AppDomain, [
//     Title,
//     SeoService,
//     ROUTER_PROVIDERS,
//     HTTP_PROVIDERS,
//     ROUTER_DIRECTIVES,
//     GlobalFunctions,
//     VerticalGlobalFunctions,
//     SearchService,
//     provide(DraftHistoryService, {useClass: MLBDraftHistoryService}),
//     provide(Window, {useValue: window})
// ]).catch(err => console.error(err));

///<reference path="../typings/index.d.ts"/>

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './ngModules/app.ngmodule';
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
