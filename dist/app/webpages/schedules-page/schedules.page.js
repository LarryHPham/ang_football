System.register(['@angular/core', '@angular/router-deprecated', '@angular/platform-browser', "../../global/global-settings", '../../components/detailed-list-item/detailed-list-item.component', '../../components/module-footer/module-footer.component', '../../components/carousels/slider-carousel/slider-carousel.component', '../../components/title/title.component', '../../components/backtab/backtab.component', '../../services/profile-header.service', '../../components/pagination-footer/pagination-footer.component', "../../components/loading/loading.component", "../../components/error/error.component", '../../services/schedules.service', '../../components/schedules/schedules.component', "../../components/sidekick-wrapper/sidekick-wrapper.component", '../../components/responsive-widget/responsive-widget.component'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, global_settings_1, detailed_list_item_component_1, module_footer_component_1, slider_carousel_component_1, title_component_1, backtab_component_1, profile_header_service_1, pagination_footer_component_1, loading_component_1, error_component_1, schedules_service_1, schedules_component_1, sidekick_wrapper_component_1, responsive_widget_component_1;
    var SchedulesPage;
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
            function (schedules_service_1_1) {
                schedules_service_1 = schedules_service_1_1;
            },
            function (schedules_component_1_1) {
                schedules_component_1 = schedules_component_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            },
            function (responsive_widget_component_1_1) {
                responsive_widget_component_1 = responsive_widget_component_1_1;
            }],
        execute: function() {
            SchedulesPage = (function () {
                function SchedulesPage(_schedulesService, profHeadService, params, _title, _router) {
                    this._schedulesService = _schedulesService;
                    this.profHeadService = profHeadService;
                    this.params = params;
                    this._title = _title;
                    this._router = _router;
                    this.isError = false;
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Schedules"));
                    this.initialPage = Number(this.params.get("pageNum"));
                    this.initialTabKey = this.params.get("tab");
                }
                //grab tab to make api calls for post of pre event table
                SchedulesPage.prototype.scheduleTab = function (tab) {
                    if (tab == 'Upcoming Games') {
                        this.selectedTabKey = "pre-event";
                    }
                    else {
                        this.selectedTabKey = "post-event";
                    }
                    // Uncomment if we want to enable URL changing when switching tabs.
                    // However! with the way the scroll-to-top is set up, it will move the
                    // page to the top each time the tab is changed, which QA doesn't want.
                    // if ( this.initialTabKey != this.selectedTabKey ) {
                    //   var navigationParams = {
                    //     pageNum: 1,
                    //     tab: this.selectedTabKey
                    //   };
                    //   var teamName = this.params.get('teamName');
                    //   var teamId = this.params.get('teamId');
                    //   if(teamName){
                    //     navigationParams['teamName'] = teamName;
                    //   }
                    //   if(teamId){
                    //     navigationParams['teamId'] = teamId;
                    //   }
                    //   var navigationPage = teamName ? 'Schedules-page-team-tab' : 'Schedules-page-league-tab';
                    //   this._router.navigate([navigationPage, navigationParams]);
                    // }
                    this.getSchedulesData(this.selectedTabKey, this.selectedTabKey == this.initialTabKey ? this.initialPage : 1);
                };
                SchedulesPage.prototype.getSchedulesData = function (status, pageNum) {
                    var _this = this;
                    var teamId = this.params.params['teamId']; //determines to call league page or team page for schedules-table
                    if (teamId) {
                        this.profHeadService.getTeamProfile(Number(teamId))
                            .subscribe(function (data) {
                            _this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Schedules", data.teamName));
                            _this.profileHeaderData = _this.profHeadService.convertTeamPageHeader(data, "Current Season Schedule - " + data.teamName);
                            _this.errorData = {
                                data: data.teamName + " has no record of any more games for the current season.",
                                icon: "fa fa-calendar-times-o"
                            };
                        }, function (err) {
                            _this.isError = true;
                            console.log('Error: Schedules Profile Header API: ', err);
                            // this.isError = true;
                        });
                        this._schedulesService.getSchedulesService('team', status, 10, pageNum, false, teamId) // isTeamProfilePage = false
                            .subscribe(function (data) {
                            _this.schedulesData = data;
                            if (typeof _this.tabData == 'undefined') {
                                _this.tabData = data.tabs;
                            }
                            _this.setPaginationParams(data.pageInfo, status, pageNum);
                        }, function (err) {
                            console.log("Error getting Schedules Data");
                        });
                    }
                    else {
                        this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Schedules", "MLB"));
                        this.profHeadService.getMLBProfile()
                            .subscribe(function (data) {
                            var currentDate = new Date(); // no stat for date so will grab current year client is on
                            var display;
                            if (currentDate.getFullYear() == currentDate.getFullYear()) {
                                display = "Current Season";
                            }
                            var pageTitle = display + " Schedules - " + data.headerData.profileNameShort;
                            _this.profileHeaderData = _this.profHeadService.convertMLBHeader(data.headerData, pageTitle);
                            _this.errorData = {
                                data: data.headerData.profileNameShort + " has no record of any more games for the current season.",
                                icon: "fa fa-remove"
                            };
                        }, function (err) {
                            _this.isError = true;
                            console.log('Error: Schedules Profile Header API: ', err);
                        });
                        this._schedulesService.getSchedulesService('league', status, 10, pageNum)
                            .subscribe(function (data) {
                            // console.log('got scheuldes data');
                            _this.schedulesData = data;
                            if (typeof _this.tabData == 'undefined') {
                                _this.tabData = data.tabs;
                            }
                            _this.setPaginationParams(data.pageInfo, status, pageNum);
                        }, function (err) {
                            console.log("Error getting Schedules Data");
                        });
                    }
                };
                //PAGINATION
                //sets the total pages for particular lists to allow client to move from page to page without losing the sorting of the list
                SchedulesPage.prototype.setPaginationParams = function (input, tabKey, pageNum) {
                    // var pageType;
                    // console.log(params)
                    //'/schedules/:teamName/:teamId/:pageNum'
                    var navigationParams = {
                        pageNum: pageNum,
                        tab: tabKey
                    };
                    var teamName = this.params.get('teamName');
                    var teamId = this.params.get('teamId');
                    if (teamName) {
                        navigationParams['teamName'] = teamName;
                    }
                    if (teamId) {
                        navigationParams['teamId'] = teamId;
                    }
                    this.paginationParameters = {
                        index: pageNum,
                        max: input.totalPages,
                        paginationType: 'module',
                    };
                };
                SchedulesPage.prototype.newIndex = function (newPage) {
                    window.scrollTo(0, 0);
                    this.getSchedulesData(this.selectedTabKey, newPage);
                };
                SchedulesPage.prototype.ngOnInit = function () {
                    if (!this.initialTabKey) {
                        this.initialTabKey = 'pre-event';
                    }
                    if (this.initialPage <= 0) {
                        this.initialPage = 1;
                    }
                    this.getSchedulesData(this.initialTabKey, this.initialPage);
                };
                SchedulesPage = __decorate([
                    core_1.Component({
                        selector: 'schedules-page',
                        templateUrl: './app/webpages/schedules-page/schedules.page.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES, sidekick_wrapper_component_1.SidekickWrapper, schedules_component_1.SchedulesComponent, error_component_1.ErrorComponent, loading_component_1.LoadingComponent, pagination_footer_component_1.PaginationFooter, backtab_component_1.BackTabComponent, title_component_1.TitleComponent, slider_carousel_component_1.SliderCarousel, detailed_list_item_component_1.DetailedListItem, module_footer_component_1.ModuleFooter, responsive_widget_component_1.ResponsiveWidget],
                        providers: [schedules_service_1.SchedulesService, profile_header_service_1.ProfileHeaderService, platform_browser_1.Title],
                        inputs: []
                    }), 
                    __metadata('design:paramtypes', [schedules_service_1.SchedulesService, profile_header_service_1.ProfileHeaderService, router_deprecated_1.RouteParams, platform_browser_1.Title, router_deprecated_1.Router])
                ], SchedulesPage);
                return SchedulesPage;
            }());
            exports_1("SchedulesPage", SchedulesPage);
        }
    }
});
