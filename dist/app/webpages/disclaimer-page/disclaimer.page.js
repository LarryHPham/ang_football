System.register(['@angular/core', '@angular/router-deprecated', '@angular/platform-browser', '../../components/backtab/backtab.component', '../../components/title/title.component', "../../modules/widget/widget.module", '../../global/global-settings', '../../global/global-functions', "../../components/sidekick-wrapper/sidekick-wrapper.component", '../../components/responsive-widget/responsive-widget.component'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, backtab_component_1, title_component_1, widget_module_1, global_settings_1, global_functions_1, sidekick_wrapper_component_1, responsive_widget_component_1;
    var DisclaimerPage;
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
            function (backtab_component_1_1) {
                backtab_component_1 = backtab_component_1_1;
            },
            function (title_component_1_1) {
                title_component_1 = title_component_1_1;
            },
            function (widget_module_1_1) {
                widget_module_1 = widget_module_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            },
            function (responsive_widget_component_1_1) {
                responsive_widget_component_1 = responsive_widget_component_1_1;
            }],
        execute: function() {
            DisclaimerPage = (function () {
                function DisclaimerPage(_router, _title) {
                    var _this = this;
                    this._router = _router;
                    this._title = _title;
                    this.widgetPlace = "widgetForPage";
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Disclaimer"));
                    global_settings_1.GlobalSettings.getPartnerID(_router, function (partnerID) { return _this.loadData(partnerID); });
                }
                DisclaimerPage.prototype.loadData = function (partnerID) {
                    this.pageLinkName = global_settings_1.GlobalSettings.getHomePage(partnerID).replace(/https?:\/\//, "");
                    this.pageName = partnerID ? "My Home Run Zone" : "Home Run Loyal";
                    this.titleData = {
                        imageURL: global_settings_1.GlobalSettings.getSiteLogoUrl(),
                        text1: 'Last Updated: Monday, March 21, 2016.',
                        text2: ' United States',
                        text3: global_functions_1.GlobalFunctions.convertToPossessive(this.pageName) + " Disclaimer",
                        text4: '',
                        icon: 'fa fa-map-marker'
                    };
                    var subpath = this._router.generate(["Contact-us-page"]).toRootUrl();
                    this.contactUsLinkName = this.pageLinkName + (subpath.charAt(0) == "/" ? "" : "/") + subpath;
                };
                DisclaimerPage = __decorate([
                    core_1.Component({
                        selector: 'Disclaimer-page',
                        templateUrl: './app/webpages/disclaimer-page/disclaimer.page.html',
                        directives: [sidekick_wrapper_component_1.SidekickWrapper, backtab_component_1.BackTabComponent, title_component_1.TitleComponent, widget_module_1.WidgetModule, router_deprecated_1.ROUTER_DIRECTIVES, responsive_widget_component_1.ResponsiveWidget],
                        providers: [platform_browser_1.Title],
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.Router, platform_browser_1.Title])
                ], DisclaimerPage);
                return DisclaimerPage;
            }());
            exports_1("DisclaimerPage", DisclaimerPage);
        }
    }
});
