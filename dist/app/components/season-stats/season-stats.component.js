System.register(['@angular/core', '../carousels/slider-carousel/slider-carousel.component', '../tabs/tabs.component', '../tabs/tab.component', '../custom-table/custom-table.component', '../loading/loading.component', '../../components/error/data-box/data-box.component'], function(exports_1, context_1) {
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
    var core_1, slider_carousel_component_1, tabs_component_1, tab_component_1, custom_table_component_1, loading_component_1, data_box_component_1;
    var SeasonStatsComponent;
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
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (data_box_component_1_1) {
                data_box_component_1 = data_box_component_1_1;
            }],
        execute: function() {
            SeasonStatsComponent = (function () {
                function SeasonStatsComponent() {
                    this.carouselData = [];
                    this.tabSelectedListener = new core_1.EventEmitter();
                    this.noDataMessage = "Sorry, there is no data available.";
                }
                SeasonStatsComponent.prototype.ngDoCheck = function () {
                    var _this = this;
                    if (this.tabs && this.tabs.length > 0) {
                        if (!this.tabsLoaded) {
                            this.tabsLoaded = {};
                            var selectedTitle = this.tabs[0].title;
                            this.tabs.forEach(function (tab) {
                                _this.setSelectedCarouselIndex(tab, 0);
                                if (tab.isActive) {
                                    selectedTitle = tab.title;
                                }
                            });
                            this.tabSelected(selectedTitle);
                        }
                        else {
                            var selectedTab = this.getSelectedTab();
                            if (selectedTab && selectedTab.sections && selectedTab.sections.length > 0 && !this.tabsLoaded[selectedTab.title]) {
                                this.updateCarousel();
                                this.tabsLoaded[selectedTab.title] = "1";
                            }
                        }
                    }
                };
                SeasonStatsComponent.prototype.getSelectedTab = function () {
                    var _this = this;
                    var matchingTabs = this.tabs.filter(function (value) { return value.title === _this.selectedTabTitle; });
                    if (matchingTabs.length > 0 && matchingTabs[0] !== undefined) {
                        return matchingTabs[0];
                    }
                    else {
                        return null;
                    }
                };
                SeasonStatsComponent.prototype.setSelectedCarouselIndex = function (tab, index) {
                    var offset = 0;
                    if (!tab.sections)
                        return;
                    tab.sections.forEach(function (section, sectionIndex) {
                        if (index >= offset && index < section.tableData.rows.length + offset) {
                            section.tableData.setRowSelected(index - offset);
                        }
                        else {
                            section.tableData.setRowSelected(-1);
                        }
                        offset += section.tableData.rows.length;
                    });
                };
                SeasonStatsComponent.prototype.tabSelected = function (newTitle) {
                    this.selectedTabTitle = newTitle;
                    this.noDataMessage = "Sorry, there is no data available";
                    this.tabSelectedListener.next(this.getSelectedTab());
                    this.updateCarousel();
                };
                SeasonStatsComponent.prototype.indexNum = function ($event) {
                    var _this = this;
                    var selectedIndex = Number($event);
                    var matchingTabs = this.tabs.filter(function (value) { return value.title === _this.selectedTabTitle; });
                    if (matchingTabs.length > 0 && matchingTabs[0] !== undefined) {
                        var selectedTab = matchingTabs[0];
                        this.setSelectedCarouselIndex(selectedTab, selectedIndex);
                    }
                };
                SeasonStatsComponent.prototype.updateCarousel = function (sortedRows) {
                    var selectedTab = this.getSelectedTab();
                    if (selectedTab === undefined || selectedTab === null) {
                        return;
                    }
                    var carouselData = [];
                    var index = 0;
                    var selectedIndex = -1;
                    if (selectedTab.sections) {
                        selectedTab.sections.forEach(function (section) {
                            section.tableData.rows
                                .map(function (value) {
                                var item = selectedTab.convertToCarouselItem(value, index);
                                if (section.tableData.isRowSelected(value, index)) {
                                    selectedIndex = index;
                                }
                                index++;
                                return item;
                            })
                                .forEach(function (value) {
                                carouselData.push(value);
                            });
                        });
                    }
                    this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
                    this.carouselData = carouselData;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], SeasonStatsComponent.prototype, "tabs", void 0);
                __decorate([
                    core_1.Output("tabSelected"), 
                    __metadata('design:type', Object)
                ], SeasonStatsComponent.prototype, "tabSelectedListener", void 0);
                SeasonStatsComponent = __decorate([
                    core_1.Component({
                        selector: "season-stats-component",
                        templateUrl: "./app/components/season-stats/season-stats.component.html",
                        directives: [slider_carousel_component_1.SliderCarousel, tabs_component_1.Tabs, tab_component_1.Tab, custom_table_component_1.CustomTable, loading_component_1.LoadingComponent, data_box_component_1.NoDataBox],
                    }), 
                    __metadata('design:paramtypes', [])
                ], SeasonStatsComponent);
                return SeasonStatsComponent;
            }());
            exports_1("SeasonStatsComponent", SeasonStatsComponent);
        }
    }
});
