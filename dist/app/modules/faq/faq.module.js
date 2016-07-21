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
    var FAQModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            }],
        execute: function() {
            FAQModule = (function () {
                function FAQModule() {
                    this.faqSelected = new core_1.EventEmitter();
                    this.headerInfo = {
                        moduleTitle: "FAQ - [Profile Name]",
                        hasIcon: false,
                        iconClass: ""
                    };
                }
                FAQModule.prototype.isSelected = function (faqData) {
                    faqData.active = !faqData.active;
                    this.faqData.forEach(function (faqData) { return faqData.active = false; });
                    faqData.active = true;
                    this.faqSelected.emit(faqData.question);
                };
                FAQModule.prototype.ngOnChanges = function () {
                    var profileName = this.profileName ? this.profileName : "MLB";
                    this.headerInfo.moduleTitle = "FAQ - " + profileName;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FAQModule.prototype, "profileName", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], FAQModule.prototype, "faqData", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], FAQModule.prototype, "faqSelected", void 0);
                FAQModule = __decorate([
                    core_1.Component({
                        selector: 'faq-module',
                        templateUrl: './app/modules/faq/faq.module.html',
                        directives: [module_header_component_1.ModuleHeader],
                    }), 
                    __metadata('design:paramtypes', [])
                ], FAQModule);
                return FAQModule;
            }());
            exports_1("FAQModule", FAQModule);
        }
    }
});
