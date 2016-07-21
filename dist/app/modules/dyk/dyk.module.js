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
    var DYKModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            }],
        execute: function() {
            DYKModule = (function () {
                function DYKModule() {
                    this.locateShareThis = function () {
                        stButtons.locateElements();
                    };
                    this.headerInfo = {
                        moduleTitle: "Did You Know - [Profile Name]",
                        hasIcon: false,
                        iconClass: ""
                    };
                }
                DYKModule.prototype.ngOnChanges = function (event) {
                    var profileName = this.profileName ? this.profileName : "MLB";
                    this.headerInfo.moduleTitle = "Did You Know - " + profileName;
                }; //ngOnChanges ends
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], DYKModule.prototype, "profileName", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], DYKModule.prototype, "dykData", void 0);
                DYKModule = __decorate([
                    core_1.Component({
                        selector: 'dyk-module',
                        templateUrl: './app/modules/dyk/dyk.module.html',
                        directives: [module_header_component_1.ModuleHeader],
                    }), 
                    __metadata('design:paramtypes', [])
                ], DYKModule);
                return DYKModule;
            }());
            exports_1("DYKModule", DYKModule);
        }
    }
});
