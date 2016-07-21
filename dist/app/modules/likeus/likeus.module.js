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
    var LikeUs;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            }],
        execute: function() {
            LikeUs = (function () {
                function LikeUs() {
                    this.moduleTitle = {
                        moduleTitle: "Like Home Run Loyal on Facebook",
                        hasIcon: false,
                        iconClass: ""
                    };
                }
                LikeUs.prototype.ngOnInit = function () {
                    var FB = window['FB'];
                    var script = document.createElement("script");
                    if (FB !== undefined && FB !== null) {
                        window['FB'] = undefined; //remove FB element
                        //cjprieb: Beginning of the script removes the existing FB <script> element if it exists
                        // so that it can be re-added and therefore reloaded.
                        script.innerHTML = "\n              (function(d, s, id) {\n                var fbs = d.getElementById(id);\n                if (fbs) {\n                  fbs.parentNode.removeChild(fbs);\n                }\n\n                var js, fjs = d.getElementsByTagName(s)[0];\n                js = d.createElement(s); js.id = id;\n                js.src = \"//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6\";\n                fjs.parentNode.insertBefore(js, fjs);\n              }(document, 'script', 'facebook-jssdk'));\n          ";
                    }
                    else {
                        script.innerHTML = "\n              (function(d, s, id) {\n                var js, fjs = d.getElementsByTagName(s)[0];\n                if (d.getElementById(id)) return;\n                js = d.createElement(s); js.id = id;\n                js.src = \"//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6\";\n                fjs.parentNode.insertBefore(js, fjs);\n              }(document, 'script', 'facebook-jssdk'));\n          ";
                    }
                    document.body.appendChild(script);
                };
                LikeUs = __decorate([
                    core_1.Component({
                        selector: 'like-us-module',
                        templateUrl: './app/modules/likeus/likeus.module.html',
                        directives: [module_header_component_1.ModuleHeader],
                    }), 
                    __metadata('design:paramtypes', [])
                ], LikeUs);
                return LikeUs;
            }());
            exports_1("LikeUs", LikeUs);
        }
    }
});
