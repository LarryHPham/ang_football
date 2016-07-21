System.register(['@angular/core', '@angular/common', '../../components/backtab/backtab.component', '@angular/router-deprecated', '../../components/tabs/tabs.component', '../../components/tabs/tab.component', '../../components/search/search.component', '../../components/pagination-footer/pagination-footer.component', '../../components/error/data-box/data-box.component'], function(exports_1, context_1) {
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
    var core_1, common_1, backtab_component_1, router_deprecated_1, tabs_component_1, tab_component_1, search_component_1, pagination_footer_component_1, data_box_component_1;
    var SearchPageModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (backtab_component_1_1) {
                backtab_component_1 = backtab_component_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (tabs_component_1_1) {
                tabs_component_1 = tabs_component_1_1;
            },
            function (tab_component_1_1) {
                tab_component_1 = tab_component_1_1;
            },
            function (search_component_1_1) {
                search_component_1 = search_component_1_1;
            },
            function (pagination_footer_component_1_1) {
                pagination_footer_component_1 = pagination_footer_component_1_1;
            },
            function (data_box_component_1_1) {
                data_box_component_1 = data_box_component_1_1;
            }],
        execute: function() {
            SearchPageModule = (function () {
                function SearchPageModule(_route) {
                    this._route = _route;
                    if (typeof this._route.params['pageNum'] != 'undefined') {
                        this.pageNumber = Number(this._route.params['pageNum']);
                    }
                    else {
                        this.pageNumber = 1; // if nothing is in route params then default to first piece of obj array
                    }
                }
                SearchPageModule.prototype.ngOnChanges = function () {
                    this.configureSearchPageModule();
                    this.getShowResults(this.searchPageInput);
                };
                SearchPageModule.prototype.configureSearchPageModule = function () {
                    var input = this.searchPageInput;
                };
                SearchPageModule.prototype.newIndex = function (index) {
                    this.pageNumber = index;
                    window.scrollTo(0, 0);
                    this.getShowResults(this.searchPageInput);
                };
                SearchPageModule.prototype.getShowResults = function (data) {
                    var self = this;
                    data.tabData.forEach(function (val, index) {
                        if (val.isTabDefault) {
                            if (val.results[self.pageNumber - 1] == null) {
                                val.results[self.pageNumber - 1] = [];
                            }
                            var pageMax = Number(val.pageMax);
                            var currPage = Number(self.pageNumber);
                            var totalItemsOnPage = val.results[self.pageNumber - 1].length;
                            var rangeStart = (currPage - 1) * pageMax + 1;
                            var rangeEnd = rangeStart + totalItemsOnPage - 1;
                            if (val.results[self.pageNumber - 1].length > 0) {
                                self.currentShowing = rangeStart + ' - ' + rangeEnd;
                            }
                            else {
                                self.currentShowing = '0 - 0';
                            }
                            self.totalResults = Number(val.totalResults);
                        }
                    });
                };
                SearchPageModule.prototype.tabSelected = function (event) {
                    this.pageNumber = 1;
                    this.searchPageInput.tabData.forEach(function (val, index) {
                        if (val.tabName == event) {
                            val.isTabDefault = true;
                        }
                        else {
                            val.isTabDefault = false;
                        }
                    });
                    this.getShowResults(this.searchPageInput);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SearchPageModule.prototype, "searchPageInput", void 0);
                SearchPageModule = __decorate([
                    core_1.Component({
                        selector: 'search-page-module',
                        templateUrl: './app/modules/search-page/search-page.module.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES, data_box_component_1.NoDataBox, backtab_component_1.BackTabComponent, tabs_component_1.Tabs, tab_component_1.Tab, search_component_1.Search, pagination_footer_component_1.PaginationFooter],
                        providers: [common_1.NgStyle]
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.RouteParams])
                ], SearchPageModule);
                return SearchPageModule;
            }());
            exports_1("SearchPageModule", SearchPageModule);
        }
    }
});
