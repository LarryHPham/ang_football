System.register(['@angular/core', '../../components/module-header/module-header.component', '../../components/module-footer/module-footer.component', '../../components/comparison-bar/comparison-bar.component', '../../components/comparison-legend/comparison-legend.component', '../../components/tabs/tabs.component', '../../components/tabs/tab.component', '../../components/carousels/slider-carousel/slider-carousel.component', '../../components/error/data-box/data-box.component', '../../services/season-stats.service'], function(exports_1, context_1) {
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
    var core_1, module_header_component_1, module_footer_component_1, comparison_bar_component_1, comparison_legend_component_1, tabs_component_1, tab_component_1, slider_carousel_component_1, data_box_component_1, season_stats_service_1;
    var SeasonStatsModule;
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
            function (comparison_bar_component_1_1) {
                comparison_bar_component_1 = comparison_bar_component_1_1;
            },
            function (comparison_legend_component_1_1) {
                comparison_legend_component_1 = comparison_legend_component_1_1;
            },
            function (tabs_component_1_1) {
                tabs_component_1 = tabs_component_1_1;
            },
            function (tab_component_1_1) {
                tab_component_1 = tab_component_1_1;
            },
            function (slider_carousel_component_1_1) {
                slider_carousel_component_1 = slider_carousel_component_1_1;
            },
            function (data_box_component_1_1) {
                data_box_component_1 = data_box_component_1_1;
            },
            function (season_stats_service_1_1) {
                season_stats_service_1 = season_stats_service_1_1;
            }],
        execute: function() {
            SeasonStatsModule = (function () {
                function SeasonStatsModule() {
                    this.noDataMessage = "Sorry, there are no values for this season.";
                }
                SeasonStatsModule.prototype.formatData = function (data) {
                    var _this = this;
                    this.carouselDataArray = [data.carouselDataItem];
                    this.footerData = {
                        infoDesc: 'Want to see full statistics for this player?',
                        text: 'VIEW FULL STATISTICS',
                        url: data.pageRouterLink
                    };
                    this.profileName = data.profileName;
                    if (this.data.tabs && this.data.tabs.length > 0) {
                        var selectedTabs = this.data.tabs.filter(function (tab) { return tab.tabTitle == _this.selectedTabTitle; });
                        this.formatTitle(selectedTabs && selectedTabs.length > 0 ? selectedTabs[0] : this.data.tabs[0]);
                    }
                    else {
                        this.formatTitle(null);
                    }
                };
                SeasonStatsModule.prototype.formatTitle = function (tab) {
                    this.moduleHeaderData = {
                        moduleTitle: (tab ? tab.longSeasonName : 'Season') + ' Stats - ' + this.profileName,
                        hasIcon: false,
                        iconClass: ''
                    };
                };
                SeasonStatsModule.prototype.ngOnChanges = function () {
                    if (this.data) {
                        this.formatData(this.data);
                    }
                };
                SeasonStatsModule.prototype.tabSelected = function (tabTitle) {
                    this.selectedTabTitle = tabTitle;
                    if (tabTitle == "Career Stats") {
                        this.noDataMessage = "Sorry, there are no season stats available for this player.";
                    }
                    else {
                        this.noDataMessage = "Sorry, there are no statistics available for " + tabTitle + ".";
                    }
                    var selectedTabs = this.data.tabs.filter(function (tab) { return tab.tabTitle == tabTitle; });
                    if (selectedTabs && selectedTabs.length > 0) {
                        var tab = selectedTabs[0];
                        this.carouselDataArray = [season_stats_service_1.SeasonStatsService.getCarouselData(this.data.playerInfo, tab.longSeasonName)];
                        this.formatTitle(tab);
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SeasonStatsModule.prototype, "data", void 0);
                SeasonStatsModule = __decorate([
                    core_1.Component({
                        selector: 'season-stats-module',
                        templateUrl: './app/modules/season-stats/season-stats.module.html',
                        directives: [
                            slider_carousel_component_1.SliderCarousel,
                            module_header_component_1.ModuleHeader,
                            comparison_bar_component_1.ComparisonBar,
                            comparison_legend_component_1.ComparisonLegend,
                            module_footer_component_1.ModuleFooter,
                            tabs_component_1.Tabs, tab_component_1.Tab,
                            data_box_component_1.NoDataBox
                        ]
                    }), 
                    __metadata('design:paramtypes', [])
                ], SeasonStatsModule);
                return SeasonStatsModule;
            }());
            exports_1("SeasonStatsModule", SeasonStatsModule);
        }
    }
});
