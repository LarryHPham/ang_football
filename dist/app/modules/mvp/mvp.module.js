System.register(['@angular/core', '../../components/module-footer/module-footer.component', '../../components/module-header/module-header.component', '../../components/mvp-list/mvp-list.component', '../../components/loading/loading.component'], function(exports_1, context_1) {
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
    var core_1, module_footer_component_1, module_header_component_1, mvp_list_component_1, loading_component_1;
    var MVPModule;
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
            function (mvp_list_component_1_1) {
                mvp_list_component_1 = mvp_list_component_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            }],
        execute: function() {
            MVPModule = (function () {
                function MVPModule() {
                    this.tabSelectedListener = new core_1.EventEmitter();
                }
                MVPModule.prototype.ngOnChanges = function () {
                    this.displayData();
                };
                MVPModule.prototype.displayData = function () {
                    this.modHeadData = {
                        moduleTitle: "Most Valuable " + this.title + " - MLB",
                        hasIcon: false,
                        iconClass: '',
                    };
                    var type = this.query.listname.indexOf("pitcher") >= 0 ? "pitcher" : "batter";
                    var url;
                    if (this.tabKey) {
                        url = ['MVP-list-tab-page', {
                                tab: this.tabKey,
                                type: type,
                                pageNum: "1"
                            }];
                    }
                    else {
                        url = ['MVP-list-page', {
                                type: type,
                                pageNum: "1"
                            }];
                    }
                    this.footerData = {
                        infoDesc: 'Want to see everybody involved in this list?',
                        text: 'VIEW THE LIST',
                        url: url
                    };
                };
                MVPModule.prototype.tabSelected = function (tab) {
                    this.tabKey = tab.tabDataKey;
                    if (!tab.listData) {
                        this.tabSelectedListener.next(tab);
                    }
                    else {
                        this.displayData();
                    }
                };
                __decorate([
                    core_1.Output("tabSelected"), 
                    __metadata('design:type', Object)
                ], MVPModule.prototype, "tabSelectedListener", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], MVPModule.prototype, "mvpData", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], MVPModule.prototype, "title", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], MVPModule.prototype, "query", void 0);
                MVPModule = __decorate([
                    core_1.Component({
                        selector: 'mvp-module',
                        templateUrl: './app/modules/mvp/mvp.module.html',
                        directives: [mvp_list_component_1.MVPListComponent, module_header_component_1.ModuleHeader, module_footer_component_1.ModuleFooter, loading_component_1.LoadingComponent],
                        providers: [],
                        inputs: ['mvpData', 'title']
                    }), 
                    __metadata('design:paramtypes', [])
                ], MVPModule);
                return MVPModule;
            }());
            exports_1("MVPModule", MVPModule);
        }
    }
});
