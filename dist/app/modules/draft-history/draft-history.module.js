System.register(['@angular/core', '../../components/module-footer/module-footer.component', '../../components/module-header/module-header.component', "../../components/draft-history/draft-history.component"], function(exports_1, context_1) {
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
    var core_1, module_footer_component_1, module_header_component_1, draft_history_component_1;
    var DraftHistoryModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (module_footer_component_1_1) {
                module_footer_component_1 = module_footer_component_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            },
            function (draft_history_component_1_1) {
                draft_history_component_1 = draft_history_component_1_1;
            }],
        execute: function() {
            DraftHistoryModule = (function () {
                function DraftHistoryModule() {
                }
                DraftHistoryModule.prototype.ngOnInit = function () {
                    if (this.profileData != null) {
                        this.displayData();
                    }
                };
                DraftHistoryModule.prototype.displayData = function () {
                    var pageRoute = this.profileData.profileType == "team" ?
                        ['Draft-history-page', { teamName: this.profileData.profileName, teamId: this.profileData.profileId }] :
                        ["Draft-history-mlb-page"];
                    this.footerData = {
                        infoDesc: 'Want to see everybody involved in this list?',
                        text: 'VIEW THE LIST',
                        url: pageRoute
                    };
                    this.modHeadData = {
                        moduleTitle: "Draft History - " + this.profileData.profileName,
                        hasIcon: false,
                        iconClass: '',
                    };
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DraftHistoryModule.prototype, "profileData", void 0);
                DraftHistoryModule = __decorate([
                    core_1.Component({
                        selector: 'draft-history-module',
                        templateUrl: './app/modules/draft-history/draft-history.module.html',
                        directives: [draft_history_component_1.DraftHistoryComponent, module_header_component_1.ModuleHeader, module_footer_component_1.ModuleFooter]
                    }), 
                    __metadata('design:paramtypes', [])
                ], DraftHistoryModule);
                return DraftHistoryModule;
            }());
            exports_1("DraftHistoryModule", DraftHistoryModule);
        }
    }
});
