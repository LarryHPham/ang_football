System.register(['@angular/core', '../../components/transactions-list-item/transactions-list-item.component', '../../components/carousels/slider-carousel/slider-carousel.component', '../../components/tabs/tabs.component', '../../components/tabs/tab.component', '../../components/error/data-box/data-box.component', "../../components/dropdown/dropdown.component", '../../components/loading/loading.component'], function(exports_1, context_1) {
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
    var core_1, transactions_list_item_component_1, slider_carousel_component_1, tabs_component_1, tab_component_1, data_box_component_1, dropdown_component_1, loading_component_1;
    var TransactionsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (transactions_list_item_component_1_1) {
                transactions_list_item_component_1 = transactions_list_item_component_1_1;
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
            function (dropdown_component_1_1) {
                dropdown_component_1 = dropdown_component_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            }],
        execute: function() {
            TransactionsComponent = (function () {
                function TransactionsComponent() {
                    this.tabSwitched = new core_1.EventEmitter();
                    this.dropdownSwitched = new core_1.EventEmitter();
                }
                TransactionsComponent.prototype.ngDoCheck = function () {
                    if (this.tabs && this.tabs.length > 0) {
                        if (!this.tabsLoaded) {
                            this.tabsLoaded = {};
                            var selectedTitle = this.tabs[0].tabDisplay;
                            this.selectedTab(selectedTitle);
                        }
                        else {
                            var selectedTab = this.getSelectedTab();
                            if (selectedTab && selectedTab.dataArray && !this.tabsLoaded[selectedTab.tabDisplay]) {
                                this.updateCarousel();
                                this.tabsLoaded[selectedTab.tabDisplay] = "1";
                            }
                        }
                    }
                };
                TransactionsComponent.prototype.updateCarousel = function () {
                    var selectedTab = this.getSelectedTab();
                    if (selectedTab) {
                        this.carouselDataArray = selectedTab.carData;
                    }
                    else {
                    }
                };
                TransactionsComponent.prototype.getSelectedTab = function () {
                    var _this = this;
                    var tabs = this.tabs.filter(function (tab) { return tab.tabDisplay == _this.selectedTabTitle; });
                    return tabs.length > 0 ? tabs[0] : null;
                };
                TransactionsComponent.prototype.selectedTab = function (event) {
                    this.selectedTabTitle = event;
                    var selectedTab = this.getSelectedTab();
                    this.tabSwitched.next(selectedTab);
                    this.updateCarousel();
                    this.pageName = this.selectedTabTitle;
                };
                TransactionsComponent.prototype.dropdownChanged = function (event) {
                    this.dropdownSwitched.next(event);
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TransactionsComponent.prototype, "tabSwitched", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TransactionsComponent.prototype, "dropdownSwitched", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], TransactionsComponent.prototype, "tabs", void 0);
                TransactionsComponent = __decorate([
                    core_1.Component({
                        selector: 'transactions',
                        templateUrl: './app/components/transactions/transactions.component.html',
                        directives: [data_box_component_1.NoDataBox, tab_component_1.Tab, tabs_component_1.Tabs, slider_carousel_component_1.SliderCarousel, dropdown_component_1.DropdownComponent, transactions_list_item_component_1.TransactionsListItem, loading_component_1.LoadingComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], TransactionsComponent);
                return TransactionsComponent;
            }());
            exports_1("TransactionsComponent", TransactionsComponent);
        }
    }
});
