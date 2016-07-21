System.register(['@angular/core', "@angular/router-deprecated", '@angular/platform-browser', "../../components/backtab/backtab.component", "../../components/title/title.component", '../../components/loading/loading.component', '../../components/error/error.component', '../../global/global-functions', '../../global/mlb-global-functions', '../../global/global-settings', "../../components/season-stats/season-stats.component", '../../services/profile-header.service', '../../services/season-stats.service', "../../components/sidekick-wrapper/sidekick-wrapper.component"], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, backtab_component_1, title_component_1, loading_component_1, error_component_1, global_functions_1, mlb_global_functions_1, global_settings_1, season_stats_component_1, profile_header_service_1, season_stats_service_1, sidekick_wrapper_component_1;
    var SeasonStatsPage;
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
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (error_component_1_1) {
                error_component_1 = error_component_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (season_stats_component_1_1) {
                season_stats_component_1 = season_stats_component_1_1;
            },
            function (profile_header_service_1_1) {
                profile_header_service_1 = profile_header_service_1_1;
            },
            function (season_stats_service_1_1) {
                season_stats_service_1 = season_stats_service_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            }],
        execute: function() {
            SeasonStatsPage = (function () {
                function SeasonStatsPage(_params, _profileService, _seasonStatsPageService, _mlbFunctions, _title) {
                    this._params = _params;
                    this._profileService = _profileService;
                    this._seasonStatsPageService = _seasonStatsPageService;
                    this._mlbFunctions = _mlbFunctions;
                    this._title = _title;
                    this.pageParams = {};
                    this.profileLoaded = false;
                    this.hasError = false;
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Season Stats"));
                    var playerId = _params.get("playerId");
                    this.pageParams.playerId = Number(playerId);
                }
                SeasonStatsPage.prototype.setupTitleData = function (imageUrl, teamName, playerId, playerName) {
                    var profileLink = ["MLB-page"];
                    if (playerId) {
                        profileLink = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(teamName, playerName, playerId);
                    }
                    var title = this._seasonStatsPageService.getPageTitle(this.pageParams, playerName);
                    this.titleData = {
                        imageURL: imageUrl,
                        imageRoute: profileLink,
                        text1: "",
                        text2: "United States",
                        text3: title,
                        icon: "fa fa-map-marker"
                    };
                };
                SeasonStatsPage.prototype.ngOnInit = function () {
                    var _this = this;
                    if (this.pageParams.playerId) {
                        this._profileService.getPlayerProfile(this.pageParams.playerId).subscribe(function (data) {
                            _this.profileLoaded = true;
                            _this.pageParams = data.pageParams;
                            _this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Season Stats", data.headerData.info.playerName));
                            _this.setupTitleData(data.fullProfileImageUrl, data.headerData.info.teamName, data.pageParams.playerId.toString(), data.headerData.info.playerName);
                            _this.tabs = _this._seasonStatsPageService.initializeAllTabs(_this.pageParams);
                        }, function (err) {
                            _this.hasError = true;
                            console.log("Error getting season stats data: " + err);
                        });
                    }
                };
                SeasonStatsPage.prototype.seasonStatsTabSelected = function (tab) {
                    var _this = this;
                    this._seasonStatsPageService.getSeasonStatsTabData(tab, this.pageParams, function (data) {
                        _this.getLastUpdatedDateForPage(data);
                    });
                };
                SeasonStatsPage.prototype.getLastUpdatedDateForPage = function (data) {
                    if (data && data.length > 0 &&
                        data[0].tableData && data[0].tableData.rows &&
                        data[0].tableData.rows.length > 0) {
                        var lastUpdated = data[0].tableData.rows[0].lastUpdated;
                        this.titleData.text1 = "Last Updated: " + global_functions_1.GlobalFunctions.formatUpdatedDate(lastUpdated, false);
                    }
                };
                SeasonStatsPage = __decorate([
                    core_1.Component({
                        selector: 'Season-stats-page',
                        templateUrl: './app/webpages/season-stats-page/season-stats.page.html',
                        directives: [sidekick_wrapper_component_1.SidekickWrapper, backtab_component_1.BackTabComponent, title_component_1.TitleComponent, season_stats_component_1.SeasonStatsComponent, loading_component_1.LoadingComponent, error_component_1.ErrorComponent],
                        providers: [season_stats_service_1.SeasonStatsPageService, profile_header_service_1.ProfileHeaderService, platform_browser_1.Title],
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.RouteParams, profile_header_service_1.ProfileHeaderService, season_stats_service_1.SeasonStatsPageService, mlb_global_functions_1.MLBGlobalFunctions, platform_browser_1.Title])
                ], SeasonStatsPage);
                return SeasonStatsPage;
            }());
            exports_1("SeasonStatsPage", SeasonStatsPage);
        }
    }
});
