System.register(['@angular/core', '../../components/detailed-list-item/detailed-list-item.component', '../../components/carousels/slider-carousel/slider-carousel.component', '../../components/tabs/tabs.component', '../../components/tabs/tab.component', '../../components/error/data-box/data-box.component', '../../components/loading/loading.component'], function(exports_1, context_1) {
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
    var core_1, detailed_list_item_component_1, slider_carousel_component_1, tabs_component_1, tab_component_1, data_box_component_1, loading_component_1;
    var MVPListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (detailed_list_item_component_1_1) {
                detailed_list_item_component_1 = detailed_list_item_component_1_1;
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
            function (data_box_component_1_1) {
                data_box_component_1 = data_box_component_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            }],
        execute: function() {
            MVPListComponent = (function () {
                function MVPListComponent() {
                    this.tabSelectedListener = new core_1.EventEmitter();
                }
                MVPListComponent.prototype.ngDoCheck = function () {
                    if (this.tabs && this.tabs.length > 0) {
                        if (!this.tabsLoaded) {
                            this.tabsLoaded = {};
                            if (!this.selectedTabTitle) {
                                this.selectedTabTitle = this.tabs[0].tabDisplayTitle;
                            }
                            this.tabSelected(this.selectedTabTitle);
                        }
                        else {
                            var selectedTab = this.getSelectedTab();
                            if (selectedTab && selectedTab.listData && selectedTab.listData.length > 0 && !this.tabsLoaded[selectedTab.tabDisplayTitle]) {
                                this.tabsLoaded[selectedTab.tabDisplayTitle] = "1";
                                this.updateCarousel(selectedTab);
                            }
                        }
                    }
                };
                MVPListComponent.prototype.getSelectedTab = function () {
                    if (!this.tabs)
                        return null;
                    var tabTitle = this.selectedTabTitle;
                    var matches = this.tabs.filter(function (tab) { return tab.tabDisplayTitle == tabTitle; });
                    return matches.length > 0 ? matches[0] : null;
                };
                //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
                MVPListComponent.prototype.tabSelected = function (tabTitle) {
                    this.selectedTabTitle = tabTitle;
                    var selectedTab = this.getSelectedTab();
                    if (selectedTab) {
                        this.detailedDataArray = null;
                        if (!selectedTab.listData) {
                            selectedTab.isLoaded = false;
                            this.tabSelectedListener.next(selectedTab);
                        }
                        else {
                            this.tabSelectedListener.next(selectedTab);
                            this.updateCarousel(selectedTab);
                        }
                    }
                };
                MVPListComponent.prototype.updateCarousel = function (tab) {
                    if (tab.listData.length == 0) {
                        this.carouselDataArray = tab.getCarouselData();
                    }
                    else {
                        this.carouselDataArray = tab.getCarouselData();
                        this.detailedDataArray = tab.listData;
                    }
                };
                __decorate([
                    core_1.Output("tabSelected"), 
                    __metadata('design:type', Object)
                ], MVPListComponent.prototype, "tabSelectedListener", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], MVPListComponent.prototype, "tabs", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], MVPListComponent.prototype, "carouselFooter", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], MVPListComponent.prototype, "selectedTabTitle", void 0);
                MVPListComponent = __decorate([
                    core_1.Component({
                        selector: 'mvp-list',
                        templateUrl: './app/components/mvp-list/mvp-list.component.html',
                        directives: [slider_carousel_component_1.SliderCarousel, detailed_list_item_component_1.DetailedListItem, tabs_component_1.Tabs, tab_component_1.Tab, data_box_component_1.NoDataBox, loading_component_1.LoadingComponent],
                    }), 
                    __metadata('design:paramtypes', [])
                ], MVPListComponent);
                return MVPListComponent;
            }());
            exports_1("MVPListComponent", MVPListComponent);
        }
    }
});
