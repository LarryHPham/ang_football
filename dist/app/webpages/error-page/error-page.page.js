System.register(['@angular/core', '@angular/router-deprecated', '@angular/platform-browser', '../../global/global-settings', "../../components/sidekick-wrapper/sidekick-wrapper.component"], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, global_settings_1, sidekick_wrapper_component_1;
    var ErrorPage;
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
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            }],
        execute: function() {
            ErrorPage = (function () {
                function ErrorPage(_router, _title) {
                    var _this = this;
                    this._router = _router;
                    this._title = _title;
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Page Not Found"));
                    global_settings_1.GlobalSettings.getPartnerID(_router, function (partnerID) { return _this.loadData(partnerID); });
                }
                ErrorPage.prototype.loadData = function (partnerID) {
                    this.pageLink = global_settings_1.GlobalSettings.getHomePage(partnerID);
                    this.errorMessage = "Oops! That page doesn't exist! Try Refreshing or go to <a class='text-master' href='/'" + this.pageLink + "'> our home page</a>!";
                };
                ErrorPage = __decorate([
                    core_1.Component({
                        selector: 'Error-page',
                        templateUrl: './app/webpages/error-page/error-page.page.html',
                        directives: [sidekick_wrapper_component_1.SidekickWrapper],
                        providers: [platform_browser_1.Title],
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.Router, platform_browser_1.Title])
                ], ErrorPage);
                return ErrorPage;
            }());
            exports_1("ErrorPage", ErrorPage);
        }
    }
});
