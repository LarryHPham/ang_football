System.register(['@angular/core', '../../components/module-header/module-header.component', '../../components/module-footer/module-footer.component', '../../components/player-stats/player-stats.component'], function(exports_1, context_1) {
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
    var core_1, module_header_component_1, module_footer_component_1, player_stats_component_1;
    var PlayerStatsModule;
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
            function (player_stats_component_1_1) {
                player_stats_component_1 = player_stats_component_1_1;
            }],
        execute: function() {
            PlayerStatsModule = (function () {
                function PlayerStatsModule() {
                    this.tabSelectedListener = new core_1.EventEmitter();
                    this.headerInfo = {
                        moduleTitle: "Player Stats",
                        hasIcon: false,
                        iconClass: ""
                    };
                    this.footerInfo = {
                        infoDesc: "Want to see more player statistics?",
                        text: "VIEW FULL STATISTICS",
                        url: ['Player-stats-page']
                    };
                }
                PlayerStatsModule.prototype.ngOnChanges = function () {
                    if (!this.data) {
                        this.headerInfo.moduleTitle = "Player Stats";
                    }
                    else {
                        this.headerInfo.moduleTitle = this.data.moduleTitle;
                        this.footerInfo.url = this.data.pageRouterLink;
                        this.tabs = this.data.tabs;
                    }
                };
                PlayerStatsModule.prototype.tabSelected = function (tabData) {
                    this.tabSelectedListener.next(tabData);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], PlayerStatsModule.prototype, "data", void 0);
                __decorate([
                    core_1.Output("tabSelected"), 
                    __metadata('design:type', Object)
                ], PlayerStatsModule.prototype, "tabSelectedListener", void 0);
                PlayerStatsModule = __decorate([
                    core_1.Component({
                        selector: "player-stats-module",
                        templateUrl: "./app/modules/player-stats/player-stats.module.html",
                        directives: [module_header_component_1.ModuleHeader, module_footer_component_1.ModuleFooter, player_stats_component_1.PlayerStatsComponent],
                    }), 
                    __metadata('design:paramtypes', [])
                ], PlayerStatsModule);
                return PlayerStatsModule;
            }());
            exports_1("PlayerStatsModule", PlayerStatsModule);
        }
    }
});
