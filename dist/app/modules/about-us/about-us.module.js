System.register(['@angular/core', "../../components/module-header/module-header.component", "../../components/flip-tiles/flip-tiles.component", '../../global/global-functions', '@angular/router-deprecated'], function(exports_1, context_1) {
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
    var core_1, module_header_component_1, flip_tiles_component_1, global_functions_1, router_deprecated_1;
    var AboutUsModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            },
            function (flip_tiles_component_1_1) {
                flip_tiles_component_1 = flip_tiles_component_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            }],
        execute: function() {
            AboutUsModule = (function () {
                function AboutUsModule() {
                    this.homePageLinkName = "homerunloyal";
                    this.headerText = "Disclaimer";
                    this.buttonText = 'See The Full Disclaimer';
                }
                AboutUsModule.prototype.ngOnChanges = function () {
                    this.loadData(this.partnerID);
                };
                AboutUsModule.prototype.loadData = function (partnerID) {
                    if (partnerID != null) {
                        this.homePageLinkName = "www.myhomerunzone.com/" + partnerID;
                        this.pageName = "My Home Run Zone";
                        this.logoUrl = '/app/public/Logo_My-Home-Run-Zone.svg';
                    }
                    else {
                        this.homePageLinkName = "www.homerunloyal.com";
                        this.pageName = "Home Run Loyal";
                        this.logoUrl = '/app/public/Logo_Home-Run-Loyal.png';
                    }
                    this.headerText = global_functions_1.GlobalFunctions.convertToPossessive(this.pageName) + ' Disclaimer';
                    this.moduleHeader = {
                        moduleTitle: 'Learn More About ' + this.pageName,
                        hasIcon: false,
                        iconClass: ''
                    };
                    this.aboutUsData = [{
                            buttonText: 'Open Page',
                            routerInfo: ['About-us-page'],
                            faIcon: 'fa-info-circle',
                            title: 'About',
                            description: 'What is ' + this.pageName + '?',
                        },
                        {
                            buttonText: 'Open Page',
                            routerInfo: ['Contact-us-page'],
                            faIcon: 'fa-phone',
                            title: 'Contact Us',
                            description: 'Help us help you faster.',
                        },
                        {
                            buttonText: 'Open Page',
                            routerInfo: ['Disclaimer-page'],
                            faIcon: 'fa-folder-open-o',
                            title: 'Disclaimer',
                            description: 'Read the full disclaimer.'
                        }];
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], AboutUsModule.prototype, "partnerID", void 0);
                AboutUsModule = __decorate([
                    core_1.Component({
                        selector: 'about-us',
                        templateUrl: './app/modules/about-us/about-us.module.html',
                        directives: [module_header_component_1.ModuleHeader, flip_tiles_component_1.FlipTilesComponent, router_deprecated_1.ROUTER_DIRECTIVES],
                        providers: []
                    }), 
                    __metadata('design:paramtypes', [])
                ], AboutUsModule);
                return AboutUsModule;
            }());
            exports_1("AboutUsModule", AboutUsModule);
        }
    }
});
