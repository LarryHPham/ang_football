System.register(['@angular/core', '../../components/module-header/module-header.component'], function(exports_1, context_1) {
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
    var core_1, module_header_component_1;
    var TwitterModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            }],
        execute: function() {
            TwitterModule = (function () {
                function TwitterModule() {
                    this.twitterLoaded = false;
                    this.headerInfo = {
                        moduleTitle: "Twitter Feed - [Profile Name]",
                        hasIcon: false,
                        iconClass: ""
                    };
                }
                TwitterModule.prototype.ngAfterContentChecked = function () {
                    if (window['twttr'] && !this.twitterLoaded) {
                        if (document.getElementById("twitter-href")) {
                            var a = document.getElementById("twitter-href");
                            window['twttr'].widgets.load();
                            this.twitterLoaded = true;
                        }
                    }
                };
                TwitterModule.prototype.ngOnChanges = function () {
                    var profileName = this.profileName ? this.profileName : "[Profile Name]";
                    this.headerInfo.moduleTitle = "Twitter Feed - " + profileName;
                };
                TwitterModule.prototype.ngOnInit = function () {
                    var script = document.createElement("script");
                    script.innerHTML = !function (d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
                        if (!d.getElementById(id)) {
                            js = d.createElement(s);
                            js.id = id;
                            js.src = p + "://platform.twitter.com/widgets.js";
                            fjs.parentNode.insertBefore(js, fjs);
                        }
                    }(document, "script", "twitter-wjs");
                    document.body.appendChild(script);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], TwitterModule.prototype, "profileName", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TwitterModule.prototype, "twitterData", void 0);
                TwitterModule = __decorate([
                    core_1.Component({
                        selector: 'twitter-module',
                        templateUrl: './app/modules/twitter/twitter.module.html',
                        directives: [module_header_component_1.ModuleHeader],
                    }), 
                    __metadata('design:paramtypes', [])
                ], TwitterModule);
                return TwitterModule;
            }());
            exports_1("TwitterModule", TwitterModule);
        }
    }
});
