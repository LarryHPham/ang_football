System.register(['@angular/core', '../carousels/schedules-carousel/schedules-carousel.component', '../tabs/tabs.component', '../tabs/tab.component', '../custom-table/custom-table.component', '../loading/loading.component'], function(exports_1, context_1) {
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
    var core_1, schedules_carousel_component_1, tabs_component_1, tab_component_1, custom_table_component_1, loading_component_1;
    var SchedulesComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (schedules_carousel_component_1_1) {
                schedules_carousel_component_1 = schedules_carousel_component_1_1;
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
            }],
        execute: function() {
            SchedulesComponent = (function () {
                function SchedulesComponent() {
                    this.carouselData = []; // the data to send through the schedules carousel to display
                    this.tabSelectedListener = new core_1.EventEmitter();
                } //constructor ENDS
                SchedulesComponent.prototype.ngDoCheck = function () {
                    var _this = this;
                    if (this.tabs && this.tabs.length > 0 && this.carouselData && this.data != null && !this.tabsLoaded && this.getSelectedTab()) {
                        if (!this.tabsLoaded) {
                            this.tabsLoaded = {};
                            var selectedTitle = this.getSelectedTab()['display'];
                            var matchingTabs_1 = this.tabs.filter(function (value) { return value.display == _this.tabTitle; });
                            this.tabs.forEach(function (tab) {
                                _this.setSelectedCarouselIndex(tab.tabData, 0);
                                if (matchingTabs_1[0].display === tab.display) {
                                    selectedTitle = tab.display;
                                }
                            });
                            this.tabSelected(selectedTitle);
                        }
                        else {
                            var selectedTab = this.getSelectedTab()['tabData'];
                            if (selectedTab && selectedTab.sections && selectedTab.sections.length > 0 && this.tabsLoaded != null) {
                                this.tabsLoaded[this.tabTitle] = "1";
                                this.updateCarousel();
                            }
                        }
                    }
                };
                SchedulesComponent.prototype.indexNum = function (event) {
                    var _this = this;
                    var selectedIndex = event;
                    var matchingTabs = this.tabs.filter(function (value) { return value.display == _this.tabTitle; });
                    if (matchingTabs.length > 0 && matchingTabs[0] !== undefined) {
                        var selectedTab = matchingTabs[0].tabData;
                        // console.log('selectedTab',selectedIndex,selectedTab);
                        this.setSelectedCarouselIndex(selectedTab, selectedIndex);
                    }
                };
                SchedulesComponent.prototype.setSelectedCarouselIndex = function (tab, index) {
                    var offset = 0;
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
                SchedulesComponent.prototype.getSelectedTab = function () {
                    var _this = this;
                    var matchingTabs = this.tabs.filter(function (value) { return value.display == _this.tabTitle; });
                    if (matchingTabs.length > 0 && matchingTabs[0] !== undefined) {
                        return matchingTabs[0];
                    }
                    else {
                        return null;
                    }
                };
                SchedulesComponent.prototype.tabSelected = function (event) {
                    this.tabTitle = event;
                    this.tabSelectedListener.emit(event);
                };
                SchedulesComponent.prototype.ngOnChanges = function () {
                    if (this.getSelectedTab() != null) {
                        this.getSelectedTab()['tabData'].sections = this.data;
                    }
                };
                SchedulesComponent.prototype.updateCarousel = function (sortedRows) {
                    var _this = this;
                    var carouselData = [];
                    var index = 0;
                    var selectedIndex = -1;
                    var selectedTab = this.tabs.filter(function (value) { return value.display == _this.tabTitle; })[0];
                    selectedTab.tabData.sections.forEach(function (section, i) {
                        section.tableData.rows.map(function (value) {
                            var item = section.updateCarouselData(value, index);
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
                    this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
                    this.carouselData = carouselData;
                };
                SchedulesComponent.prototype.ngOnInit = function () {
                    var selectedTab = this.tabs.filter(function (value) { return value.tabData.isActive == true; })[0];
                    this.tabTitle = selectedTab.display;
                }; //ngOnInit ENDS
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], SchedulesComponent.prototype, "carouselData", void 0);
                __decorate([
                    // the data to send through the schedules carousel to display
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SchedulesComponent.prototype, "data", void 0);
                __decorate([
                    // the data to display is inputed through this variable
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SchedulesComponent.prototype, "tabs", void 0);
                __decorate([
                    core_1.Output("tabSelected"), 
                    __metadata('design:type', Object)
                ], SchedulesComponent.prototype, "tabSelectedListener", void 0);
                SchedulesComponent = __decorate([
                    core_1.Component({
                        selector: 'schedules-component',
                        templateUrl: './app/components/schedules/schedules.component.html',
                        directives: [loading_component_1.LoadingComponent, tabs_component_1.Tabs, tab_component_1.Tab, schedules_carousel_component_1.SchedulesCarousel, custom_table_component_1.CustomTable],
                    }), 
                    __metadata('design:paramtypes', [])
                ], SchedulesComponent);
                return SchedulesComponent;
            }());
            exports_1("SchedulesComponent", SchedulesComponent);
        }
    }
});
