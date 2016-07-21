System.register(['@angular/core', '@angular/router-deprecated', '@angular/platform-browser', '../../components/detailed-list-item/detailed-list-item.component', '../../components/module-footer/module-footer.component', '../../components/carousels/slider-carousel/slider-carousel.component', '../../components/title/title.component', '../../components/backtab/backtab.component', '../../services/list-page.service', '../../services/profile-header.service', '../../components/pagination-footer/pagination-footer.component', "../../components/loading/loading.component", "../../components/error/error.component", "../../global/global-settings", "../../services/dynamic-list-page.service", "../../components/sidekick-wrapper/sidekick-wrapper.component", '../../components/responsive-widget/responsive-widget.component'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, detailed_list_item_component_1, module_footer_component_1, slider_carousel_component_1, title_component_1, backtab_component_1, list_page_service_1, profile_header_service_1, pagination_footer_component_1, loading_component_1, error_component_1, global_settings_1, dynamic_list_page_service_1, sidekick_wrapper_component_1, responsive_widget_component_1;
    var ListPage;
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
            function (detailed_list_item_component_1_1) {
                detailed_list_item_component_1 = detailed_list_item_component_1_1;
            },
            function (module_footer_component_1_1) {
                module_footer_component_1 = module_footer_component_1_1;
            },
            function (slider_carousel_component_1_1) {
                slider_carousel_component_1 = slider_carousel_component_1_1;
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
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (dynamic_list_page_service_1_1) {
                dynamic_list_page_service_1 = dynamic_list_page_service_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            },
            function (responsive_widget_component_1_1) {
                responsive_widget_component_1 = responsive_widget_component_1_1;
            }],
        execute: function() {
            ListPage = (function () {
                function ListPage(listService, _profileService, params, dynamicWidget, _title) {
                    this.listService = listService;
                    this._profileService = _profileService;
                    this.params = params;
                    this.dynamicWidget = dynamicWidget;
                    this._title = _title;
                    this.footerStyle = {
                        ctaBoxClass: "list-footer",
                        ctaBtnClass: "list-footer-btn",
                        hasIcon: true,
                    };
                    this.isError = false;
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Lists"));
                    if (params.params['query'] != null) {
                        var query = params.params['query'];
                        // Setup this way in case we want to switch out null with some default values
                        var twArr = query.match(/tw-(.*?)(\+|$)/);
                        this.tw = twArr != null && twArr.length > 1 ? twArr[1] : null;
                        var swArr = query.match(/sw-(.*?)(\+|$)/);
                        this.sw = swArr != null && swArr.length > 1 ? swArr[1] : null;
                        // input always needs to be last item
                        var inputArr = query.match(/input-(.*)/);
                        this.input = inputArr != null && inputArr.length > 1 ? inputArr[1] : null;
                        this.pageNumber = 1;
                    }
                }
                ListPage.prototype.getListPage = function (urlParams) {
                    if (urlParams.query != null) {
                        this.getDynamicList();
                    }
                    else {
                        this.getStandardList(urlParams);
                    }
                };
                //PAGINATION
                //sets the total pages for particular lists to allow client to move from page to page without losing the sorting of the list
                ListPage.prototype.setPaginationParams = function (input) {
                    var info = input.listInfo;
                    var params = this.params.params;
                    var navigationParams = {
                        profile: params['profile'],
                        listname: params['listname'],
                        sort: params['sort'],
                        conference: params['conference'],
                        division: params['division'],
                        limit: params['limit'],
                    };
                    var navigationPage = this.detailedDataArray ? "List-page" : "Error-page";
                    this.paginationParameters = {
                        index: params['pageNum'] != null ? Number(params['pageNum']) : null,
                        max: Number(input.pageCount),
                        paginationType: 'page',
                        navigationPage: navigationPage,
                        navigationParams: navigationParams,
                        indexKey: 'pageNum'
                    };
                };
                ListPage.prototype.setDynamicPagination = function (input) {
                    var navigationParams = {
                        query: this.params.params['query']
                    };
                    var navigationPage = this.detailedDataArray ? "Dynamic-list-page" : "Error-page";
                    this.paginationParameters = {
                        index: this.pageNumber,
                        max: Number(input.pageCount),
                        paginationType: 'page',
                        navigationPage: navigationPage,
                        navigationParams: navigationParams,
                        indexKey: 'pageNum'
                    };
                };
                ListPage.prototype.getStandardList = function (urlParams) {
                    var _this = this;
                    var errorMessage = "Sorry, we do not currently have any data for this list";
                    this.listService.getListPageService(urlParams, errorMessage)
                        .subscribe(function (list) {
                        _this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle(list.listDisplayName, "Lists"));
                        _this.profileHeaderData = list.profHeader;
                        if (list.listData.length == 0) {
                            _this.detailedDataArray = null;
                        }
                        else {
                            _this.detailedDataArray = list.listData;
                        }
                        _this.setPaginationParams(list.pagination);
                        _this.carouselDataArray = list.carData;
                    }, function (err) {
                        _this.isError = true;
                        console.log('Error: list API: ', err);
                        // this.isError = true;
                    });
                };
                ListPage.prototype.getDynamicList = function () {
                    var _this = this;
                    if (!this.tw) {
                        // Not enough parameter : display error message
                        this.isError = true;
                        return;
                    }
                    this.dynamicWidget.getWidgetData(this.tw, this.sw, this.input)
                        .subscribe(function (list) {
                        _this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle(list.listDisplayTitle, "Lists"));
                        _this.profileHeaderData = list.profHeader;
                        if (list.listData.length == 0) {
                            _this.detailedDataArray = null;
                        }
                        else {
                            _this.detailedDataArray = list.listData;
                        }
                        _this.setDynamicPagination(list.pagination);
                        _this.carouselDataArray = list.carData;
                    }, function (err) {
                        _this.isError = true;
                        console.log(err);
                    });
                };
                ListPage.prototype.newIndex = function (index) {
                    this.pageNumber = index;
                    window.scrollTo(0, 0);
                };
                ListPage.prototype.ngOnInit = function () {
                    var _this = this;
                    this._profileService.getMLBProfile()
                        .subscribe(function (data) {
                        _this.getListPage(_this.params.params);
                    }, function (err) {
                        console.log("Error loading MLB profile");
                    });
                };
                ListPage = __decorate([
                    core_1.Component({
                        selector: 'list-page',
                        templateUrl: './app/webpages/list-page/list.page.html',
                        directives: [sidekick_wrapper_component_1.SidekickWrapper, error_component_1.ErrorComponent, loading_component_1.LoadingComponent, pagination_footer_component_1.PaginationFooter, backtab_component_1.BackTabComponent, title_component_1.TitleComponent, slider_carousel_component_1.SliderCarousel, detailed_list_item_component_1.DetailedListItem, module_footer_component_1.ModuleFooter, responsive_widget_component_1.ResponsiveWidget],
                        providers: [list_page_service_1.ListPageService, dynamic_list_page_service_1.DynamicWidgetCall, platform_browser_1.Title, profile_header_service_1.ProfileHeaderService],
                        inputs: []
                    }), 
                    __metadata('design:paramtypes', [list_page_service_1.ListPageService, profile_header_service_1.ProfileHeaderService, router_deprecated_1.RouteParams, dynamic_list_page_service_1.DynamicWidgetCall, platform_browser_1.Title])
                ], ListPage);
                return ListPage;
            }());
            exports_1("ListPage", ListPage);
        }
    }
});
