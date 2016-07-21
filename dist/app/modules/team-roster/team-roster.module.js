System.register(['@angular/core', '../../components/module-header/module-header.component', '../../components/module-footer/module-footer.component', "../../components/roster/roster.component"], function(exports_1, context_1) {
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
    var core_1, module_header_component_1, module_footer_component_1, roster_component_1;
    var TeamRosterModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            },
            function (module_footer_component_1_1) {
                module_footer_component_1 = module_footer_component_1_1;
            },
            function (roster_component_1_1) {
                roster_component_1 = roster_component_1_1;
            }],
        execute: function() {
            TeamRosterModule = (function () {
                function TeamRosterModule() {
                    this.headerInfo = {
                        moduleTitle: "Team Roster",
                        hasIcon: false,
                        iconClass: ""
                    };
                    this.footerInfo = {
                        infoDesc: "Want to see the full team roster?",
                        text: "VIEW FULL ROSTER",
                        url: ['Team-roster-page']
                    };
                }
                TeamRosterModule.prototype.ngOnChanges = function () {
                    if (!this.data) {
                        this.headerInfo.moduleTitle = "Team Roster";
                    }
                    else {
                        this.headerInfo.moduleTitle = this.data.moduleTitle;
                        this.footerInfo.url = this.data.pageRouterLink;
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TeamRosterModule.prototype, "data", void 0);
                TeamRosterModule = __decorate([
                    core_1.Component({
                        selector: 'team-roster-module',
                        templateUrl: './app/modules/team-roster/team-roster.module.html',
                        directives: [roster_component_1.RosterComponent,
                            module_header_component_1.ModuleHeader,
                            module_footer_component_1.ModuleFooter]
                    }), 
                    __metadata('design:paramtypes', [])
                ], TeamRosterModule);
                return TeamRosterModule;
            }());
            exports_1("TeamRosterModule", TeamRosterModule);
        }
    }
});
