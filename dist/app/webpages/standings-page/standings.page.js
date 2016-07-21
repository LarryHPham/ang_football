System.register(['@angular/core', "@angular/router-deprecated", '@angular/platform-browser', "../../components/backtab/backtab.component", "../../components/title/title.component", "../../components/standings/standings.component", '../../components/loading/loading.component', '../../components/error/error.component', '../../services/profile-header.service', '../../services/standings.service', '../../global/global-interface', '../../global/global-settings', '../../global/global-functions', '../../global/mlb-global-functions', "../../components/sidekick-wrapper/sidekick-wrapper.component"], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, backtab_component_1, title_component_1, standings_component_1, loading_component_1, error_component_1, profile_header_service_1, standings_service_1, global_interface_1, global_settings_1, global_functions_1, mlb_global_functions_1, sidekick_wrapper_component_1;
    var StandingsPage;
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
            function (backtab_component_1_1) {
                backtab_component_1 = backtab_component_1_1;
            },
            function (title_component_1_1) {
                title_component_1 = title_component_1_1;
            },
            function (standings_component_1_1) {
                standings_component_1 = standings_component_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (error_component_1_1) {
                error_component_1 = error_component_1_1;
            },
            function (profile_header_service_1_1) {
                profile_header_service_1 = profile_header_service_1_1;
            },
            function (standings_service_1_1) {
                standings_service_1 = standings_service_1_1;
            },
            function (global_interface_1_1) {
                global_interface_1 = global_interface_1_1;
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
            }],
        execute: function() {
            StandingsPage = (function () {
                function StandingsPage(_params, _title, _profileService, _standingsService, _mlbFunctions) {
                    this._params = _params;
                    this._title = _title;
                    this._profileService = _profileService;
                    this._standingsService = _standingsService;
                    this._mlbFunctions = _mlbFunctions;
                    this.pageParams = {};
                    this.profileLoaded = false;
                    this.hasError = false;
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Standings"));
                    var type = _params.get("type");
                    if (type !== null && type !== undefined) {
                        type = type.toLowerCase();
                        this.pageParams.conference = global_interface_1.Conference[type];
                    }
                    var teamId = _params.get("teamId");
                    if (type == "team" && teamId !== null && teamId !== undefined) {
                        this.pageParams.teamId = Number(teamId);
                    }
                }
                StandingsPage.prototype.ngOnInit = function () {
                    var _this = this;
                    if (this.pageParams.teamId) {
                        this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(function (data) {
                            _this.profileLoaded = true;
                            _this.pageParams = data.pageParams;
                            _this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Standings", data.teamName));
                            var title = _this._standingsService.getPageTitle(_this.pageParams, data.teamName);
                            _this.titleData = _this._profileService.convertTeamPageHeader(data, title);
                            _this.tabs = _this._standingsService.initializeAllTabs(_this.pageParams);
                        }, function (err) {
                            _this.hasError = true;
                            console.log("Error getting team profile data for " + _this.pageParams.teamId, err);
                        });
                    }
                    else {
                        this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Standings", "MLB"));
                        var title = this._standingsService.getPageTitle(this.pageParams, null);
                        this.titleData = this.titleData = {
                            imageURL: global_settings_1.GlobalSettings.getSiteLogoUrl(),
                            imageRoute: ["MLB-page"],
                            text1: "",
                            text2: "United States",
                            text3: title,
                            icon: "fa fa-map-marker"
                        };
                        this.tabs = this._standingsService.initializeAllTabs(this.pageParams);
                    }
                };
                StandingsPage.prototype.standingsTabSelected = function (tabData) {
                    var _this = this;
                    this._standingsService.getStandingsTabData(tabData, this.pageParams, function (data) {
                        _this.getLastUpdatedDateForPage(data);
                    });
                };
                StandingsPage.prototype.getLastUpdatedDateForPage = function (data) {
                    //Getting the first 'lastUpdatedDate' listed in the StandingsData
                    if (data && data.length > 0 &&
                        data[0].tableData && data[0].tableData.rows &&
                        data[0].tableData.rows.length > 0) {
                        var lastUpdated = data[0].tableData.rows[0].lastUpdated;
                        this.titleData.text1 = "Last Updated: " + global_functions_1.GlobalFunctions.formatUpdatedDate(lastUpdated, false);
                    }
                };
                StandingsPage = __decorate([
                    core_1.Component({
                        selector: 'Standings-page',
                        templateUrl: './app/webpages/standings-page/standings.page.html',
                        directives: [sidekick_wrapper_component_1.SidekickWrapper, backtab_component_1.BackTabComponent, title_component_1.TitleComponent, standings_component_1.StandingsComponent, loading_component_1.LoadingComponent, error_component_1.ErrorComponent],
                        providers: [standings_service_1.StandingsService, profile_header_service_1.ProfileHeaderService, platform_browser_1.Title],
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.RouteParams, platform_browser_1.Title, profile_header_service_1.ProfileHeaderService, standings_service_1.StandingsService, mlb_global_functions_1.MLBGlobalFunctions])
                ], StandingsPage);
                return StandingsPage;
            }());
            exports_1("StandingsPage", StandingsPage);
        }
    }
});
