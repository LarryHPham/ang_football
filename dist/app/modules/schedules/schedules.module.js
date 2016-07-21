System.register(['@angular/core', '../../components/module-footer/module-footer.component', '../../components/module-header/module-header.component', '../../components/schedules/schedules.component', '@angular/router-deprecated', '../../global/global-functions'], function(exports_1, context_1) {
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
    var core_1, module_footer_component_1, module_header_component_1, schedules_component_1, router_deprecated_1, global_functions_1;
    var SchedulesModule;
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
            function (schedules_component_1_1) {
                schedules_component_1 = schedules_component_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            }],
        execute: function() {
            SchedulesModule = (function () {
                function SchedulesModule(params) {
                    this.params = params;
                    this.tabSelectedListener = new core_1.EventEmitter();
                }
                SchedulesModule.prototype.ngOnInit = function () {
                    this.modHeadData = {
                        moduleTitle: "Weekly Schedules - " + this.profHeader.profileName,
                        hasIcon: false,
                        iconClass: '',
                    };
                    if (typeof this.params.get('teamId') != 'undefined' && this.params.get('teamId') !== null) {
                        this.footerData = {
                            infoDesc: 'Want to see the full season schedule?',
                            text: 'VIEW SCHEDULE',
                            url: ['Schedules-page-team', { teamName: global_functions_1.GlobalFunctions.toLowerKebab(this.profHeader.profileName), teamId: this.params.get('teamId'), pageNum: 1 }]
                        };
                    }
                    else {
                        this.footerData = {
                            infoDesc: 'Want to see the full season schedule?',
                            text: 'VIEW SCHEDULE',
                            url: ['Schedules-page-league', { pageNum: 1 }]
                        };
                    }
                };
                SchedulesModule.prototype.ngOnChanges = function () {
                    if (typeof this.data != 'undefined') {
                        if (typeof this.tabData == 'undefined') {
                            this.tabData = this.data.tabs;
                        }
                    }
                };
                SchedulesModule.prototype.tabSelected = function (tab) {
                    this.tabSelectedListener.next(tab);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SchedulesModule.prototype, "data", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SchedulesModule.prototype, "profHeader", void 0);
                __decorate([
                    core_1.Output("tabSelected"), 
                    __metadata('design:type', Object)
                ], SchedulesModule.prototype, "tabSelectedListener", void 0);
                SchedulesModule = __decorate([
                    core_1.Component({
                        selector: 'schedules',
                        templateUrl: './app/modules/schedules/schedules.module.html',
                        directives: [schedules_component_1.SchedulesComponent, module_header_component_1.ModuleHeader, module_footer_component_1.ModuleFooter],
                        providers: [],
                        inputs: ['']
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.RouteParams])
                ], SchedulesModule);
                return SchedulesModule;
            }());
            exports_1("SchedulesModule", SchedulesModule);
        }
    }
});
