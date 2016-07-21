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
    var RosterComponent;
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
            RosterComponent = (function () {
                function RosterComponent() {
                    this.noDataMessage = "This team is a National League team and has no designated hitters.";
                    this.footerStyle = {
                        ctaBoxClass: "list-footer",
                        ctaBtnClass: "list-footer-btn",
                        hasIcon: true
                    };
                }
                RosterComponent.prototype.ngDoCheck = function () {
                    var _this = this;
                    if (this.tabs && this.tabs.length > 0) {
                        if (!this.tabsLoaded) {
                            this.tabsLoaded = {};
                            var selectedTitle = this.tabs[0].title;
                            this.tabs.forEach(function (tab, i) {
                                _this.setSelectedCarouselIndex(tab, 0);
                                if (i == 0) {
                                    selectedTitle = tab.title;
                                }
                            });
                            this.tabSelected(selectedTitle);
                        }
                        else {
                            var selectedTab = this.getSelectedTab();
                            if (selectedTab && !this.tabsLoaded[selectedTab.title]) {
                                if (selectedTab.tableData) {
                                    selectedTab.tableData.setSelectedKey(this.selectedKey);
                                }
                                this.updateCarousel();
                                this.tabsLoaded[selectedTab.title] = "1";
                            }
                        }
                    }
                };
                RosterComponent.prototype.setSelectedCarouselIndex = function (tab, index) {
                    if (tab.tableData) {
                        tab.tableData.setRowSelected(index);
                    }
                };
                RosterComponent.prototype.getSelectedTab = function () {
                    var _this = this;
                    var matchingTabs = this.tabs.filter(function (value) { return value.title === _this.selectedTabTitle; });
                    if (matchingTabs.length > 0 && matchingTabs[0] !== undefined) {
                        return matchingTabs[0];
                    }
                    else {
                        return null;
                    }
                };
                RosterComponent.prototype.tabSelected = function (newTitle) {
                    this.selectedTabTitle = newTitle;
                    var selectedTab = this.getSelectedTab();
                    if (selectedTab) {
                        this.noDataMessage = selectedTab.errorMessage;
                        selectedTab.loadData();
                        if (selectedTab.tableData) {
                            selectedTab.tableData.setSelectedKey(this.selectedKey);
                        }
                        this.updateCarousel();
                    }
                };
                RosterComponent.prototype.indexNum = function ($event) {
                    var _this = this;
                    var selectedIndex = Number($event);
                    var matchingTabs = this.tabs.filter(function (value) { return value.title === _this.selectedTabTitle; });
                    if (matchingTabs.length > 0) {
                        if (!matchingTabs[0] || !matchingTabs[0].tableData) {
                            return;
                        }
                        var selectedTab = matchingTabs[0];
                        var table = selectedTab.tableData;
                        if (selectedIndex < table.rows.length) {
                            table.setRowSelected(selectedIndex);
                            this.selectedKey = table.getSelectedKey();
                        }
                    }
                };
                RosterComponent.prototype.updateCarousel = function (sortedRows) {
                    var selectedTab = this.getSelectedTab();
                    var carouselData = [];
                    var selectedIndex = -1;
                    if (selectedTab && selectedTab.tableData) {
                        var table_1 = selectedTab.tableData;
                        var index_1 = 0;
                        table_1.rows.map(function (value) {
                            var item = selectedTab.convertToCarouselItem(value, index_1);
                            if (table_1.isRowSelected(value, index_1)) {
                                selectedIndex = index_1;
                            }
                            index_1++;
                            return item;
                        })
                            .forEach(function (value) {
                            carouselData.push(value);
                        });
                    }
                    this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
                    this.carDataArray = carouselData;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], RosterComponent.prototype, "tabs", void 0);
                RosterComponent = __decorate([
                    core_1.Component({
                        selector: "roster-component",
                        templateUrl: "./app/components/roster/roster.component.html",
                        directives: [slider_carousel_component_1.SliderCarousel, tabs_component_1.Tabs, tab_component_1.Tab, custom_table_component_1.CustomTable, loading_component_1.LoadingComponent, data_box_component_1.NoDataBox],
                    }), 
                    __metadata('design:paramtypes', [])
                ], RosterComponent);
                return RosterComponent;
            }());
            exports_1("RosterComponent", RosterComponent);
        }
    }
});
