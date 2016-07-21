System.register(['@angular/core', '../carousels/slider-carousel/slider-carousel.component', '../tabs/tabs.component', '../tabs/tab.component', '../custom-table/custom-table.component', '../../components/dropdown/dropdown.component', '../../components/loading/loading.component', '../../components/error/data-box/data-box.component'], function(exports_1, context_1) {
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
    var core_1, slider_carousel_component_1, tabs_component_1, tab_component_1, custom_table_component_1, dropdown_component_1, loading_component_1, data_box_component_1;
    var PlayerStatsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (slider_carousel_component_1_1) {
                slider_carousel_component_1 = slider_carousel_component_1_1;
            },
            function (tabs_component_1_1) {
                tabs_component_1 = tabs_component_1_1;
            },
            function (tab_component_1_1) {
                tab_component_1 = tab_component_1_1;
            },
            function (custom_table_component_1_1) {
                custom_table_component_1 = custom_table_component_1_1;
            },
            function (dropdown_component_1_1) {
                dropdown_component_1 = dropdown_component_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (data_box_component_1_1) {
                data_box_component_1 = data_box_component_1_1;
            }],
        execute: function() {
            PlayerStatsComponent = (function () {
                function PlayerStatsComponent() {
                    this.carouselData = [];
                    this.tabSelectedListener = new core_1.EventEmitter();
                    this.noDataMessage = "Sorry, there is no data available.";
                }
                PlayerStatsComponent.prototype.ngDoCheck = function () {
                    if (this.tabs && this.tabs.length > 0) {
                        if (!this.tabsLoaded) {
                            this.tabsLoaded = {};
                            var selectedTitle = this.tabs[0].tabTitle;
                            this.tabs.forEach(function (tab) {
                                if (tab.isActive) {
                                    selectedTitle = tab.tabTitle;
                                }
                            });
                            this.tabSelected(selectedTitle);
                        }
                        else {
                            for (var i = 0; i < this.tabs.length; i++) {
                                if (this.tabs[i].isLoaded && !this.tabsLoaded[i]) {
                                    this.updateCarousel();
                                    this.tabsLoaded[i] = "1";
                                }
                            }
                        }
                    }
                };
                PlayerStatsComponent.prototype.dropdownChanged = function ($event) {
                    var _this = this;
                    this.selectedSeasonId = $event;
                    var matchingTabs = this.tabs.filter(function (value) { return value.tabTitle === _this.selectedTabTitle; });
                    if (matchingTabs.length > 0 && matchingTabs[0] !== undefined) {
                        var selectedTab = matchingTabs[0];
                        this.tabSelectedListener.next([selectedTab, $event]);
                        this.updateCarousel();
                    }
                };
                PlayerStatsComponent.prototype.getSelectedTab = function () {
                    var _this = this;
                    var matchingTabs = this.tabs.filter(function (value) { return value.tabTitle === _this.selectedTabTitle; });
                    if (matchingTabs.length > 0 && matchingTabs[0] !== undefined) {
                        return matchingTabs[0];
                    }
                    else {
                        return null;
                    }
                };
                PlayerStatsComponent.prototype.tabSelected = function (newTitle) {
                    this.selectedTabTitle = newTitle;
                    this.noDataMessage = "Sorry, there are no " + newTitle + " stats available.";
                    if (this.initialSeasonId != this.selectedSeasonId) {
                        this.initialSeasonId = this.selectedSeasonId;
                    }
                    this.tabSelectedListener.next([this.getSelectedTab(), this.selectedSeasonId]);
                    this.updateCarousel();
                };
                PlayerStatsComponent.prototype.indexNum = function ($event) {
                    var _this = this;
                    var selectedIndex = Number($event);
                    var matchingTabs = this.tabs.filter(function (value) { return value.tabTitle === _this.selectedTabTitle; });
                    if (matchingTabs.length > 0 && matchingTabs[0] !== undefined) {
                        var selectedTab = matchingTabs[0];
                        if (selectedTab.tableData) {
                            selectedTab.tableData.setRowSelected(selectedIndex);
                        }
                    }
                };
                PlayerStatsComponent.prototype.updateCarousel = function (sortedRows) {
                    var selectedTab = this.getSelectedTab();
                    if (!selectedTab || !selectedTab.tableData) {
                        return;
                    }
                    var carouselData = [];
                    var index = 0;
                    var selectedIndex = -1;
                    selectedTab.tableData.rows.map(function (value) {
                        var item = selectedTab.convertToCarouselItem(value, index);
                        if (selectedTab.tableData.isRowSelected(value, index)) {
                            selectedIndex = index;
                        }
                        index++;
                        return item;
                    })
                        .forEach(function (value) {
                        carouselData.push(value);
                    });
                    this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
                    this.carouselData = carouselData;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], PlayerStatsComponent.prototype, "tabs", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], PlayerStatsComponent.prototype, "showGlossary", void 0);
                __decorate([
                    core_1.Output("tabSelected"), 
                    __metadata('design:type', Object)
                ], PlayerStatsComponent.prototype, "tabSelectedListener", void 0);
                PlayerStatsComponent = __decorate([
                    core_1.Component({
                        selector: "player-stats-component",
                        templateUrl: "./app/components/player-stats/player-stats.component.html",
                        directives: [slider_carousel_component_1.SliderCarousel, tabs_component_1.Tabs, tab_component_1.Tab, custom_table_component_1.CustomTable, dropdown_component_1.DropdownComponent, loading_component_1.LoadingComponent, data_box_component_1.NoDataBox],
                    }), 
                    __metadata('design:paramtypes', [])
                ], PlayerStatsComponent);
                return PlayerStatsComponent;
            }());
            exports_1("PlayerStatsComponent", PlayerStatsComponent);
        }
    }
});
