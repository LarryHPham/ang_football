System.register(['@angular/core', '@angular/router-deprecated', '@angular/platform-browser', "../app-webpage/app.webpage", "../app-webpage/app.mywebpage"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_deprecated_1, platform_browser_1, app_webpage_1, app_mywebpage_1;
    var AppDomain;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (app_webpage_1_1) {
                app_webpage_1 = app_webpage_1_1;
            },
            function (app_mywebpage_1_1) {
                app_mywebpage_1 = app_mywebpage_1_1;
            }],
        execute: function() {
            AppDomain = (function () {
                function AppDomain(_router, _ref) {
                    this._router = _router;
                    this._ref = _ref;
                    if (Object.prototype.toString.call(window['HTMLElement']).indexOf('Constructor') > 0) {
                        //we appear to be using safari
                        this._router.subscribe(function (route) {
                            _ref.zone.run(function () { return _ref.tick(); });
                        });
                    }
                    this._router.root.subscribe(function (route) {
                        // var routeItems = url.split('/');
                        //Only scroll to top if the page isn't the directory.
                        // if ( routeItems[1] != "directory" ) {
                        window.scrollTo(0, 0);
                        // }
                    });
                }
                AppDomain = __decorate([
                    core_1.Component({
                        selector: 'app-domain',
                        templateUrl: './app/app-domain/app.domain.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES],
                        providers: [platform_browser_1.Title]
                    }),
                    router_deprecated_1.RouteConfig([
                        {
                            path: '/...',
                            name: 'Default-home',
                            component: app_webpage_1.AppComponent,
                            useAsDefault: true
                        },
                        {
                            path: '/:partner_id/...',
                            name: 'Partner-home',
                            component: app_mywebpage_1.MyAppComponent,
                        },
                    ]), 
                    __metadata('design:paramtypes', [router_deprecated_1.Router, core_1.ApplicationRef])
                ], AppDomain);
                return AppDomain;
            }());
            exports_1("AppDomain", AppDomain);
        }
    }
});
