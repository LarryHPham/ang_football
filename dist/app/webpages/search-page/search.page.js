System.register(['@angular/core', '@angular/router-deprecated', '@angular/platform-browser', "../../global/global-settings", '../../modules/search-page/search-page.module', '../../services/search.service', "../../components/sidekick-wrapper/sidekick-wrapper.component"], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, global_settings_1, search_page_module_1, search_service_1, sidekick_wrapper_component_1;
    var SearchPage;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (search_page_module_1_1) {
                search_page_module_1 = search_page_module_1_1;
            },
            function (search_service_1_1) {
                search_service_1 = search_service_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            }],
        execute: function() {
            SearchPage = (function () {
                function SearchPage(_params, _searchService, _title, _router) {
                    var _this = this;
                    this._searchService = _searchService;
                    this._title = _title;
                    this._router = _router;
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Search"));
                    var query = decodeURIComponent(_params.get('query'));
                    this.pageParams = {
                        query: query
                    };
                    global_settings_1.GlobalSettings.getPartnerID(_router, function (partnerID) {
                        _this.partnerId = partnerID;
                    });
                }
                SearchPage.prototype.configureSearchPageData = function () {
                    var _this = this;
                    var self = this;
                    var query = self.pageParams.query;
                    self._searchService.getSearch()
                        .subscribe(function (data) {
                        self.searchPageInput = self._searchService.getSearchPageData(_this._router, _this.partnerId, query, data);
                    });
                };
                SearchPage.prototype.ngOnInit = function () {
                    this.configureSearchPageData();
                };
                SearchPage = __decorate([
                    core_1.Component({
                        selector: 'search-page',
                        templateUrl: './app/webpages/search-page/search.page.html',
                        directives: [sidekick_wrapper_component_1.SidekickWrapper, search_page_module_1.SearchPageModule],
                        providers: [platform_browser_1.Title]
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.RouteParams, search_service_1.SearchService, platform_browser_1.Title, router_deprecated_1.Router])
                ], SearchPage);
                return SearchPage;
            }());
            exports_1("SearchPage", SearchPage);
        }
    }
});
