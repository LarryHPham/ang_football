System.register(['@angular/core', '@angular/router-deprecated', '@angular/platform-browser', '../../components/module-footer/module-footer.component', '../../components/carousels/slider-carousel/slider-carousel.component', '../../components/title/title.component', '../../components/backtab/backtab.component', '../../components/error/data-box/data-box.component', "../../components/list-of-lists-item/list-of-lists-item.component", "../../services/list-of-lists.service", "../../components/loading/loading.component", "../../components/error/error.component", "../../components/pagination-footer/pagination-footer.component", "../../global/global-settings", "../../global/global-functions", "../../global/mlb-global-functions", "../../components/sidekick-wrapper/sidekick-wrapper.component", '../../services/profile-header.service', '../../components/responsive-widget/responsive-widget.component'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, module_footer_component_1, slider_carousel_component_1, title_component_1, backtab_component_1, data_box_component_1, list_of_lists_item_component_1, list_of_lists_service_1, loading_component_1, error_component_1, pagination_footer_component_1, global_settings_1, global_functions_1, mlb_global_functions_1, sidekick_wrapper_component_1, profile_header_service_1, responsive_widget_component_1;
    var ListOfListsPage;
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
            function (data_box_component_1_1) {
                data_box_component_1 = data_box_component_1_1;
            },
            function (list_of_lists_item_component_1_1) {
                list_of_lists_item_component_1 = list_of_lists_item_component_1_1;
            },
            function (list_of_lists_service_1_1) {
                list_of_lists_service_1 = list_of_lists_service_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (error_component_1_1) {
                error_component_1 = error_component_1_1;
            },
            function (pagination_footer_component_1_1) {
                pagination_footer_component_1 = pagination_footer_component_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            },
            function (profile_header_service_1_1) {
                profile_header_service_1 = profile_header_service_1_1;
            },
            function (responsive_widget_component_1_1) {
                responsive_widget_component_1 = responsive_widget_component_1_1;
            }],
        execute: function() {
            ListOfListsPage = (function () {
                function ListOfListsPage(listService, _profileService, _params, _title) {
                    this.listService = listService;
                    this._profileService = _profileService;
                    this._params = _params;
                    this._title = _title;
                    this.isError = false;
                    this.paginationSize = 10;
                    this.index = 0;
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle("List of Lists"));
                    this.pageType = this._params.get("type");
                    if (this.pageType == null) {
                        this.pageType = "league";
                    }
                }
                ListOfListsPage.prototype.getListOfListsPage = function (urlParams, logoUrl) {
                    var _this = this;
                    this.listService.getListOfListsService(urlParams, this.pageType, "page")
                        .subscribe(function (list) {
                        if (list.listData.length == 0) {
                            _this.detailedDataArray = null;
                        }
                        else {
                            _this.detailedDataArray = list.listData;
                        }
                        _this.setPaginationParams(list.pagination);
                        _this.carouselDataArray = list.carData;
                        var profileName = "MLB";
                        var profileRoute = ["MLB-page"];
                        var profileImage = logoUrl ? logoUrl : global_settings_1.GlobalSettings.getSiteLogoUrl();
                        switch (urlParams.type) {
                            case "player":
                                profileName = list.targetData.playerName;
                                profileRoute = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(list.targetData.teamName, list.targetData.playerName, list.targetData.playerId);
                                profileImage = global_settings_1.GlobalSettings.getImageUrl(list.targetData.imageUrl);
                                break;
                            case "team":
                                profileName = list.targetData.teamName;
                                profileRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(list.targetData.teamName, list.targetData.teamId);
                                profileImage = global_settings_1.GlobalSettings.getImageUrl(list.targetData.teamLogo);
                                break;
                            default: break;
                        }
                        _this.profileName = profileName;
                        _this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle("List of Lists", _this.profileName));
                        _this.titleData = {
                            imageURL: profileImage,
                            imageRoute: profileRoute,
                            text1: 'Last Updated: ' + global_functions_1.GlobalFunctions.formatUpdatedDate(list.lastUpdated),
                            text2: ' United States',
                            text3: 'Top lists - ' + _this.profileName,
                            icon: 'fa fa-map-marker'
                        };
                    }, function (err) {
                        _this.isError = true;
                        console.log('Error: ListOfLists API: ', err);
                    });
                };
                //PAGINATION
                //sets the total pages for particular lists to allow client to move from page to page without losing the sorting of the list
                ListOfListsPage.prototype.setPaginationParams = function (input) {
                    var params = this._params.params;
                    var navigationParams = {
                        limit: params['limit'],
                        pageNum: params['pageNum'],
                    };
                    if (params['scope'] != null) {
                        navigationParams['scope'] = params['scope'];
                    }
                    if (params['id'] != null) {
                        navigationParams['id'] = params['id'];
                    }
                    if (this.pageType != "league") {
                        navigationParams['type'] = this.pageType;
                    }
                    var navigationPage = this.pageType == "league" ? 'List-of-lists-league-page' : 'List-of-lists-page';
                    if (!this.detailedDataArray) {
                        navigationPage = "Error-page";
                    }
                    else if (navigationParams['scope']) {
                        navigationPage = 'List-of-lists-page-scoped';
                    }
                    this.paginationParameters = {
                        index: params['pageNum'] != null ? Number(params['pageNum']) : null,
                        max: Number(input.pageCount),
                        paginationType: 'page',
                        navigationPage: navigationPage,
                        navigationParams: navigationParams,
                        indexKey: 'pageNum'
                    };
                };
                ListOfListsPage.prototype.ngOnInit = function () {
                    var _this = this;
                    if (this.pageType == "league") {
                        this._profileService.getMLBProfile()
                            .subscribe(function (data) {
                            _this.getListOfListsPage(_this._params.params, global_settings_1.GlobalSettings.getImageUrl(data.headerData.logo));
                        }, function (err) {
                            console.log("Error loading MLB profile");
                        });
                    }
                    else {
                        this.getListOfListsPage(this._params.params);
                    }
                };
                ListOfListsPage = __decorate([
                    core_1.Component({
                        selector: 'list-of-lists-page',
                        templateUrl: './app/webpages/list-of-lists-page/list-of-lists.page.html',
                        directives: [sidekick_wrapper_component_1.SidekickWrapper, data_box_component_1.NoDataBox, backtab_component_1.BackTabComponent, title_component_1.TitleComponent, slider_carousel_component_1.SliderCarousel, list_of_lists_item_component_1.ListOfListsItem, module_footer_component_1.ModuleFooter, loading_component_1.LoadingComponent, error_component_1.ErrorComponent, pagination_footer_component_1.PaginationFooter, responsive_widget_component_1.ResponsiveWidget],
                        providers: [list_of_lists_service_1.ListOfListsService, platform_browser_1.Title, profile_header_service_1.ProfileHeaderService],
                        inputs: []
                    }), 
                    __metadata('design:paramtypes', [list_of_lists_service_1.ListOfListsService, profile_header_service_1.ProfileHeaderService, router_deprecated_1.RouteParams, platform_browser_1.Title])
                ], ListOfListsPage);
                return ListOfListsPage;
            }());
            exports_1("ListOfListsPage", ListOfListsPage);
        }
    }
});
