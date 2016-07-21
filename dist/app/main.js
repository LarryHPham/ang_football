///<reference path="../typings/index.d.ts"/>
System.register(['@angular/platform-browser-dynamic', '@angular/router-deprecated', './app-domain/app.domain', './global/global-functions', './global/mlb-global-functions', './services/search.service', './services/draft-history.service', "@angular/core", 'rxjs/add/operator/map', "@angular/http"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var platform_browser_dynamic_1, router_deprecated_1, app_domain_1, global_functions_1, mlb_global_functions_1, search_service_1, draft_history_service_1, core_1, http_1;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (app_domain_1_1) {
                app_domain_1 = app_domain_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            },
            function (search_service_1_1) {
                search_service_1 = search_service_1_1;
            },
            function (draft_history_service_1_1) {
                draft_history_service_1 = draft_history_service_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (_1) {},
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            platform_browser_dynamic_1.bootstrap(app_domain_1.AppDomain, [
                router_deprecated_1.ROUTER_PROVIDERS,
                http_1.HTTP_PROVIDERS,
                router_deprecated_1.ROUTER_DIRECTIVES,
                global_functions_1.GlobalFunctions,
                mlb_global_functions_1.MLBGlobalFunctions,
                search_service_1.SearchService,
                core_1.provide(draft_history_service_1.DraftHistoryService, { useClass: draft_history_service_1.MLBDraftHistoryService }),
                core_1.provide(Window, { useValue: window })
            ]).catch(function (err) { return console.error(err); });
        }
    }
});
