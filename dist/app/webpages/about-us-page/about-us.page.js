System.register(['@angular/core', '@angular/router-deprecated', '@angular/platform-browser', '../../components/backtab/backtab.component', '../../components/title/title.component', "../../modules/widget/widget.module", '../../services/about-us.service', '../../global/global-settings', "../../components/images/circle-image", "../../components/sidekick-wrapper/sidekick-wrapper.component", '../../components/responsive-widget/responsive-widget.component'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, backtab_component_1, title_component_1, widget_module_1, about_us_service_1, global_settings_1, circle_image_1, sidekick_wrapper_component_1, responsive_widget_component_1;
    var AboutUsPage;
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
            function (about_us_service_1_1) {
                about_us_service_1 = about_us_service_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            },
            function (responsive_widget_component_1_1) {
                responsive_widget_component_1 = responsive_widget_component_1_1;
            }],
        execute: function() {
            AboutUsPage = (function () {
                function AboutUsPage(_router, _service, _title) {
                    var _this = this;
                    this._router = _router;
                    this._service = _service;
                    this._title = _title;
                    this.widgetPlace = "widgetForPage";
                    this.auHeaderTitle = "What is the site about?";
                    this.auBlocks = [];
                    this.auContent = [];
                    this.titleData = {
                        imageURL: global_settings_1.GlobalSettings.getSiteLogoUrl(),
                        text1: 'Last Updated: [date]',
                        text2: 'United States',
                        text3: 'Want to learn more?',
                        text4: '',
                        icon: 'fa fa-map-marker'
                    };
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle("About Us"));
                    global_settings_1.GlobalSettings.getPartnerID(_router, function (partnerID) { return _this.loadData(partnerID); });
                }
                AboutUsPage.prototype.loadData = function (partnerID) {
                    var _this = this;
                    this._service.getData(partnerID).subscribe(function (data) { return _this.setupAboutUsData(data); }, function (err) {
                        console.log("Error getting About Us data: " + err);
                    });
                };
                AboutUsPage.prototype.setupAboutUsData = function (data) {
                    if (data !== undefined && data !== null) {
                        this.auBlocks = data.blocks;
                        this.auHeaderTitle = data.headerTitle;
                        this.titleData = data.titleData;
                        this.auContent = data.content;
                    }
                };
                AboutUsPage = __decorate([
                    core_1.Component({
                        selector: 'About-us-page',
                        templateUrl: './app/webpages/about-us-page/about-us.page.html',
                        directives: [sidekick_wrapper_component_1.SidekickWrapper, circle_image_1.CircleImage, backtab_component_1.BackTabComponent, title_component_1.TitleComponent, widget_module_1.WidgetModule, router_deprecated_1.ROUTER_DIRECTIVES, responsive_widget_component_1.ResponsiveWidget],
                        providers: [about_us_service_1.AboutUsService, platform_browser_1.Title],
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.Router, about_us_service_1.AboutUsService, platform_browser_1.Title])
                ], AboutUsPage);
                return AboutUsPage;
            }());
            exports_1("AboutUsPage", AboutUsPage);
        }
    }
});
