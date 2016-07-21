System.register(['@angular/core', '@angular/router-deprecated', '@angular/platform-browser', '../../components/title/title.component', '../../components/backtab/backtab.component', '../../services/list-page.service', '../../services/profile-header.service', '../../components/pagination-footer/pagination-footer.component', "../../components/loading/loading.component", "../../components/error/error.component", "../../global/global-functions", "../../global/global-settings", "../../components/sidekick-wrapper/sidekick-wrapper.component", '../../components/mvp-list/mvp-list.component', '../../components/responsive-widget/responsive-widget.component'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, title_component_1, backtab_component_1, list_page_service_1, profile_header_service_1, pagination_footer_component_1, loading_component_1, error_component_1, global_functions_1, global_settings_1, sidekick_wrapper_component_1, mvp_list_component_1, responsive_widget_component_1;
    var MVPListPage;
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
            function (title_component_1_1) {
                title_component_1 = title_component_1_1;
            },
            function (backtab_component_1_1) {
                backtab_component_1 = backtab_component_1_1;
            },
            function (list_page_service_1_1) {
                list_page_service_1 = list_page_service_1_1;
            },
            function (profile_header_service_1_1) {
                profile_header_service_1 = profile_header_service_1_1;
            },
            function (pagination_footer_component_1_1) {
                pagination_footer_component_1 = pagination_footer_component_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (error_component_1_1) {
                error_component_1 = error_component_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            },
            function (mvp_list_component_1_1) {
                mvp_list_component_1 = mvp_list_component_1_1;
            },
            function (responsive_widget_component_1_1) {
                responsive_widget_component_1 = responsive_widget_component_1_1;
            }],
        execute: function() {
            MVPListPage = (function () {
                function MVPListPage(_service, _params, _profileService, _title, _router) {
                    this._service = _service;
                    this._params = _params;
                    this._profileService = _profileService;
                    this._title = _title;
                    this._router = _router;
                    this.isError = false;
                    this.footerStyle = {
                        ctaBoxClass: " mvp-page-car-footer",
                        ctaBtnClass: "",
                        hasIcon: true,
                    };
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle("MLB's Most Valuable Players"));
                    this.listType = _params.get("type");
                    if (this.listType != "pitcher") {
                        this.listType = "batter";
                    }
                    var pageNumber = Number(_params.get("pageNum"));
                    if (!pageNumber) {
                        pageNumber = 1;
                    }
                    var tabKey = _params.get("tab");
                    this.queryParams = {
                        profile: 'player',
                        listname: tabKey,
                        sort: 'asc',
                        conference: 'all',
                        division: 'all',
                        limit: 10,
                        pageNum: pageNumber
                    };
                }
                MVPListPage.prototype.ngOnInit = function () {
                    var _this = this;
                    this.profileHeaderData = {
                        imageURL: global_settings_1.GlobalSettings.getSiteLogoUrl(),
                        imageRoute: ["MLB-page"],
                        text1: 'Last Updated: ',
                        text2: 'United States',
                        text3: "MLB's Most Valuable Players",
                        icon: 'fa fa-map-marker'
                    };
                    this._profileService.getMLBProfile()
                        .subscribe(function (data) {
                        _this.profileHeaderData = {
                            imageURL: global_settings_1.GlobalSettings.getImageUrl(data.headerData.logo),
                            imageRoute: ["MLB-page"],
                            text1: 'Last Updated: ' + global_functions_1.GlobalFunctions.formatUpdatedDate(data.headerData.lastUpdated),
                            text2: 'United States',
                            text3: "MLB's Most Valuable Players",
                            icon: 'fa fa-map-marker'
                        };
                        _this.loadTabs();
                    }, function (err) {
                        console.log("Error loading MLB profile");
                    });
                };
                MVPListPage.prototype.loadTabs = function () {
                    var _this = this;
                    this.tabs = this._service.getMVPTabs(this.listType, 'page');
                    if (this.tabs != null && this.tabs.length > 0) {
                        var selectedTab = this.tabs[0];
                        if (this.queryParams.listname) {
                            var matchingTabs = this.tabs.filter(function (tab) { return tab.tabDataKey == _this.queryParams.listname; });
                            if (matchingTabs.length > 0) {
                                selectedTab = matchingTabs[0];
                            }
                        }
                        this.selectedTabName = selectedTab.tabDisplayTitle;
                        this.getStandardList(selectedTab);
                    }
                };
                //PAGINATION
                //sets the total pages for particular lists to allow client to
                //move from page to page without losing the sorting of the list
                MVPListPage.prototype.setPaginationParams = function (input) {
                    if (!input)
                        return;
                    var navigationParams = {
                        type: this.listType,
                        tab: input.stat,
                        pageNum: input.pageNum
                    };
                    this.paginationParameters = {
                        index: input.pageNum,
                        max: Number(input.pageCount),
                        paginationType: 'page',
                        navigationPage: "MVP-list-tab-page",
                        navigationParams: navigationParams,
                        indexKey: 'pageNum'
                    };
                };
                MVPListPage.prototype.getStandardList = function (tab) {
                    var _this = this;
                    this.queryParams.listname = tab.tabDataKey;
                    this._service.getListModuleService(tab, this.queryParams)
                        .subscribe(function (tab) {
                        if (tab.data.listInfo) {
                            tab.data.listInfo.pageNum = _this.queryParams.pageNum;
                        }
                        _this.setPaginationParams(tab.data.listInfo);
                    }, function (err) {
                        _this.isError = true;
                        console.log('Error: List MVP API: ', err);
                    });
                };
                MVPListPage.prototype.tabSelected = function (tab) {
                    var tabRoute;
                    var tabNameFrom = this.selectedTabName; //get the tab we are changing from into a var before we change it
                    var tabNameTo = tab.tabDisplayTitle;
                    if (this.selectedTabName != tab.tabDisplayTitle) {
                        this.queryParams.pageNum = 1;
                    }
                    if (!tab.listData) {
                        this.getStandardList(tab);
                    }
                    else {
                        this.setPaginationParams(tab.data.listInfo);
                    }
                    this.selectedTabName = tab.tabDisplayTitle; //line added to update the current tab variable when tabs are changed without reloading the page
                    //actually redirect the page on tab change to update the URL for deep linking and to fix the pagination bug
                    if (tabNameTo !== tabNameFrom) {
                        tabRoute = ["MVP-list-tab-page", { type: this._params.params['type'], tab: tab.tabDataKey, pageNum: "1" }];
                        this._router.navigate(tabRoute);
                    }
                };
                MVPListPage = __decorate([
                    core_1.Component({
                        selector: 'mvp-list-page',
                        templateUrl: './app/webpages/mvp-list-page/mvp-list.page.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES, sidekick_wrapper_component_1.SidekickWrapper, error_component_1.ErrorComponent, loading_component_1.LoadingComponent, pagination_footer_component_1.PaginationFooter, backtab_component_1.BackTabComponent, title_component_1.TitleComponent, mvp_list_component_1.MVPListComponent, responsive_widget_component_1.ResponsiveWidget],
                        providers: [list_page_service_1.ListPageService, profile_header_service_1.ProfileHeaderService, platform_browser_1.Title],
                        inputs: []
                    }), 
                    __metadata('design:paramtypes', [list_page_service_1.ListPageService, router_deprecated_1.RouteParams, profile_header_service_1.ProfileHeaderService, platform_browser_1.Title, router_deprecated_1.Router])
                ], MVPListPage);
                return MVPListPage;
            }());
            exports_1("MVPListPage", MVPListPage);
        }
    }
});
